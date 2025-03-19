import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import roomImage from "./download.jpg";


const Home = () => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/rooms") // Adjust API route as per backend
            .then((res) => {
                setRooms(res.data)
            })
            .catch((err) => console.error("Error fetching rooms:", err));
    }, []);

    return (
        <div className="p-10 ">
            <h1 className="text-3xl font-bold mb-5">Welcome to Our Hotel</h1>
            <h2 className="text-2xl font-bold mb-5">All Rooms</h2>

            {rooms.length === 0 ? (
                <p>No rooms available at the moment.</p>
            ) : (
                <div className="grid  grid-cols-3 gap-5">
                    {rooms.map((room) => (
                        <div
                            key={room._id}
                            className="border  p-4 rounded-lg shadow-lg flex flex-col justify-between min-h-[350px]"
                        >
                            <div>
                                <img
                                    src={room.image || roomImage} // Default image if not available
                                    alt={room.name}
                                    className="w-full h-60 object-cover mb-3 rounded-md"
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

                            {/* View Details Button at Bottom */}
                            <Link
                                to={`/room/${room._id}`}
                                className="text-black rounded-md p-2 hover:bg-yellow-400 bg-green-500  mt-9 hover:underline block text-center "
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>

            )}
        </div>
    );
};

export default Home;
