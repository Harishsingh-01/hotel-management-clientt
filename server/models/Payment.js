const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["card", "upi", "net banking"], required: true },
  status: { type: String, enum: ["success", "failed"], default: "success" },
  transactionId: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Payment", PaymentSchema);
