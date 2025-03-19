const express = require("express");
const Room = require("../models/Room");
const User =  require("../models/User");

const router = express.Router();


// Get all rooms
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
});

// Get a single room by ID (with availability check)
router.get("/rooms/:id", async (req, res) => {
  try {
    console.log("📩 Received request for room:", req.params.id); // Debugging
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      console.log("⚠️ Room not found!");
      return res.status(404).json({ message: "Room not found" });
    }

    console.log("✅ Sending Room Data:", room); // Debugging
    res.json(room);
  } catch (error) {
    console.error("❌ Error fetching room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Mark Room as Booked After Payment ✅
router.post("/update-availability", async (req, res) => {
  try {
    const { roomId } = req.body;
    if (!roomId) return res.status(400).json({ error: "Room ID is required" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    if (!room.available) return res.status(400).json({ error: "Room already booked" });

    room.available = false;
    await room.save();

    res.json({ message: "Room booked successfully", room });
  } catch (error) {
    res.status(500).json({ error: "Failed to update room availability" });
  }
});

// Update a room (Admin Only)
router.put("/rooms/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: "Room updated", room });
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error });
  }
});

// Delete a room (Admin Only)
router.delete("/rooms/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error });
  }
});

module.exports = router;

router.get("/users/:userId", async (req, res) => {
  
  try {


    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user email" });
  }
});
