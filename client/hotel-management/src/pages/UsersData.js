import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersData = () => {
  const [users, setUsers] = useState([]); // Initialized as an empty array
  const [error, setError] = useState(null);

  // Fetch users data (name and email only)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/admin/usersdata", {
          headers: { Authorization: `${token}` },
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);


  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/user-delete/${userId}`);
      setUsers(users.filter(user => user._id !== userId)); // Remove user from UI
      alert("User deleted Succesfully")
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Delete Failed", err)
    }
  }


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">{users.length} Registered Users Data</h2>

      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(users) && users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id} className="border p-4 mb-2 rounded-md">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              {user.role !== "admin" ? (
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded-md"
                >
                  Delete
                </button>
              ) : <div className="bg-green-500 text-white w-fit px-3"> Admin Cannot be DELETED  </div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

};

export default UsersData;
