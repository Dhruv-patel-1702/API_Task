import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TokenWithUpdate = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (userId && token) {
        try {
          const response = await axios.get(
            `https://interview-task-bmcl.onrender.com/api/user/userDetails?userId=${userId}`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (response.data.success) {
            setUserDetails(response.data.data);
          } else {
            setError("Failed to fetch user details");
          }
        } catch (error) {
          setError(
            error.response?.data?.message || "Error fetching user details"
          );
        } finally {
          setLoading(false);
        }
      } else {
        setError("User ID or token not found");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.put(
        "https://interview-task-bmcl.onrender.com/api/user/updateWithToken",
        userDetails,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        alert("Profile updated successfully!");
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        navigate("/home"); 
      } else {
        alert(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Token update error:", error);
      if (error.response?.status === 401) {
        alert("Token expired or invalid. Please login again.");
        localStorage.clear();
        navigate("/login");
      } else {
        alert(error.response?.data?.message || "Failed to update profile");
      }
    }
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuR9avqZeC-3dK1DT7LLGgQobTe91ZAXKLaQ&s')" }}
    >
      <div className="bg-white bg-opacity-70 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Update User Information
        </h1>
        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <input
              type="text"
              value={userDetails.name}
              onChange={(e) =>
                setUserDetails({ ...userDetails, name: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Email:</label>
            <input
              type="text"
              value={userDetails.email}
              onChange={(e) =>
                setUserDetails({ ...userDetails, email: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Mobile:</label>
            <input
              type="text"
              value={userDetails.mobile}
              onChange={(e) =>
                setUserDetails({ ...userDetails, mobile: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Address:</label>
            <input
              type="text"
              value={userDetails.address}
              onChange={(e) =>
                setUserDetails({ ...userDetails, address: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold">City:</label>
            <input
              type="text"
              value={userDetails.city}
              onChange={(e) =>
                setUserDetails({ ...userDetails, city: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold">State:</label>
            <input
              type="text"
              value={userDetails.state}
              onChange={(e) =>
                setUserDetails({ ...userDetails, state: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Country:</label>
            <input
              type="text"
              value={userDetails.country}
              onChange={(e) =>
                setUserDetails({ ...userDetails, country: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="font-semibold">Date of Birth:</label>
            <input
              type="date"
              value={userDetails.dob}
              onChange={(e) =>
                setUserDetails({ ...userDetails, dob: e.target.value })
              }
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
        </div>
        <button
          onClick={handleUpdate}
          className="mt-6 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Update Information
        </button>
      </div>
    </div>
  );
};

export default TokenWithUpdate;
