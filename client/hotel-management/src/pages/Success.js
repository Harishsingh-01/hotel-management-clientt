import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Loader, Calendar, Mail, AlertCircle, ArrowRight } from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance


const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingAttempted, setBookingAttempted] = useState(false);
  const [status, setStatus] = useState({
    booking: { status: 'processing', message: '' },
    email: { status: 'pending', message: '' }
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent multiple booking attempts
    if (bookingAttempted) return;

    const confirmBooking = async () => {
      setBookingAttempted(true); // Mark booking as attempted immediately
      
      const params = new URLSearchParams(location.search);
      const roomId = params.get("roomId");
      const userId = params.get("userId");
      const checkIn = params.get("checkIn");
      const checkOut = params.get("checkOut");
      const totalPrice = params.get("totalPrice");

      // Validate parameters
      if (!roomId || !userId || !checkIn || !checkOut || !totalPrice) {
        setError("Missing booking details");
        setTimeout(() => navigate("/bookings"), 3000);
        return;
      }

      try {
        // Update status for booking attempt
        setStatus(prev => ({
          ...prev,
          booking: { status: 'processing', message: 'Processing your booking...' }
        }));

        // Modified booking request - status should match your Mongoose enum values
        const bookingResponse = await API.post("/api/payments/confirm-booking", {
          roomId,
          userId,
          checkIn: new Date(checkIn).toISOString(),
          checkOut: new Date(checkOut).toISOString(),
          totalPrice: Number(totalPrice),
          status: 'booked'  // Changed this line from 'confirmed' to 'booked'
        });

        // Check booking response
        if (!bookingResponse.data || bookingResponse.data.error) {
          throw new Error(bookingResponse.data?.error || 'Booking failed');
        }

        // Update booking status to success
        setStatus(prev => ({
          ...prev,
          booking: { status: 'success', message: 'Room booked successfully!' }  // Updated message
        }));

        // Handle email confirmation
        try {
          setStatus(prev => ({
            ...prev,
            email: { status: 'processing', message: 'Sending confirmation email...' }
          }));

          const userResponse = await API.get(`/api/users/${userId}`);
          
          if (userResponse.data?.email) {
            await API.post("/api/auth/send-booking-email", {
              email: userResponse.data.email,
              bookingDetails: {
          checkIn,
          checkOut,
          totalPrice,
                roomId
              }
            });

            setStatus(prev => ({
              ...prev,
              email: { status: 'success', message: 'Confirmation email sent!' }
            }));
          }
        } catch (emailError) {
          console.warn("Email sending failed:", emailError);
          setStatus(prev => ({
            ...prev,
            email: { 
              status: 'warning', 
              message: 'Booking confirmed, but email notification failed'
            }
          }));
        }

        // Redirect to bookings page after successful booking
        setTimeout(() => navigate("/bookings"), 3000);

      } catch (error) {
        console.error("Booking error:", error);
        
        // Check if error is due to duplicate booking
        if (error.response?.data?.error?.includes('already booked')) {
          setError("This room is already booked for these dates");
        } else {
          setError(error.response?.data?.error || error.message || "Booking failed");
        }
        
        // Redirect after error
        setTimeout(() => navigate("/bookings"), 3000);
      }
    };

    confirmBooking();
  }, [location, navigate, bookingAttempted]); // Add bookingAttempted to dependencies

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          {error ? (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          ) : (
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              {status.booking.status === 'success' && status.email.status === 'success' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <Loader className="h-8 w-8 text-green-600 animate-spin" />
              )}
            </div>
          )}
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? 'Booking Failed' : 'Processing Your Booking'}
          </h2>
          <p className="text-gray-600">
            {error ? 'We encountered an error' : 'Please wait while we confirm your reservation'}
          </p>
        </div>

        {/* Status Steps */}
        {!error && (
          <div className="space-y-4">
            {/* Booking Status */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`flex-shrink-0 ${
                status.booking.status === 'processing' ? 'animate-spin' : ''
              }`}>
                <Calendar className={`h-6 w-6 ${
                  status.booking.status === 'success' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">Booking Confirmation</p>
                <p className="text-sm text-gray-500">{status.booking.message}</p>
              </div>
              {status.booking.status === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>

            {/* Email Status */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className={`flex-shrink-0 ${
                status.email.status === 'processing' ? 'animate-spin' : ''
              }`}>
                <Mail className={`h-6 w-6 ${
                  status.email.status === 'success' ? 'text-green-600' : 'text-gray-400'
                }`} />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-900">Email Confirmation</p>
                <p className="text-sm text-gray-500">{status.email.message}</p>
              </div>
              {status.email.status === 'success' && (
                <CheckCircle className="h-5 w-5 text-green-600" />
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success Navigation */}
        {status.booking.status === 'success' && status.email.status === 'success' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Redirecting you to your bookings...
            </p>
            <button
              onClick={() => navigate("/bookings")}
              className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
            >
              View My Bookings
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
