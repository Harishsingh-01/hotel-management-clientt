const express = require("express");
const jwt = require("jsonwebtoken");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const verifyToken = require("../middleware/authMiddleware"); // Middleware to verify JWT

const router = express.Router();

// 📌 Book a Room (Protected Route)
// router.post("/book", verifyToken, async (req, res) => {
//   console.log("coming or not");
//   try {
//     const { roomId, checkIn, checkOut, totalPrice } = req.body;
//     const userId = req.user?.id;
//     console.log("Received booking request:", req.body); // Debugging log


//     if (!userId) {
//       return res.status(401).json({ message: "Unauthorized: User ID missing" });
//     }

//     const room = await Room.findById(roomId);
//     if (!room) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     // Check if room is already booked for the selected dates
//     const overlappingBooking = await Booking.findOne({
//       roomId,
//       $or: [
//         { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } },
//       ],
//     });

//     if (overlappingBooking) {
//       return res.status(400).json({ message: "Room is already booked for selected dates" });
//     }

//     // Create a new booking
//     const booking = new Booking({ userId, roomId, checkIn, checkOut, totalPrice });
//     await booking.save();

//     console.log("Booking successful:", booking);
//     res.status(201).json({ message: "Room booked successfully", booking });
//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(500).json({ message: "Error booking room", error: error.message });
//   }
// });


// 📌 Get all bookings for a logged-in user (Protected Route)
  router.get("/userbookings", verifyToken, async (req, res) => {
 
    try {
      
      const userId = req.user?.id; // Ensure userId is extracted correctly

      
      const bookings = await Booking.find({ userId }).populate("roomId");

      if (!bookings.length) {
        return res.status(404).json({ message: "No bookings found" });
      }

      res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);    
      res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
  });


  router.post("/update-status", async (req, res) => {
  try {
    const today = new Date();

    // Find expired bookings
    const expiredBookings = await Booking.find({ checkoutDate: { $lt: today } });

    // Update each expired booking's room to available
    for (let booking of expiredBookings) {
      await Room.findByIdAndUpdate(booking.roomId, { available: true });
    }

    res.json({ message: "Room availability updated" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


// // ✅ Handle Payment Success from Stripe success_url
// router.get("/successs", async (req, res) => {
//   try {
//     const { roomId, userId, checkIn, checkOut, totalPrice } = req.query;

//     if (!roomId || !userId || !checkIn || !checkOut || !totalPrice) {
//       return res.status(400).json({ error: "Missing booking details" });
//     }

//     console.log("📤 Processing booking:", { roomId, userId, checkIn, checkOut, totalPrice });

//     // 🔹 Check if room exists
//     const room = await Room.findById(roomId);
//     if (!room || !room.available) {
//       return res.status(400).json({ message: "Room is not available." });
//     }

//     // 🔹 Save booking in database
//     const booking = new Booking({ userId, roomId, checkIn, checkOut, totalPrice });
//     await booking.save();

//     // 🔹 Mark room as unavailable
//     room.available = false;
//     await room.save();

//     console.log("✅ Booking confirmed:", booking);

//     // 🔹 Redirect user to frontend booking success page
//     res.redirect(`http://localhost:3000/success?roomId=${roomId}&userId=${userId}`);
//   } catch (error) {
//     console.error("❌ Booking Error:", error);
//     res.status(500).json({ error: "Booking failed!" });
//   }
// });



module.exports = router;
