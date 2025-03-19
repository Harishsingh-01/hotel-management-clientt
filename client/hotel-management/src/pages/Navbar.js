import React from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import {jwtDecode} from "jwt-decode";  // For decoding JWT token

import { useState,useEffect } from "react";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);  // Initializing userRole state

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);  // Decode the JWT token
        setUserRole(decodedToken.role);  // Set the role from decoded token
      } catch (error) {
        setUserRole(null);  // If token is invalid or expired, set role to null
      }
    }
  }, []);
  return (
    <nav className="bg-yellow-400 text-white hover:bg-yellow-500 p-2 flex justify-between fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="flex gap-4 ">
      {userRole !== "admin" && (
          <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Home
          </Link>
        )}        <Link to="/availableRooms" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Available Rooms</Link>
        {isAuthenticated("user") && <Link to="/bookings" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">My Bookings</Link>}
        {isAuthenticated("admin") && (
          <>
            <Link to="/addroom" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Add Room
            </Link>
            <Link to="/admin/bookedrooms" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Booked Rooms
            </Link>
            <Link to="/admin/usersdata" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Registered Users
            </Link>
            <Link to="/admin" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Dashboard
            </Link>
          </>
        )}
      </div>
      <div>
        {isAuthenticated() ? (
          <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="bg-red-500 hover:bg-red-600  px-4  mr-2 py-1 rounded">Login</Link>
            <Link to="/register" className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
