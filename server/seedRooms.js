const mongoose = require("mongoose");
const Room = require("./models/Room"); // Adjust path if needed
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const rooms = [
  {
    _id: "67e5296572277ec5d6ff91a3",
    name: "Royal pg hostel",
    type: "Both Pg and hostel",
    price: 3000,
    amenities: ["Wi-Fi", "AC"],
    description: "In front of GLA University, Nidhivan Colony, Mathura, Bharthia, Uttar Pradesh.",
    available: true,
    imageUrl: "https://i.postimg.cc/26jsLfH7/Royalpg3-1.jpg",
    additionalImages: [
      "https://i.postimg.cc/26jsLfH7/Royalpg3-1.jpg",
      "https://i.postimg.cc/26jsLfH7/Royalpg3-2.jpg"
    ],
    mainImage: "https://i.postimg.cc/26jsLfH7/Royalpg3-1.jpg"
  },
  {
    _id: "67e549f2469eb0b8deb3080f", 
    name: "JP Hostel",
    type: "Only PG",
    price: 2499,
    amenities: ["Wi-Fi", "AC"],
    description: "Chaumuhan, Ajhai Khurd, Uttar Pradesh 281406.",
    available: true,
    imageUrl: "https://i.postimg.cc/gcynqSd2/Whats-App-Image-2025-03-12-at-19-10-51-c…",
    additionalImages: [
      "https://i.postimg.cc/gcynqSd2/Whats-App-Image-2025-03-12-at-19-10-51-c…",
      "https://i.postimg.cc/gcynqSd2/Whats-App-Image-2025-03-12-at-19-10-52.jpg"
    ],
    mainImage: "https://i.postimg.cc/Kjpx8YxT/jp-Hostel-2.jpg"
  },
  {
    _id: "67e54a56469eb0b8deb30811",
    name: "Krishna Boys Hostel", 
    type: "Both PG and hostel",
    price: 4000,
    amenities: ["Wi-Fi", "AC", "Laundry"],
    description: "JHGF+VP7, Chaumuhan Rural, Uttar Pradesh 281406.",
    available: true,
    imageUrl: "https://drive.google.com/file/d/1r03bzHMVAY6nSxhT6b2tKA15serbgFkY/view…",
    additionalImages: [
      "https://i.postimg.cc/76LRYn6B/krishna-Boys-Hostel-1.jpg",
      "https://i.postimg.cc/76LRYn6B/krishna-Boys-Hostel-2.jpg"
    ],
    mainImage: "https://i.postimg.cc/76LRYn6B/krishna-Boys-Hostel-1.jpg"
  },
  {
    _id: "67e7b0447f5f80d84f960950",
    name: "Better Stay PG",
    type: "PG",
    price: 4599,
    amenities: ["Wi-Fi", "AC", "Free Meals"],
    description: "120 BSA road Jyoti Nagar Prabhat Nagar Mathura.",
    available: true,
    imageUrl: "https://lh3.googleusercontent.com/p/AF1QipPN3XsiXWgZ68O1o4ImKlXmhIhgwD…",
    additionalImages: [],
    mainImage: "https://lh3.googleusercontent.com/p/AF1QipPN3XsiXWgZ68O1o4ImKlXmhIhgwD…"
  },
  {
    _id: "67e7b0e77f5f80d84f960960",
    name: "Nana PG",
    type: "PG", 
    price: 1999,
    amenities: ["Wi-Fi"],
    description: "Near Gla College Mathura.",
    available: true,
    imageUrl: "https://thumbs.dreamstime.com/z/room-hostel-10747795.jpg",
    additionalImages: [],
    mainImage: "https://thumbs.dreamstime.com/z/room-hostel-10747795.jpg"
  },
  {
    _id: "67e7b1797f5f80d84f96096a",
    name: "Vidya Niwas",
    type: "Double seater",
    price: 2999,
    amenities: ["Wi-Fi", "AC", "Work Desk"],
    description: "House no. 566 might collage Mathura.",
    available: true,
    imageUrl: "https://thumbs.dreamstime.com/z/room-hostel-10747795.jpg",
    additionalImages: [],
    mainImage: "https://thumbs.dreamstime.com/z/room-hostel-10747795.jpg"
  },
  {
    _id: "67e7b5317f5f80d84f960991",
    name: "Dinesh Niwaas PG",
    type: "Double",
    price: 5999,
    amenities: ["Wi-Fi", "AC", "24/7 Water Supply"],
    description: "Dinesh Nagar Near Kosi Kalan Mathura.",
    available: false,
    imageUrl: "https://thumbs.dreamstime.com/z/room-hostel-10747795.jpg",
    additionalImages: [],
    mainImage: "https://thumbs.dreamstime.com/z/room-hostel-10747795.jpg"
  }
];

const seedDB = async () => {
  try {
    await Room.deleteMany({}); // Clear existing data first
    await Room.insertMany(rooms);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
