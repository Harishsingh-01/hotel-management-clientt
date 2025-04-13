import React, { useEffect, useState } from "react";
import axios from "axios";
import roomImage from "./download.jpg";
import API from "../utils/axiosInstance";
import { Hotel, DollarSign, Info, Calendar, User } from "lucide-react"; // Import icons


const AdminBookedRooms = () => {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookedRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/api/admin/booked-rooms", {
          headers: { Authorization: `${token}` },
        });
        setBookedRooms(response.data);
      } catch (err) {
        setError("Failed to load booked rooms");
      }
    };

    fetchBookedRooms();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hotel className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
            Booked Rooms Dashboard
          </h2>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <p className="text-lg">
              Currently Booked: <span className="font-semibold text-green-600">{bookedRooms.length} Rooms</span>
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rooms Grid */}
        <div className="max-w-7xl mx-auto">
          {bookedRooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Hotel className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Bookings</h3>
              <p className="mt-1 text-gray-500">No rooms are currently booked.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bookedRooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Room Image */}
                  <div className="relative">
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 right-0 mt-4 mr-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Booked
                      </span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      <div className="flex items-center text-green-600">
                      <span className="h-5 w-5 mr-1">₹</span>
                        <span className="font-bold">₹{room.price}</span>
                      </div>
                    </div>

                    {/* Room ID */}
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <User className="h-4 w-4 mr-2" />
                      <span>ID: {room._id}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {room.description}
                    </p>

                    {/* Additional Details */}
                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2">
                        {room.amenities && room.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookedRooms;
