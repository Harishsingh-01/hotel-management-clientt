const mongoose = require("mongoose");
const Booking = require("./Booking");

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Room Name (e.g., Deluxe Room)
  type: { type: String, required: true }, // Single, Double, Suite, etc.
  price: { type: Number, required: true }, // Price per night
  amenities: { type: [String], required: true }, // List of amenities
  description: String,
  available: { type: Boolean, default: true }, // Is the room available?
  imageUrl: { type: String }, // Image of the room
});

// Mongoose Hook: When a room's availability is updated, remove its booking
RoomSchema.post("findOneAndUpdate", async function (doc) {
  if (doc && doc.available === true) {
    try {
      await Booking.deleteOne({ roomId: doc._id });
     } catch (error) {
     }
  }
});

module.exports = mongoose.model("Room", RoomSchema);
