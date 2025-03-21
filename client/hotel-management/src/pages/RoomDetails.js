import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import roomImage from "./download.jpg";
import { 
  Calendar, DollarSign, Users, Home, Coffee, Wifi, Star, MapPin, 
  ChevronLeft, Loader, Tv, Wind, Utensils, Bath, 
  Music, Phone, Lock
} from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance


const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  // Amenity icon mapping
  const amenityIcons = {
    'Wifi': <Wifi className="h-5 w-5" />,
    'TV': <Tv className="h-5 w-5" />,
    'AC': <Wind className="h-5 w-5" />,
    'Restaurant': <Utensils className="h-5 w-5" />,
    'Coffee': <Coffee className="h-5 w-5" />,
    'Bathroom': <Bath className="h-5 w-5" />,
    'Music System': <Music className="h-5 w-5" />,
    'Room Service': <Phone className="h-5 w-5" />,
    'Security': <Lock className="h-5 w-5" />,
    'default': <Home className="h-5 w-5" /> // Default icon for unknown amenities
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(
          `/api/rooms/${roomId}`, 
          { withCredentials: true }
        );
        setRoom(response.data);
      } catch (err) {
        setError("Failed to load room details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  // Loading state
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="h-8 w-8 text-green-500 animate-spin" />
    </div>
  );

  // Error state
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Go Back
        </button>
      </div>
    </div>
  );

  // No room data
  if (!room) return null;

  // Mock data for demonstration
  const mockImages = [roomImage, roomImage, roomImage];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Rooms
        </button>

        {/* Room Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
            {/* <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Premium Location</span>
              <div className="mx-2">•</div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>4.9 (128 reviews)</span>
              </div>
            </div> */}
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center text-3xl font-bold text-green-600">
              <DollarSign className="h-6 w-6" />
              {room.price}
              <span className="text-gray-500 text-lg font-normal">/night</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img 
                src={mockImages[selectedImage]} 
                alt={`Room view ${selectedImage + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {mockImages.map((img, index) => (
                <div 
                  key={index}
                  className="relative h-44 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`Room view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About this room</h2>
              <p className="text-gray-600 leading-relaxed">{room.description}</p>
            </div>

            {/* Updated Amenities Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              {room.amenities && room.amenities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {room.amenities.map((amenity, index) => (
                    <div 
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="text-green-600">
                        {amenityIcons[amenity] || amenityIcons['default']}
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No amenities listed for this room
                </p>
              )}
            </div>

            {/* Additional Amenities Info */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  ✨ All amenities are included in the room price. Additional services may be available upon request.
                </p>
              </div>
            )}

            {/* House Rules */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">House Rules</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Check-in: After 2:00 PM
                </li>
                <li className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Check-out: Before 12:00 PM
                </li>
                {/* Add more rules as needed */}
              </ul>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Book this room</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-600">
                  <span>₹{room.price} x 1 night</span>
                  <span>₹{room.price}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Service fee</span>
                  <span>₹{Math.floor(room.price * 0.1)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{room.price + Math.floor(room.price * 0.1)}</span>
                  </div>
                </div>
      <button
        onClick={() => navigate(`/bookroom/${roomId}`)}
                  className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
      >
                  <Calendar className="h-5 w-5 mr-2" />
        Book Now
      </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
