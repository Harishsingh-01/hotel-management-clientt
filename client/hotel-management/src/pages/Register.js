import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [response, setResponse] = useState({ type: "", message: "" });
    
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/send-otp", { email });
            console.log(email);
            
            setOtpSent(true);
            setResponse({ type: "success", message: "✅ OTP sent to your email!" });
        } catch (error) {
            if (error.response && error.response.data.message === "Email already registered") {
                setResponse({ type: "error", message: "❌ Email already registered! Try logging in." });
            } else {
                setResponse({ type: "error", message: "❌ Failed to send OTP. Try again!" });
            }
        }
    };
    

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email,otp,name,password});
            setResponse({ type: "success", message: "✅ Registration successful! Redirecting..." });
            setTimeout(() => navigate("/login"), 3000);
        } catch (error) {
            setResponse({ type: "error", message: "❌ Invalid or expired OTP. Try again!" });
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-green-500">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Register</h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
                    {!otpSent ? (
                        <button type="button" onClick={handleSendOtp} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Send OTP</button>
                    ) : (
                        <>
                            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
                            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">Register</button>
                        </>
                    )}
                </form>
                {response.message && (
                    <div className={`mt-4 p-3 rounded-lg text-center ${response.type === "success" ? "bg-green-100 text-green-800 border border-green-400" : "bg-red-100 text-red-800 border border-red-400"}`}>{response.message}</div>
                )}
            </div>
        </div>
    );
};

export default Register;
