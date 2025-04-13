import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import API from "../utils/axiosInstance"; 

const Review = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    review: '',
    roomId: ''
  });

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get(
        `/api/reviews/booking/${bookingId}`,
        {
          headers: { Authorization: `${token}` }
        }
      );
      setExistingReview(response.data);
      if (response.data) {
        setFormData({
          rating: response.data.rating,
          review: response.data.review,
          roomId: response.data.roomId._id
        });
      }
    } catch (error) {
      console.error('Error fetching review:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const bookingResponse = await API.get(
          `/api/bookings/${bookingId}`,
          {
            headers: { Authorization: `${token}` }
          }
        );
        setBooking(bookingResponse.data);
        setFormData(prev => ({ ...prev, roomId: bookingResponse.data.roomId._id }));
        await fetchReview();
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching details');
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const reviewData = {
        bookingId: bookingId,
        roomId: booking.roomId._id,
        rating: formData.rating,
        review: formData.review
      };


      if (isEditing && existingReview) {
        await API.put(
          `/api/reviews/edit/${existingReview._id}`,
          reviewData,
          {
            headers: { 
              Authorization: `${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        const response = await API.post(
          '/api/reviews/add',
          reviewData,
          {
            headers: { 
              Authorization: `${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      await fetchReview();
      setIsEditing(false);
    } catch (error) {
      console.error('Review submission error:', error.response?.data || error);
      setError(error.response?.data?.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await API.delete(
        `/api/reviews/delete/${existingReview._id}`,
        {
          headers: { Authorization: `${token}` }
        }
      );
      setExistingReview(null);
      setFormData({
        rating: 5,
        review: '',
        roomId: booking.roomId._id
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting review');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Room Review</h2>
          
          {booking && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-900">
                {booking.roomId.name}
              </h3>
              <p className="text-sm text-gray-500">
                Stayed from {new Date(booking.checkIn).toLocaleDateString()} to{' '}
                {new Date(booking.checkOut).toLocaleDateString()}
              </p>
            </div>
          )}

          {existingReview && !isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5"
                      fill={existingReview.rating >= star ? '#FBBF24' : 'none'}
                      stroke={existingReview.rating >= star ? '#FBBF24' : '#D1D5DB'}
                    />
                  ))}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700">{existingReview.review}</p>
              <p className="text-sm text-gray-500">
                Posted on {new Date(existingReview.createdAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                      className={`p-1 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star 
                        className="h-8 w-8" 
                        fill={formData.rating >= star ? 'currentColor' : 'none'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={formData.review}
                  onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                  required
                  rows={4}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  placeholder="Write your review here..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : isEditing ? 'Update Review' : 'Submit Review'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review; 