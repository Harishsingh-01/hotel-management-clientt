const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Room = require("../models/Room");
const Booking = require("../models/Booking"); // Import Booking model
const router = express.Router();
const mongoose = require("mongoose"); // Import Mongoose for transactions

// Helper function to handle retries
const executeWithRetry = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (error.code === 112 && attempt < maxRetries) { // WriteConflict error
        await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};

// Step 1: Create Checkout Session & Handle Payment
router.post("/create-checkout-session", async (req, res) => {
  try {
    const { price, roomId, userId, checkIn, checkOut } = req.body;

    if (!price || price <= 0 || !roomId || !userId || !checkIn || !checkOut) {
      return res.status(400).json({ error: "Invalid booking details" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Hotel Room Booking" },
            unit_amount: price * 100, // Convert INR to paise
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://hotel-management-clientt-git-main-harishsingh-01s-projects.vercel.app/success?roomId=${roomId}&userId=${userId}&checkIn=${checkIn}&checkOut=${checkOut}&totalPrice=${price}`,
    });
     

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Confirm Booking After Payment Success
router.post("/confirm-booking", async (req, res) => {
  let session = null;

  try {
    const { roomId, userId, checkIn, checkOut, totalPrice } = req.body;

    // Validate input
    if (!roomId || !userId || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ error: "Missing booking details" });
    }

    // Check for existing bookings without transaction
    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) }
        }
      ],
      status: { $ne: 'cancelled' }
    });

    if (existingBooking) {
      return res.status(400).json({ error: "Room is already booked for these dates" });
    }

    // Check room availability
    const room = await Room.findById(roomId);
    if (!room || !room.available) {
      return res.status(400).json({ error: "Room is not available" });
    }

    // Create booking
    const booking = new Booking({
      userId,
      roomId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice,
      status: 'booked'
    });

    // Save booking
    await booking.save();

    // Update room availability
    room.available = false;
    await room.save();

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully!",
      bookingId: booking._id
    });

  } catch (error) {
    console.error("Booking Error:", error);

    // If session exists, abort transaction
    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch (sessionError) {
        console.error("Session abort error:", sessionError);
      }
    }

    // Handle specific error cases
    if (error.code === 251) {
      return res.status(500).json({
        error: "Booking system temporarily unavailable. Please try again."
      });
    }

    // Handle duplicate booking error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "This room is already booked for the selected dates"
      });
    }

    res.status(500).json({
      error: "Unable to complete booking. Please try again.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Ensure session is ended if it exists
    if (session) {
      try {
        session.endSession();
      } catch (error) {
        console.error("Session end error:", error);
      }
    }
  }
});


module.exports = router;
