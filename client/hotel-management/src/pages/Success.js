import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isConfirmed) return; // Prevents duplicate requests
    setIsConfirmed(true);

    const confirmBooking = async () => {
      const params = new URLSearchParams(location.search);
      const roomId = params.get("roomId");
      const userId = params.get("userId");
      const checkIn = params.get("checkIn");
      const checkOut = params.get("checkOut");
      const totalPrice = params.get("totalPrice");

      if (!roomId || !userId || !checkIn || !checkOut || !totalPrice) {
        console.error("Missing booking details.");
        alert("Invalid booking details.");
        return;
      }

      try {
        console.log("📤 Sending booking request with data:", { roomId, userId, checkIn, checkOut, totalPrice });

        // ✅ Step 1: Confirm Booking
        const bookingResponse = await axios.post("http://localhost:5000/api/payments/confirm-booking", {
          roomId,
          userId,
          checkIn,
          checkOut,
          totalPrice,
        });

        console.log("✅ Booking response:", bookingResponse.data);
        alert("Booking successful!");

        // ✅ Step 2: Send Confirmation Email
        const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
        if (!userResponse.data || !userResponse.data.email) {
          console.error("❌ Failed to fetch user email.");
          alert("Failed to retrieve user email.");
          return;
        }
        const userEmail = userResponse.data.email;


        console.log("📧 Sending confirmation email to:");
        await axios.post("http://localhost:5000/api/auth/send-booking-email", { email:userEmail });

        console.log("✅ Email sent successfully!");
        alert("Confirmation email sent!");

        navigate("/bookings"); // Redirect to bookings page

      } catch (error) {
        console.error("❌ Booking confirmation failed:", error);

        if (error.response) {
          console.error("🔴 Response Data:", error.response.data);
          console.error("🟡 Response Status:", error.response.status);
          console.error("🔵 Response Headers:", error.response.headers);
          alert(`Booking failed: ${error.response.data.error || "Unknown error"}`);
        } else if (error.request) {
          console.error("🟠 No response received from server:", error.request);
          alert("Booking failed: No response from server");
        } else {
          console.error("🟣 Error setting up request:", error.message);
          alert(`Booking failed: ${error.message}`);
        }
      }
    };

    confirmBooking();
  }, [location, navigate]);

  return <h2>Processing your booking...</h2>;
};

export default SuccessPage;
