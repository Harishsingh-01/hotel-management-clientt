import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../utils/axiosInstance";
import { Calendar, Clock, DollarSign, Hotel, CheckCircle, XCircle } from "lucide-react";


const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    API
      .get("/api/bookings/userbookings", {
        headers: { Authorization: `${token}` },
      })
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching bookings:", err);
        setLoading(false);
      });
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Hotel className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Your Bookings
          </h2>
          <p className="text-lg text-gray-600">
            Manage and view your hotel reservations
          </p>
        </div>

        {/* Bookings Section */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm max-w-2xl mx-auto">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Bookings Found</h3>
            <p className="mt-2 text-gray-500">You haven't made any reservations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Booking Header */}
                <div className="bg-green-500 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">
                    {booking.roomId?.name || "Room Name Unavailable"}
                  </h3>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-4">
                  {/* Price */}
                  <div className="flex items-center text-gray-900">
                    <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-xl font-bold">
                      ₹{booking.roomId?.price || "N/A"}
                    </span>
                    <span className="text-gray-500 ml-1">/night</span>
                  </div>

                  {/* Check-in */}
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Check-in</p>
                      <p className="text-gray-900">
                        {new Date(booking.checkIn).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Check-out */}
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Check-out</p>
                      <p className="text-gray-900">
                        {new Date(booking.checkOut).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="pt-4 border-t">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status === 'confirmed' ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-1" />
                      )}
                      {booking.status || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
