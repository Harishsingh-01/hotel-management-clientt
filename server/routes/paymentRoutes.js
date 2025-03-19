const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Room = require("../models/Room");
const Booking = require("../models/Booking"); // Import Booking model
const router = express.Router();
const mongoose = require("mongoose"); // Import Mongoose for transactions


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
      success_url: `http://localhost:3000/success?roomId=${roomId}&userId=${userId}&checkIn=${checkIn}&checkOut=${checkOut}&totalPrice=${price}`,
      cancel_url: "http://localhost:3000/cancel",
    });
    console.log("testing1");
    

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Step 2: Confirm Booking After Payment Success
router.post("/confirm-booking", async (req, res) => {
  console.log("Booking attempt...");

  const session = await mongoose.startSession(); // Start DB transaction
  session.startTransaction();

  try {
    const { roomId, userId, checkIn, checkOut, totalPrice } = req.body;
    if (!roomId || !userId || !checkIn || !checkOut || !totalPrice) {
      return res.status(400).json({ error: "Missing booking details" });
    }

    // 🔹 Check for duplicate booking
    const existingBooking = await Booking.findOne({ userId, roomId, checkIn, checkOut }).session(session);
    if (existingBooking) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "You have already booked this room." });
    }

    // 🔹 Check if room is available
    const room = await Room.findById(roomId).session(session);
    if (!room || !room.available) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Room is not available." });
    }

    // 🔹 Save booking
    const booking = new Booking({ userId, roomId, checkIn, checkOut, totalPrice });
    await booking.save({ session });

    // 🔹 Mark room as unavailable
    room.available = false;
    await room.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Booking confirmed successfully!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Booking failed!" });
  }
});


module.exports = router;
