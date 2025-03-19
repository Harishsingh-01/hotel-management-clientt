import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51QCNfO05mxxRnIKxAjCj8WkVp4FlMPRWaPuXmwuqEt0fvK2YtuwabydNlPKZLfpQyhajRS6wBSIZeVOeHSKP392000wa8lgdFZ");

const BookRoom = () => {
  const { roomId } = useParams();
  const [userId, setUserId] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(null);
  const [pricePerNight, setPricePerNight] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);

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
        const res = await axios.get(`http://localhost:5000/api/rooms/${roomId}`);
        setPricePerNight(res.data.price);
        setIsAvailable(res.data.available);
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
      // ✅ Step 1: Initiate Payment
      const paymentResponse = await axios.post("http://localhost:5000/api/payments/create-checkout-session", {
        price: totalPrice,
        roomId,
        userId,
        checkIn,
        checkOut
      });
  
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: paymentResponse.data.sessionId });
  
      if (error) throw new Error(error.message);
    } catch (error) {
      alert(error.response?.data?.message || "Payment failed! Try again.");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="p-10 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-5">Book Room</h2>
      {!isAvailable ? (
        <p className="text-red-500">This room is already booked.</p>
      ) : (
        <form onSubmit={handleBooking} className="space-y-4">
          <div>
            <label className="block text-gray-700">Check-In Date:</label>
            <input type="date" className="border p-2 rounded w-full" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </div>
          <div>
            <label className="block text-gray-700">Check-Out Date:</label>
            <input type="date" className="border p-2 rounded w-full" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </div>
          <p className="text-lg font-semibold">Total Price: ₹{totalPrice !== null ? totalPrice : "Select dates"}</p>
          <button type="submit"   disabled={loading}  className={`bg-blue-500 text-white px-4 py-2 rounded ${loading || totalPrice <= 0 ? "opacity-50 cursor-not-allowed" : ""}`} disabled={loading || totalPrice <= 0}>
            {loading ? "Processing..." : `Pay ₹${totalPrice !== null ? totalPrice : ""}`}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookRoom;
