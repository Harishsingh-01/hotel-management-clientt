import React, { useState } from "react";
import axios from "axios";
import { Plus, Hotel, DollarSign, List, FileText, Image, Check } from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance


const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    name: "",
    type: "",
    price: "",
    amenities: "",
    description: "",
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
        amenities: roomData.amenities.split(",").map((a) => a.trim()),
        available: roomData.available === "true",
      };
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/api/admin/addrooms",
        formattedData,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.status === 201) {
        setMessage({ type: "success", text: res.data.message });
        setRoomData({
          name: "",
          type: "",
          price: "",
          amenities: "",
          description: "",
          available: "true",
          imageUrl: "",
        });
      } else {
        setMessage({ type: "error", text: "Failed to add room. Please try again." });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hotel className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Add a New Room
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details below to add a new room to your hotel
          </p>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg shadow-sm ${
            message.type === "success" 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <p className={`flex items-center justify-center text-sm font-medium ${
              message.type === "success" ? "text-green-800" : "text-red-800"
            }`}>
              {message.type === "success" ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <span className="mr-2">⚠️</span>
              )}
              {message.text}
            </p>
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Room Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hotel className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={roomData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Deluxe Suite"
                />
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Room Type
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <List className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="type"
                  id="type"
                  value={roomData.type}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Single, Double, Suite"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price per Night
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={roomData.price}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="1000"
                />
              </div>
            </div>

            <div>
              <label htmlFor="amenities" className="block text-sm font-medium text-gray-700">
                Amenities
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Plus className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="amenities"
                  id="amenities"
                  value={roomData.amenities}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="WiFi, TV, AC (comma separated)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  id="description"
                  value={roomData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter detailed room description"
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                Image URL
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="imageUrl"
                  id="imageUrl"
                  value={roomData.imageUrl}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="https://example.com/room-image.jpg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                Availability Status
              </label>
              <select
                name="available"
                id="available"
                value={roomData.available}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="true">Available</option>
                <option value="false">Booked</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
