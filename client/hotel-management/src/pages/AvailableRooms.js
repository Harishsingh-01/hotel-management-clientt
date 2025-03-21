import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import roomImage from "./download.jpg";
import { Hotel, DollarSign, Eye, Calendar, Check, Search } from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance


const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    API.get("/api/rooms")
      .then(res => {
        const availableRooms = res.data.filter(room => room.available);
        setRooms(availableRooms)
      })
      .catch(err => console.error(err));
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Hotel className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Available Rooms
          </h2>
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <Calendar className="h-5 w-5" />
            <p className="text-lg">
              Currently Available: <span className="font-semibold text-green-600">{rooms.length} Rooms</span>
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredRooms.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Hotel className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No Rooms Available</h3>
              <p className="mt-1 text-gray-500">Check back later for new rooms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredRooms.map(room => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Room Image */}
                  <div className="relative">
                    <img
                      src={roomImage}
                      alt={room.name}
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Check className="w-4 h-4 mr-1" />
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                        <p className="text-sm text-gray-500">ID: {room._id}</p>
                      </div>
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-5 w-5 mr-1" />
                        <span className="text-xl font-bold">₹{room.price}</span>
                        <span className="text-sm text-gray-500 ml-1">/night</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {room.amenities && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.map((amenity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Details Button */}
              <Link
                to={`/room/${room._id}`}
                      className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
              >
                      <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
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

export default AvailableRooms;
