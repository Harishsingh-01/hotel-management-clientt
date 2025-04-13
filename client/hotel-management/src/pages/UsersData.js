import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, User, Mail, Shield, Trash2, AlertCircle, Loader } from "lucide-react";
import API from "../utils/axiosInstance"; // Import the axios instance


const UsersData = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await API.get("/api/admin/usersdata", {
          headers: { Authorization: `${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    setDeleteLoading(userId);
    try {
      await API.delete(`/api/admin/user-delete/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 text-green-500 animate-spin mx-auto" />
          <p className="mt-2 text-gray-600">Loading users data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-100 rounded-full">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">User Management</h2>
          <p className="mt-2 text-gray-600">
            Total Registered Users: <span className="font-semibold">{users.length}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg flex items-center justify-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Users Grid */}
        {Array.isArray(users) && users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Users Found</h3>
            <p className="mt-2 text-gray-500">There are no registered users in the system.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* User Role Badge */}
                  <div className="flex justify-end mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === "admin" 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      <Shield className="h-4 w-4 mr-1" />
                      {user.role === "admin" ? "Administrator" : "User"}
                    </span>
                  </div>

                  {/* User Details */}
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deleteLoading === user._id}
                      className={`mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${deleteLoading === user._id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        } transition-colors duration-300`}
                    >
                      {deleteLoading === user._id ? (
                        <Loader className="animate-spin h-5 w-5" />
                      ) : (
                        <>
                          <Trash2 className="h-5 w-5 mr-2" />
                          Delete User
                        </>
                      )}
                    </button>
                  )}

                  {user.role === "admin" && (
                    <div className="mt-6 text-center p-2 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600">Administrator account cannot be deleted</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersData;
