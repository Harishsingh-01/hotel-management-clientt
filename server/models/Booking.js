const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who booked it?
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, // Which room?
  checkIn: { type: Date, required: true }, // Check-in date
  checkOut: { type: Date, required: true }, // Check-out date
  totalPrice: { type: Number, required: true }, // Total amount paid
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" }, // Status
});

module.exports = mongoose.model("Booking", BookingSchema);
