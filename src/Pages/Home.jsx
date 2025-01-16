import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/material";
import Avatar from "@mui/material/Avatar";

const Home = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `https://interview-task-bmcl.onrender.com/api/user/userDetails?userId=${userId}`
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
        setError("User ID not found");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleNavigateToCards = () => {
    navigate("/cards");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (selectedFile.size > 5000000) {
        setError("File size should be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setError("");
    }
  };

  const handleDeleteProfile = async () => {
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(
        `https://interview-task-bmcl.onrender.com/api/user/delete?userId=${userID}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        alert("Account deleted successfully!");
        // Clear all local storage
        localStorage.clear();
        // Navigate to signup page
        navigate("/", { replace: true });
      } else {
        setError("Failed to delete account");
      }
    } catch (error) {
      console.error("Delete account error:", error);
      setError(error.response?.data?.message || "Failed to delete account");
    }
  };

  const handlePhotoUpdate = async () => {
    if (!file) {
      setError("Please select a photo first");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("profile_photo", file);

      const response = await axios({
        method: "put",
        url: "https://interview-task-bmcl.onrender.com/api/user/updateWithPhoto",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token,
        },
      });

      if (response.data.success) {
        const updatedUserDetails = await axios.get(
          `https://interview-task-bmcl.onrender.com/api/user/userDetails?userId=${userId}`
        );
        if (updatedUserDetails.data.success) {
          setUserDetails(updatedUserDetails.data.data);
        }
        alert("Profile photo updated successfully!");
      } else {
        setError(response.data.message || "Failed to update photo");
      }
    } catch (error) {
      console.error("Photo update error:", error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      } else {
        setError("Failed to update photo. Please try again.");
      }
    }
  };

  const handleTokenWithUserDetails = () => {
    navigate("/token-with-user-details");
  };

  const handleUpdateWithoutToken = () => {
    navigate("/update-without-token");
  };

  const handleTokenWithUpdate = () => {
    navigate("/token-with-update");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full">
        <Box className="flex flex-col items-center mb-6">
          <Avatar
            src={userDetails?.photo || userDetails?.profile_photo}
            alt="Profile"
            sx={{
              width: 80,
              height: 80,
              border: "2px solid #3f51b5",
              boxShadow: 2,
              mb: 2,
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded"
          />
          <button
            onClick={handlePhotoUpdate}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Photo
          </button>
        </Box>
        // Update the userDetails section in the return statement
        {userDetails && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="font-semibold">Name:</label>
                <input
                  type="text"
                  value={userDetails.name || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Email:</label>
                <input
                  type="email"
                  value={userDetails.email || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Mobile:</label>
                <input
                  type="text"
                  value={userDetails.mobile || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Address:</label>
                <input
                  type="text"
                  value={userDetails.address || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">City:</label>
                <input
                  type="text"
                  value={userDetails.city || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">State:</label>
                <input
                  type="text"
                  value={userDetails.state || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Country:</label>
                <input
                  type="text"
                  value={userDetails.country || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold">Date of Birth:</label>
                <input
                  type="text"
                  value={userDetails.dob || ""}
                  readOnly
                  className="border border-gray-300 p-2 rounded bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={handleTokenWithUserDetails}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Token With User Details
              </button>
              <button
                onClick={handleUpdateWithoutToken}
                className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Update Information Without Token
              </button>
              <button
                onClick={handleTokenWithUpdate}
                className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Token With Update
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
              <button
                onClick={handleDeleteProfile}
                className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
              >
                Delete Profile
              </button>
              <button
                onClick={handleNavigateToCards}
                className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600"
              >
                Upload Multiple Photos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
