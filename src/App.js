import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route,Navigate,useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Bookings from "./pages/Bookings";
import AvailableRooms from "./pages/AvailableRooms";
// import Payment from "./pages/payment";
import BookRoom from "./pages/BookRoom";
import AddRoom from "./pages/AddRoom";
import RoomDetails from "./pages/RoomDetails";
import Success from "./pages/Success";
import Navbar from "./pages/Navbar";
import { isAuthenticated } from "./utils/auth";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateRoom from "./pages/UpdateRoom";
import AdminBookedRooms from "./pages/AdminBookedRooms"
import UsersData from "./pages/UsersData";
import { isTokenExpired } from "./utils/auth";
import Review from './pages/Review';
import ContactUs from './pages/ContactUs';
import AdminContacts from './pages/AdminContacts';  

const App = () => {
  return (
    <Router>
      <Navbar />
      <AuthChecker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/availableRooms" element={<AvailableRooms />} />
        <Route path="/room/:roomId" element={<RoomDetails />} />
        <Route path="/Bookroom/:roomId" element={<ProtectedRoute><BookRoom /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />
        {/* <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} /> */}
        <Route path="/addroom" element={<AdminRoute><AddRoom /></AdminRoute>} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/update/:roomId" element={<UpdateRoom />} />
        <Route path="/admin/bookedrooms" element={<AdminBookedRooms />} />
        <Route path="/admin/Usersdata" element={<UsersData />} />
        <Route path="/review/:bookingId" element={<Review />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/admin/contacts" element={<AdminContacts />} />
      </Routes>
    </Router>
  );
};

const AuthChecker = () => {
  const location = useLocation();
  const token=localStorage.getItem("token");

  useEffect(() => {
    if (token && isTokenExpired()) {
      alert("token expired");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, [location.pathname]);

  return null;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  return isAuthenticated("admin") ? children : <Navigate to="/login" />;
};

export default App;
