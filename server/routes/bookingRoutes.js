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
      console.log("🔹 API Hit: /api/user (Bookings Route)"); // ✅ Confirm API is being called

    try {
      console.log("Authorization Header:", req.header("Authorization")); // Debugging token
      console.log("User ID from token:", req.user.id); // Debugging userId
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


module.exports = router;
