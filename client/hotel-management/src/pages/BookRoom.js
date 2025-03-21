import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";
import { Calendar, DollarSign, Clock, Hotel, CreditCard, AlertCircle } from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);



const BookRoom = () => {
  const { roomId } = useParams();
  const [userId, setUserId] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(null);
  const [pricePerNight, setPricePerNight] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [roomDetails, setRoomDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId || decoded._id || decoded.id);
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await API.get(`/api/rooms/${roomId}`);
        setPricePerNight(res.data.price);
        setIsAvailable(res.data.available);
        setRoomDetails(res.data);
      } catch (error) {
        console.error("Error fetching room details:", error);
      }
    };
    fetchRoomDetails();
  }, [roomId]);

  useEffect(() => {
    if (checkIn && checkOut && pricePerNight !== null) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      if (startDate >= endDate) {
        setTotalPrice(0);
        return;
      }
      const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      setTotalPrice(nights * pricePerNight);
    }
  }, [checkIn, checkOut, pricePerNight]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You need to be logged in to book a room.");
      return;
    }
    if (!isAvailable) {
      alert("This room is already booked.");
      return;
    }
    if (!checkIn || !checkOut || totalPrice <= 0) {
      alert("Please select valid dates.");
      return;
    }
  
    setLoading(true);
    try {
      const paymentResponse = await API.post("/api/payments/create-checkout-session", {
        price: totalPrice,
        roomId,
        userId,
        checkIn,
        checkOut
      });
  
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ 
        sessionId: paymentResponse.data.sessionId 
      });
  
      if (error) throw new Error(error.message);
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Hotel className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-2">
            Book Your Stay
          </h2>
          <p className="text-lg text-gray-600">
            Complete your reservation details below
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Room Info Section */}
          {roomDetails && (
            <div className="bg-green-500 text-white px-6 py-4">
              <h3 className="text-xl font-bold">{roomDetails.name}</h3>
              <p className="flex items-center mt-2">
                <DollarSign className="h-5 w-5 mr-1" />
                ₹{pricePerNight} per night
              </p>
            </div>
          )}

          {/* Booking Form */}
          <div className="p-6 sm:p-8">
            {!isAvailable ? (
              <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
                <p className="text-red-600 font-medium">
                  This room is currently unavailable for booking.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Check-in Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-In Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {/* Check-out Date */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-Out Date
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        required
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        min={checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Price Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Price per night</span>
                      <span>₹{pricePerNight || 0}</span>
                    </div>
                    {totalPrice > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Number of nights</span>
                        <span>{Math.ceil(totalPrice / pricePerNight)}</span>
                      </div>
                    )}
                    <div className="pt-4 mt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{totalPrice !== null ? totalPrice : "Select dates"}
                        </span>
                      </div>
                    </div>
                  </div>
          </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || totalPrice <= 0}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-lg font-medium text-white 
                    ${loading || totalPrice <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    } transition-colors duration-300`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay ₹{totalPrice !== null ? totalPrice : ""}
                    </>
                  )}
          </button>
        </form>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookRoom;
