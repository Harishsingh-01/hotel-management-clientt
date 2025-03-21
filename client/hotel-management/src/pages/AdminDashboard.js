import React, { useState, useEffect } from "react";
import axios from "axios";
import roomImage from "./download.jpg";
import { useNavigate, Link } from "react-router-dom";
import { 
  Hotel, Trash2, Edit, Eye, Plus, Users, Book, 
  DollarSign, Percent, TrendingUp, BarChart4 
} from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance


const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    bookedRooms: 0,
    occupancyRate: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const roomsRes = await API.get("/api/rooms", {
          headers: { Authorization: `${token}` },
        });
        setRooms(roomsRes.data);
        
        // Calculate stats
        const totalRooms = roomsRes.data.length;
        const availableRooms = roomsRes.data.filter(room => room.available).length;
        const bookedRooms = totalRooms - availableRooms;
        const occupancyRate = (bookedRooms / totalRooms) * 100;

        setStats({
          totalRooms,
          availableRooms,
          bookedRooms,
          occupancyRate: occupancyRate.toFixed(1)
        });
      } catch (error) {
        console.error("Error fetching admin data:", error.response?.data || error);
      }
    };
    fetchAdminData();
  }, []);

  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/api/admin/delete/${roomId}`, {
        headers: { Authorization: `${token}` },
      });
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your hotel rooms and monitor statistics</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Rooms",
              value: stats.totalRooms,
              icon: <Hotel className="h-6 w-6" />,
              color: "bg-blue-500"
            },
            {
              title: "Available Rooms",
              value: stats.availableRooms,
              icon: <Book className="h-6 w-6" />,
              color: "bg-green-500"
            },
            {
              title: "Booked Rooms",
              value: stats.bookedRooms,
              icon: <Users className="h-6 w-6" />,
              color: "bg-yellow-500"
            },
            {
              title: "Occupancy Rate",
              value: `${stats.occupancyRate}%`,
              icon: <Percent className="h-6 w-6" />,
              color: "bg-purple-500"
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => navigate('/addroom')}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Room
          </button>
          <button
            onClick={() => navigate('/admin/bookedrooms')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Book className="h-5 w-5 mr-2" />
            View Bookings
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Room Management</h2>
            <div className="text-sm text-gray-600">
              Total: {rooms.length} rooms
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div key={room._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={room.image || roomImage}
                    alt={room.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      room.available 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {room.available ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{room.name}</h3>
                    <div className="flex items-center text-green-600">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold">{room.price}</span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{room.type}</p>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {room.amenities && room.amenities.length > 0 ? (
                        room.amenities.map((amenity, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No amenities listed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/update/${room._id}`)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room._id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                    <Link
                      to={`/room/${room._id}`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
