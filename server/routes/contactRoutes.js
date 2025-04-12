const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const adminAuth = require('../middleware/adminMiddleware');

router.post('/submit', auth, async (req, res) => {
  try {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required',
        received: { name, email, subject, message }
      });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      userId: req.user.id
    });

    await contact.save();

    res.status(201).json({
      message: 'Thank you for your message. We will get back to you soon!',
      contact
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      message: 'Error submitting contact form',
      error: error.message 
    });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/contacts', auth, adminAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().populate('userId', 'name email');
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;