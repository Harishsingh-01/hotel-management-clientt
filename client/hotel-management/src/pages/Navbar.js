import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";
import { jwtDecode } from "jwt-decode";
import { 
  Menu, X, Hotel, User, Book, Plus, Users, LayoutDashboard, Mail 
} from "lucide-react";

const Navbar = () => {
  const [userRole, setUserRole] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
      } catch (error) {
        setUserRole(null);
      }
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white text-gray-800 shadow-lg" 
          : "bg-blue-300 text-white"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Hotel className={`w-8 h-8 ${scrolled ? "text-green-600" : "text-white"}`} />
              <span className="text-xl font-bold">Luxury Hotel</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {userRole !== "admin" && (
                <Link 
                  to="/" 
                  className="nav-link group relative"
                >
                  <span className="flex items-center space-x-1">
                    <span>Home</span>
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </Link>
              )}
              
              <Link to="/availableRooms" className="nav-link group relative">
                <span className="flex items-center space-x-1">
                  <Book className="w-4 h-4" />
                  <span>Available Rooms</span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
              </Link>

              {isAuthenticated("user") && (
                <>
                  <Link to="/bookings" className="nav-link group relative">
                    <span className="flex items-center space-x-1">
                      <Book className="w-4 h-4" />
                      <span>My Bookings</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                  
                  <Link to="/contact" className="nav-link group relative">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>Contact Us</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                </>
              )}

              {isAuthenticated("admin") && (
                <div className="flex items-center space-x-6">
                  <Link to="/admin/contacts" className="nav-link group relative">
                    <span className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>Contact Us</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                  <Link to="/addroom" className="nav-link group relative">
                    <span className="flex items-center space-x-1">
                      <Plus className="w-4 h-4" />
                      <span>Add Room</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                  <Link to="/admin/bookedrooms" className="nav-link group relative">
                    <span className="flex items-center space-x-1">
                      <Book className="w-4 h-4" />
                      <span>Booked Rooms</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                  <Link to="/admin/usersdata" className="nav-link group relative">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>Users</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                  <Link to="/admin" className="nav-link group relative">
                    <span className="flex items-center space-x-1">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </Link>
                </div>
              )}

              {/* Auth Buttons */}
              <div className="flex items-center space-x-4">
                {isAuthenticated() ? (
                  <button 
                    onClick={logout} 
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      scrolled
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                    }`}
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        scrolled
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                      }`}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        scrolled
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-white text-gray-800 hover:bg-gray-100"
                      } transition-all duration-300`}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden block"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-white shadow-lg`}>
          <div className="px-4 py-2 space-y-2">
            {userRole !== "admin" && (
              <Link 
                to="/" 
                className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
            )}
            
            <Link 
              to="/availableRooms" 
              className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Available Rooms
            </Link>

            {isAuthenticated("user") && (
              <>
                <Link 
                  to="/bookings" 
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  My Bookings
                </Link>
                
                <Link 
                  to="/contact" 
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Contact Us</span>
                  </span>
                </Link>
              </>
            )}

            {isAuthenticated("admin") && (
              <>
                <Link 
                  to="/addroom" 
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Add Room
                </Link>
                <Link 
                  to="/admin/bookedrooms" 
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Booked Rooms
                </Link>
                <Link 
                  to="/admin/usersdata" 
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  Users
                </Link>
                <Link 
                  to="/admin" 
                  className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="flex items-center space-x-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </span>
                </Link>
              </>
            )}

            <div className="pt-2 space-y-2 border-t border-gray-200">
            {isAuthenticated() ? (
                <button 
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
            ) : (
              <>
                  <Link 
                    to="/login" 
                    className="block w-full px-3 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-all duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block w-full px-3 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 transition-all duration-300"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
              </>
            )}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
