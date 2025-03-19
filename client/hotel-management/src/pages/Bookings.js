import React, { useEffect, useState } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token"); // Fetch token from local storage

  useEffect(() => {
    if (!token) return; // Prevent request if user is not logged in
  
    axios
      .get("http://localhost:5000/api/bookings/userbookings", {
        headers: { Authorization:`${token}` }, // Send token
      })
      .then((res) => {
        console.log("Bookings fetched:", res.data); // ✅ Frontend debug log
        setBookings(res.data);
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, [token]);
  console.log("Token from localStorage:", localStorage.getItem("token"));

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-5">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5">
          {bookings.map((booking) => (
            <div key={booking._id} className="border p-4 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold">
                {booking.roomId?.name || "Room Name Unavailable"}
              </h3>
              <p className="text-gray-600">
                ₹{booking.roomId?.price || "N/A"}/night
              </p>
              <p>Check-in: {new Date(booking.checkIn).toDateString()}</p>
              <p>Check-out: {new Date(booking.checkOut).toDateString()}</p>
              <p className="text-green-500">Status: {booking.status || "N/A"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
