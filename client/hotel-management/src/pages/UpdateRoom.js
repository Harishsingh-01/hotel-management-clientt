import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching room details...");

        const response = await axios.get(`http://localhost:5000/api/rooms/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Room Data Fetched:", response.data); // Debugging

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
  console.log("data is")

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const updatedData = {
        ...room,
        amenities: Array.isArray(room.amenities)
          ? room.amenities
          : room.amenities?.split(",").map((item) => item.trim()) || [],
      };

      const response = await axios.put(
        `http://localhost:5000/api/admin/update/${roomId}`,
        updatedData,
        { headers: { Authorization: `${token}` } }
      );

      alert("Room updated successfully!");
      navigate("/admin");
    } catch (err) {
      console.error("Error updating room:", err);
      setError("Failed to update room. Please try again.");
    }
  };

  if (loading) return <p>Loading room details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Update Room</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Room Name</label>
          <input
            type="text"
            name="name"
            value={room.name || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Room Type</label>
          <input
            type="text"
            name="type"
            value={room.type || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Price</label>
          <input
            type="number"
            name="price"
            value={room.price || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Amenities (comma-separated)</label>
          <input
            type="text"
            name="amenities"
            value={room.amenities || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Description</label>
          <textarea
            name="description"
            value={room.description || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Available</label>
          <input
            type="checkbox"
            name="available"
            checked={room.available}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-semibold">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={room.imageUrl || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Room
        </button>
      </form>
    </div>
  );
};

export default UpdateRoom;
