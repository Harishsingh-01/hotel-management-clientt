const mongoose = require("mongoose");
const Room = require("./models/Room"); // Adjust path if needed
const dotenv = require("dotenv");
dotenv.config();


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const rooms = [
  {
    name: "Deluxe Suite",
    type: "Suite",
    price: 5000,
    amenities: ["Wi-Fi", "TV", "Air Conditioner", "Mini Bar", "Room Service"],
    available: true,
    imageUrl: "https://example.com/deluxe-suite.jpg"
  },
  {
    name: "Standard Room",
    type: "Single",
    price: 2500,
    amenities: ["Wi-Fi", "TV", "Air Conditioner"],
    available: false,
    imageUrl: "https://example.com/standard-room.jpg"
  },
  {
    name: "Executive Room",
    type: "Double",
    price: 4000,
    amenities: ["Wi-Fi", "TV", "Air Conditioner", "Work Desk", "Free Breakfast"],
    available: true,
    imageUrl: "https://example.com/executive-room.jpg"
  },
  {
    name: "Presidential Suite",
    type: "Suite",
    price: 10000,
    amenities: ["Wi-Fi", "TV", "Air Conditioner", "Private Pool", "Butler Service"],
    available: true,
    imageUrl: "https://example.com/presidential-suite.jpg"
  },
  {
    name: "Family Room",
    type: "Family",
    price: 6000,
    amenities: ["Wi-Fi", "TV", "Air Conditioner", "Kitchen", "Extra Beds"],
    available: false,
    imageUrl: "https://example.com/family-room.jpg"
  }
];

const seedDB = async () => {
  await Room.insertMany(rooms);
  console.log("Rooms added successfully!");
  mongoose.connection.close();
};

seedDB();
