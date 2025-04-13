import React, { useEffect, useState } from "react";
import API from "../utils/axiosInstance";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await API.get("/api/contact/contacts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        setContacts(response.data); // Store data in state
      } catch (error) {
        setError(error.response ? error.response.data.message : "Failed to fetch contacts. Make sure you are an admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts(); // Call the function inside useEffect
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin - Contact Submissions</h1>

      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Subject</th>
                <th className="py-3 px-6 text-left">Message</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="border-b">
                  <td className="py-2 px-6">{contact.name}</td>
                  <td className="py-2 px-6">{contact.email}</td>
                  <td className="py-2 px-6">{contact.subject}</td>
                  <td className="py-2 px-6">{contact.message}</td>
                  <td className="py-2 px-6">{new Date(contact.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;