import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hotel, DollarSign, Type, List, FileText, Image, Loader, AlertCircle } from "lucide-react";
import API from "../utils/axiosInstance";

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [room, setRoom] = useState({
    name: "",
    type: "",
    price: "",
    amenities: "",
    description: "",
    mainImage: "", // Main image URL
    additionalImages: ["", "", ""], // Array for 3 additional images
    available: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoom(prevRoom => ({
      ...prevRoom,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle additional image changes
  const handleImageChange = (index, value) => {
    setRoom(prevRoom => {
      const newAdditionalImages = [...prevRoom.additionalImages];
      newAdditionalImages[index] = value;
      return {
        ...prevRoom,
        additionalImages: newAdditionalImages
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Validate required fields
      if (!room.name || !room.type || !room.price || !room.mainImage) {
        throw new Error("Name, type, price, and main image are required");
      }

      // Format the data
      const roomData = {
        name: room.name,
        type: room.type,
        price: Number(room.price),
        amenities: room.amenities.split(',').map(item => item.trim()).filter(Boolean),
        description: room.description,
        mainImage: room.mainImage,
        additionalImages: room.additionalImages.filter(Boolean), // Remove empty strings
        available: room.available
      };

      const response = await API.post("/api/admin/addrooms", roomData, {
        headers: { Authorization: `${token}` }
      });

      if (response.data) {
        alert("Room added successfully!");
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center">
            <Hotel className="h-8 w-8 text-green-500 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Add New Room</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  value={room.name}
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
                  value={room.type}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Single, Double, Suite"
                />
              </div>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price per Month
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={room.price}
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
                  <Type className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="amenities"
                  id="amenities"
                  value={room.amenities}
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
                  value={room.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Enter detailed room description"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Main Image URL (Required)
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="mainImage"
                  value={room.mainImage}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Main image URL (required)"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images (Optional)
              </label>
              <div className="space-y-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={room.additionalImages[index]}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder={`Additional image URL ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="available" className="block text-sm font-medium text-gray-700">
                Availability Status
              </label>
              <select
                name="available"
                id="available"
                value={room.available}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="true">Available</option>
                <option value="false">Booked</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white 
                  ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} 
                  transition-colors`}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Adding Room...
                  </>
                ) : (
                  'Add Room'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
