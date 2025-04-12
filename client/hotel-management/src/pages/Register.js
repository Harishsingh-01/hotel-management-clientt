import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Shield, CheckCircle, AlertCircle } from "lucide-react";
import API from "../utils/axiosInstance";


const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [response, setResponse] = useState({ type: "", message: "" });
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!email) {
            setResponse({ type: "error", message: "Please enter your email address (Check SPAM mail also)" });
            return;
        }
        setLoading(true);
        try {
            await API.post("/api/auth/send-otp", { email });
            setOtpSent(true);
            setResponse({ type: "success", message: "OTP sent to your email!" });
        } catch (error) {
            setResponse({ 
                type: "error", 
                message: error.response?.data?.message === "Email already registered" 
                    ? "Email already registered! Try logging in." 
                    : "Failed to send OTP. Try again!"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/api/auth/verify-otp", { email, otp, name, password });
            setResponse({ type: "success", message: "Registration successful! Redirecting..." });
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setResponse({ type: "error", message: "Invalid or expired OTP. Try again!" });
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        // Only allow letters and spaces
        if (value === '' || /^[A-Za-z\s]+$/.test(value)) {
            setName(value);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-green-100 rounded-full">
                            <UserPlus className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join us and start booking your perfect stay
                    </p>
                </div>

                {/* Response Message */}
                {response.message && (
                    <div className={`flex items-center p-4 rounded-lg ${
                        response.type === "success" 
                            ? "bg-green-50 border border-green-200" 
                            : "bg-red-50 border border-red-200"
                    }`}>
                        {response.type === "success" ? (
                            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        )}
                        <p className={`text-sm ${
                            response.type === "success" ? "text-green-700" : "text-red-700"
                        }`}>
                            {response.message}
                        </p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleRegister} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter your full name (letters only)"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                    {!otpSent ? (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                    loading 
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                } transition-colors duration-300`}
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                    ) : (
                        <>
                                {/* OTP Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Shield className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Enter OTP"
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                                            placeholder="Create a password"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                                        loading 
                                            ? "bg-gray-400 cursor-not-allowed" 
                                            : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    } transition-colors duration-300`}
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                                    ) : (
                                        "Register"
                                    )}
                                </button>
                        </>
                    )}
                    </div>
                </form>

                {/* Login Link */}
                <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/login" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
