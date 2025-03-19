import React, { useEffect, useState } from "react";
import axios from "axios";
import roomImage from "./download.jpg";


const AdminBookedRooms = () => {
  const [bookedRooms, setBookedRooms] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookedRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/booked-rooms", {
          headers: { Authorization: `${token}` },
        });
        setBookedRooms(response.data);
      } catch (err) {
        console.error("Error fetching booked rooms:", err);
        setError("Failed to load booked rooms");
      }
    };

    fetchBookedRooms();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">{bookedRooms.length} Rooms Booked</h2>

      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {bookedRooms.length === 0 ? (
          <p>No rooms are currently booked.</p>
        ) : (
          bookedRooms.map((room) => (
            <li key={room._id} className="border p-4 mb-2">
              <img src={roomImage} alt="Room" width={150} />
              <p><strong>Room ID:</strong> {room._id}</p>
              <p><strong>Name:</strong> {room.name}</p>
              <p><strong>Price:</strong> ₹{room.price}</p>
              <p><strong>Description:</strong> {room.description}</p>
              <p className="text-red-600"><strong>Booked</strong></p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AdminBookedRooms;
