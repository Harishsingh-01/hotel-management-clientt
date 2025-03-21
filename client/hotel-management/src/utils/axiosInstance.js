import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Read from .env file
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // If your backend requires credentials
});

export default API;
