const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const OTP = require("../models/OTP");
const transporter = require("../middleware/sendOTP");
const otpGenerator = require("otp-generator");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

router.post("/verify-otp", async (req, res) => {
  const { email, otp, name, password } = req.body;

  try {
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) return res.status(400).json({ success: false, message: "Invalid OTP" });

    if (otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired, request a new one" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    await OTP.deleteOne({ email });

    res.json({ success: true, message: "Registration successful. You can now log in." });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error verifying OTP", error: error.message });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const otpCode = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false
    });

    await OTP.deleteOne({ email });

    const otpEntry = new OTP({
      email,
      otp: otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });
    
    await otpEntry.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otpCode}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);    
    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
});

router.post("/send-booking-email", async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ success: false, message: "User not found!" });
      }

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Room Booking Successful!",
          text: `Dear ${user.name},\n\nYour room has been successfully booked!\n\nThank you for choosing us!`
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Email sent successfully!" });

  } catch (error) {
      res.status(500).json({ success: false, message: "Error sending email", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
