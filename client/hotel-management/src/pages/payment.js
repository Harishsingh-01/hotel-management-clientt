import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import API from "../utils/axiosInstance"; // Import the axios instance


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Payment = ({ price }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      const stripe = await stripePromise;
      const { data } = await API.post(
        "/api/payments/create-checkout-session",
        { price }
      );

      if (!data.id) throw new Error("Invalid session ID");

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`bg-green-500 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Processing..." : `Pay ₹${price}`}
    </button>
  );
};

export default Payment;
