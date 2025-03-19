import React, { useState, useEffect } from "react";
import axios from "axios";
import roomImage from "./download.jpg";
import { useNavigate, Link } from "react-router-dom";




const AdminDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

  const navigate = useNavigate(); // ✅ Hook should be at the top inside a component

  
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch rooms
        const roomsRes = await axios.get("http://localhost:5000/api/rooms", {
          headers: { Authorization: `${token}` },
        });

        // // Fetch bookings
        // const bookingsRes = await axios.get("http://localhost:5000/api/admin/bookings", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });

        setRooms(roomsRes.data);
        // setBookings(bookingsRes.data);
      } catch (error) {
        console.error("Error fetching admin data:", error.response?.data || error);
      }
    };


    fetchAdminData();
  }, []);

  // Function to delete a room
  const handleDelete = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/delete/${roomId}`, {
        headers: { Authorization: `${token}` },
      });

      // Update state after deleting room
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));

      alert("Room deleted successfully!");
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room.");
    }
  };
  return (
    <div className="p-10 bg-white  rounded">
      <h2 className="text-3xl font-bold mb-16">Admin Dashboard</h2>

      {/* Rooms Section */}
      <h3 className="text-xl font-bold mt-4">All Rooms</h3>
      <div className="grid grid-cols-3 gap-5">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="border bg-yellow-500 p-4 rounded-lg shadow-lg flex flex-col justify-between min-h-[350px]"
          >
            <div>
              <img
                src={room.image || roomImage} // Default image if not available
                alt={room.name}
                className="w-full h-50 object-cover mb-3 rounded-md"
              />
              <h3 className="text-xl font-bold">{room.name}</h3>
              <p className="text-gray-600">Type: {room.type}</p>
              <p className="text-gray-600">₹{room.price}/night</p>
              <p className={room.available ? "text-green-500" : "text-red-500"}>
                {room.available ? "Available" : "Booked"}
              </p>

              {/* Amenities List */}
              <div className="mt-3">
                <h4 className="text-lg font-semibold">Amenities:</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  {room.amenities && room.amenities.length > 0 ? (
                    room.amenities.map((amenity, index) => (
                      <li key={index}>{amenity}</li>
                    ))
                  ) : (
                    <li>No amenities available</li>
                  )}
                </ul>
              </div>
            </div>


            {/* Update Button */}
            <button
              className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
              onClick={() => navigate(`/admin/update/${room._id}`)}
            >
              Update Room
            </button>
            <button
              className="bg-red-500 text-white mx-4 px-4 py-2 mt-2 rounded hover:bg-red-600"
              onClick={() => handleDelete(room._id)}
            >
              Delete Room
            </button>
            {/* View Details Button at Bottom */}
            <Link
              to={`/room/${room._id}`}
              className="text-black rounded-md p-2 hover:bg-green-600 bg-green-500  mt-2 hover:underline block text-center "
            >
              View Details
            </Link>
          </div>
        ))}
      </div>


    </div>
  );
};

export default AdminDashboard;
