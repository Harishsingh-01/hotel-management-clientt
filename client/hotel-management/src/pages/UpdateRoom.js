import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Hotel, DollarSign, Type, List, FileText, Image, Check, Loader, AlertCircle, Save, ChevronLeft } from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance

const UpdateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const token = localStorage.getItem("token");
 
        const response = await API.get(`/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

 
        // Ensure amenities is always an array
        const roomData = response.data;
        if (!roomData.amenities) {
          roomData.amenities = []; // Default to empty array if undefined
        }

        setRoom(roomData);
        setLoading(false);  // ✅ Set loading to false
      } catch (err) {
        console.error("❌ Error fetching room:", err);
        setError("Failed to load room details");
        setLoading(false);  // ✅ Ensure loading state is updated even on error
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoom((prevRoom) => ({
      ...prevRoom,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Validate required fields
      if (!room.name || !room.type || !room.price) {
        throw new Error("Name, type, and price are required fields");
      }

      // Format the data for update
      const updatedData = {
        name: room.name,
        type: room.type,
        price: Number(room.price),
        amenities: typeof room.amenities === 'string' 
          ? room.amenities.split(',').map(item => item.trim()).filter(Boolean)
          : room.amenities,
        description: room.description || "",
        image: room.imageUrl || "", // Match the backend field name
        available: Boolean(room.available)
      };

      const response = await API.put(
        `/api/admin/update/${roomId}`,
        updatedData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert("Room updated successfully!");
        navigate("/admin");
      } else {
        throw new Error(response.data.message || "Failed to update room");
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to update room";
      setError(errorMessage);
      // Show error in UI
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Add this validation function
  const isFormValid = () => {
    return room.name && room.type && room.price;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="h-8 w-8 text-green-500 animate-spin mx-auto" />
        <p className="mt-2 text-gray-600">Loading room details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Hotel className="h-8 w-8 text-green-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Update Room Details</h1>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center text-red-700 border border-red-200">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Room Name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Room Name</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hotel className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={room.name || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Deluxe Suite"
                />
              </div>
            </div>

            {/* Room Type */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Room Type</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Type className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="type"
                  value={room.type || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Single/Double/Suite"
                />
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Price per Night</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  value={room.price || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="1000"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Amenities</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <List className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="amenities"
                  value={room.amenities || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="WiFi, TV, AC (comma separated)"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  name="description"
                  value={room.description || ""}
                  onChange={handleChange}
                  rows="4"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="Enter room description"
                />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="imageUrl"
                  value={room.imageUrl || ""}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="https://example.com/room-image.jpg"
                />
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Available</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={room.available}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving || !isFormValid()}
                className={`w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white 
                  ${saving || !isFormValid() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors`}
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Update Room
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoom;
