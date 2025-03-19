import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";  // Import jwt-decode


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Stores backend response
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // Extract token from the response
      const token = res.data.token;

      localStorage.setItem("token",token);
       // Decode the token to extract the user's role
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role; // Assuming role is present in the decoded token

      if (userRole === "admin") {
    navigate("/admin");  // Navigate to admin dashboard
  } else {
    navigate("/");
  }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg py-14 w-96 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-14">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 mt-4 rounded-lg border border-red-300">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
