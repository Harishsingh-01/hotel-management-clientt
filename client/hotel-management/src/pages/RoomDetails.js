import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Calendar, DollarSign, Users, Home, Coffee, Wifi, Star, MapPin, 
  ChevronLeft, Loader, Tv, Wind, Utensils, Bath, 
  Music, Phone, Lock, ThumbsUp
} from "lucide-react";
import API from "../utils/axiosInstance";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviews, setReviews] = useState([]);

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
    'default': <Home className="h-5 w-5" />
  };

  const defaultImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

  const getAllImages = () => {
    if (!room) return [defaultImage];
    return [room.mainImage, ...(room.additionalImages || [])].filter(Boolean);
  };

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        const response = await API.get(
          `/api/rooms/${roomId}`
        );

        setRoom(response.data);
        if (response.data.reviews && Array.isArray(response.data.reviews)) {
          setReviews(response.data.reviews);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching room details:', err);
        setError("Failed to load room details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="h-8 w-8 text-green-500 animate-spin" />
    </div>
  );

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

  if (!room) return null;

  const RatingBreakdown = ({ reviews }) => {
    if (!reviews || !Array.isArray(reviews)) {
      return null;
    }

    const ratingCounts = Array(5).fill(0);

    reviews.forEach(review => {
      if (review && review.rating && review.rating >= 1 && review.rating <= 5) {
        ratingCounts[review.rating - 1]++;
      }
    });

    const totalReviews = reviews.length;

    return (
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Rating Breakdown</h3>
        {[5, 4, 3, 2, 1].map((stars) => {
          const count = ratingCounts[stars - 1];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          
          return (
            <div key={stars} className="flex items-center space-x-2">
              <span className="w-20 text-sm text-gray-600">{stars} stars</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-12 text-sm text-gray-600">{count}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const ReviewList = ({ reviews }) => {
    
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-2">Be the first to review this room!</p>
        </div>
      );
    }

    return (
      <div className="mt-8 space-y-6">
        <h3 className="text-lg font-semibold">Recent Reviews</h3>
        {reviews.map((review) => (
          <div key={review._id} className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {review.userId?.name?.charAt(0) || 'U'}
                </div>
                <span className="font-medium">
                  {review.userId?.name || 'Anonymous User'}
                </span>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
            <p className="mt-2 text-gray-600">{review.review}</p>
            <p className="mt-1 text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Rooms
        </button>

        <div className="flex flex-col lg:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center text-3xl font-bold text-green-600">
              <DollarSign className="h-6 w-6" />
              {room.price}
              <span className="text-gray-500 text-lg font-normal">/Month</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img 
                src={getAllImages()[selectedImage]} 
                alt={`${room.name} - View ${selectedImage + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = defaultImage;
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {getAllImages().map((img, index) => (
                <div 
                  key={index}
                  className={`relative h-44 rounded-lg overflow-hidden cursor-pointer 
                    ${selectedImage === index ? 'ring-2 ring-green-500' : 'hover:opacity-90'}
                    transition-all duration-200`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img 
                    src={img} 
                    alt={`${room.name} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold mb-4">About this room</h2>
              <p className="text-gray-600 leading-relaxed">{room.description}</p>
            </div>

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

            {room.amenities && room.amenities.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-700">
                  ✨ All amenities are included in the room price. Additional services may be available upon request.
                </p>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-8 w-8 text-yellow-400" fill="currentColor" />
                  <span className="ml-2 text-3xl font-bold">
                    {room.averageRating > 0 ? Number(room.averageRating).toFixed(1) : 'N/A'}
                  </span>
                </div>
                <div className="text-gray-500">
                  <span className="font-medium">{room.reviewCount || 0}</span> reviews
                </div>
              </div>

              {reviews && reviews.length > 0 ? (
                <>
                  <div className="mb-8">
                    <RatingBreakdown reviews={reviews} />
                  </div>
                  <div className="border-t pt-6">
                    <ReviewList reviews={reviews} />
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-sm text-gray-400 mt-2">Be the first to review this room!</p>
                </div>
              )}
            </div>

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
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-8">
              <h3 className="text-xl font-semibold mb-4">Book this room</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-gray-600">
                  <span>₹{room.price} x 1 Month</span>
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
