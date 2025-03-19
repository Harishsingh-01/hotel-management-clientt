import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import roomImage from "./download.jpg";


const AvailableRooms = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/rooms")
      .then(res => {
        const availableRooms = res.data.filter(room => room.available);
        setRooms(availableRooms)
      })
      .catch(err => console.error(err));
  }, []);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">{rooms.length} Rooms Available</h2>
  
      {rooms.length === 0 ? (
        <p>No rooms are currently available.</p>
      ) : (
        <ul>
          {rooms.map(room => (
            <li key={room._id} className="border p-4 mb-4 rounded-md">
              <img
                src={roomImage}
                alt="Room"
                className="w-{150} h-32 object-cover mb-4"
              />
              <p><strong>Room ID:</strong> {room._id}</p>
              <p><strong>Name:</strong> {room.name}</p>
              <p><strong>Price:</strong> ₹{room.price}/night</p>
              <p className= {room.available ? "text-green-500 font-semibold" : "text-red-500 "}>
                {room.available ? "Available" : "Booked"}
              </p>
              <Link
                to={`/room/${room._id}`}
                className="text-white rounded-md px-4 py-2 mt-3 inline-block bg-blue-500 hover:bg-blue-600"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
  
};

export default AvailableRooms;
