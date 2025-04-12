const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

const allowedOrigins = [
  "https://hotel-management-clientt-git-main-harishsingh-01s-projects.vercel.app",
  "https://hotel-management-clientt-neon.vercel.app",
  "https://hotel-management-clientt-harishsingh-01s-projects.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

app.use(express.json());
app.use((req, res, next) => {
   next();
});

const roomRoutes = require("./routes/roomRoutes");
app.use("/api/rooms", roomRoutes);
  
const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const paymentRoutes = require("./routes/paymentRoutes"); 
app.use("/api/payments", paymentRoutes); 

const AdminRoute = require("./routes/admin");
app.use("/api/admin", AdminRoute);

const reviewRoutes = require("./routes/reviews");
app.use("/api/reviews", reviewRoutes);

const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
