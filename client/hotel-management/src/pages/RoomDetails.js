import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import roomImage from "./download.jpg";


const RoomDetails = () => {
  const { roomId } = useParams(); // Get room ID from URL
  const navigate = useNavigate(); // For navigation
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
        setRoom(response.data);
      } catch (err) {
        setError("Failed to load room details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) return <p className="text-center text-xl">Loading room details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <img src={roomImage} alt={room.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
      <h1 className="text-3xl font-bold mt-5">{room.name}</h1>
      <p className="text-gray-600 mt-2">{room.description}</p>
      <p className="text-xl font-semibold text-green-600 mt-2">₹{room.price} per night</p>

      <button
        onClick={() => navigate(`/bookroom/${roomId}`)}
        className="mt-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Book Now
      </button>
    </div>
  );
};

export default RoomDetails;
