import React, { useState } from "react";
import axios from "axios";

const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    name: "",
    type: "",
    price: "",
    amenities: "",
    description:"",
    available: "true",
    imageUrl: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const formattedData = {
        ...roomData,
        price: Number(roomData.price),
        amenities: roomData.amenities.split(",").map((a) => a.trim()), // Convert string to array
        available: roomData.available === "true", // Convert string to boolean
      };
      const token = localStorage.getItem("token"); // Get token from local storage


      const res = await axios.post(
        "http://localhost:5000/api/admin/addrooms",
        formattedData,
        {
          headers: {
            Authorization: `${token}`, // Attach token in headers
          },
        }
      );
      if (res.status === 201) {
        setMessage({ type: "success", text: res.data.message });
        setRoomData({ name: "", type: "", price: "", amenities: "", available: "true", imageUrl: "" });
      } else {
        setMessage({ type: "error", text: "Failed to add room. Please try again." });
      }
    } catch (error) {
      console.error("Error adding room:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add a New Room</h2>
      
      {message.text && (
        <p className={`mb-4 p-2 rounded ${message.type === "success" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}>
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Room Name" value={roomData.name} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <input type="text" name="type" placeholder="Room Type (Single, Double, Suite)" value={roomData.type} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <input type="number" name="price" placeholder="Price per night (₹)" value={roomData.price} onChange={handleChange} required className="w-full p-2 border rounded"/>
        <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={roomData.amenities} onChange={handleChange} required className="w-full p-2 border rounded"/>
          <textarea
            name="description"
            value={roomData.description}
            placeholder="Enter Description"
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        <input type="text" name="imageUrl" placeholder="Image URL" value={roomData.imageUrl} onChange={handleChange} className="w-full p-2 border rounded"/>
        <select name="available" value={roomData.available} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="true">Available</option>
          <option value="false">Booked</option>
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Add Room</button>
      </form>
    </div>
  );
};

export default AddRoom;
