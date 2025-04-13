import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import roomImage from "./download.jpg";
import backgroundImage from "./vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg";
import API from "../utils/axiosInstance";


import { Star, Wifi, Coffee, Utensils, Map, Phone, Clock, Search, ArrowRight, Users } from 'lucide-react';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    API.get(`/api/rooms`, { withCredentials: true })
      .then((res) => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setLoading(false);
      });
  }, []);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const RatingDisplay = ({ rating, reviewCount }) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <Star
            className={`h-5 w-5 ${rating > 0 ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
          />
          <span className="ml-1 text-sm font-medium text-gray-700">
            {rating > 0 ? rating.toFixed(1) : 'No ratings'}
          </span>
        </div>
        {reviewCount > 0 && (
          <div className="flex items-center text-gray-500">
            <Users className="h-4 w-4" />
            <span className="ml-1 text-sm">({reviewCount})</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Video Background */}
      <div className="relative h-[80vh] bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        <img
          src={backgroundImage}
          alt="Hotel Hero"
          className="w-full h-full object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="max-w-4xl space-y-6">
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 animate-fade-up">
              Experience Budget Friendly Living
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-up delay-200">
Get a Home Away From your Home              
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-300">
              <Link
                to="/availableRooms"
                className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all duration-300 hover:shadow-lg hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Book Now <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#featured-rooms"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center gap-2"
              >
                View Rooms <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Bar */}
      {/* <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-4">
          <div className="flex items-center gap-4 justify-center">
            <Phone className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Call Us 24/7</p>
              <p className="font-semibold">+1 234 567 8900</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Map className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-semibold">123 Luxury Avenue, City</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center">
            <Clock className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Check-in Time</p>
              <p className="font-semibold">2:00 PM - 12:00 AM</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Rooms Section */}
      <div id="featured-rooms" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Featured Rooms</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience luxury and comfort in our carefully curated selection of rooms
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700">No rooms found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, index) => (
            <div
              key={room._id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
            >
                <div className="relative group">
                <img
                  src={room.mainImage || "https://via.placeholder.com/400x300?text=No+Image"}
                  alt={room.name}
                  className="w-full h-64 object-cover rounded-t-lg"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      room.available 
                        ? "bg-green-500 text-white" 
                        : "bg-red-500 text-white"
                    }`}>
                  {room.available ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
                      {room.name}
                    </h3>
                    <RatingDisplay 
                      rating={room.averageRating} 
                      reviewCount={room.reviewCount} 
                    />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-600">{room.type}</span>
                    <span className="text-2xl font-bold text-green-600">₹{room.price}
                      <span className="text-sm text-gray-500">/Month</span>
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-6">
                    <div className="flex flex-wrap gap-3">
                      {room.amenities && room.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-green-50 hover:text-green-700 transition-all duration-300"
                        >
                          {amenity === 'Wifi' && <Wifi className="w-4 h-4" />}
                          {amenity === 'Coffee' && <Coffee className="w-4 h-4" />}
                          {amenity === 'Restaurant' && <Utensils className="w-4 h-4" />}
                          {amenity}
                        </span>
                      ))}
                </div>
              </div>

              <Link
                to={`/room/${room._id}`}
                    className="block w-full text-center bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                View Details
              </Link>
                </div>
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Experience the perfect blend of luxury, comfort, and exceptional service</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏨",
                title: "Luxury Accommodations",
                description: "Immerse yourself in elegantly designed rooms with premium amenities and stunning views"
              },
              {
                icon: "🍽️",
                title: "World-Class Dining",
                description: "Savor culinary excellence with our master chefs and premium dining experiences"
              },
              {
                icon: "💆",
                title: "Wellness & Spa",
                description: "Rejuvenate your body and mind with our premium spa treatments and wellness programs"
              },
              {
                icon: "🎯",
                title: "Prime Location",
                description: "Situated in the heart of the city with easy access to major attractions"
              },
              {
                icon: "👥",
                title: "24/7 Service",
                description: "Our dedicated staff is available round the clock to cater to your needs"
              },
              {
                icon: "🎉",
                title: "Special Events",
                description: "Perfect venues for your special occasions with professional event planning"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="text-center p-8 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg group"
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add custom styles */}
      <style jsx>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.6s ease-out forwards;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default Home;
