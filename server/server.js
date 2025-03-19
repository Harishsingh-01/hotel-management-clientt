const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});



const roomRoutes = require("./routes/roomRoutes");
app.use("/api/", roomRoutes);
  
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);


const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const paymentRoutes = require("./routes/paymentRoutes"); // ✅ Add payment route
app.use("/api/payments", paymentRoutes); // ✅ Define payment route


const AdminRoute = require("./routes/admin");
app.use("/api/admin", AdminRoute);








// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
