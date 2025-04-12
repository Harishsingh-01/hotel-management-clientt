const express = require("express");
const Room = require("../models/Room");
const Review = require("../models/Review");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const reviews = await Review.find({ roomId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    const roomData = room.toObject();
    
    if (reviews && reviews.length > 0) {
      const ratingCounts = Array(5).fill(0);
      let totalRating = 0;

      reviews.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCounts[review.rating - 1]++;
          totalRating += review.rating;
        }
      });

      roomData.averageRating = (totalRating / reviews.length).toFixed(1);
      roomData.reviewCount = reviews.length;
      roomData.ratingCounts = ratingCounts;
      roomData.reviews = reviews;
    } else {
      roomData.averageRating = 0;
      roomData.reviewCount = 0;
      roomData.ratingCounts = [0, 0, 0, 0, 0];
      roomData.reviews = [];
    }

    res.json(roomData);
  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({ message: 'Error fetching room details' });
  }
});

router.get("/room/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error("❌ Error fetching room:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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

router.put("/admin/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      name: req.body.name,
      type: req.body.type,
      price: Number(req.body.price),
      amenities: req.body.amenities,
      description: req.body.description,
      image: req.body.image,
      available: req.body.available
    };

    const room = await Room.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ 
      success: true,
      message: "Room updated successfully", 
      room 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error updating room", 
      error: error.message 
    });
  }
});

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
