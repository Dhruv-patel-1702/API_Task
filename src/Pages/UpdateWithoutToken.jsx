import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UpdateWithoutToken = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        try {
            const response = await axios.get(
                `https://interview-task-bmcl.onrender.com/api/user/userDetails?userId=${userId}`,
                {
                    headers: {
                        Authorization: token
                    }
                }
            );
            if (response.data.success) {
                setUserDetails(response.data.data);
            } else {
                setError("Failed to fetch user details");
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Error fetching user details');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        try {
            // First update the user details
            const updateResponse = await axios.put(
                `https://interview-task-bmcl.onrender.com/api/user/updateUser?userId=${userId}`,
                { ...userDetails },
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (updateResponse.data.success) {
                // Get fresh data after update
                const freshDataResponse = await axios.get(
                    `https://interview-task-bmcl.onrender.com/api/user/userDetails?userId=${userId}`,
                    {
                        headers: {
                            Authorization: token
                        }
                    }
                );

                if (freshDataResponse.data.success) {
                    // Store fresh data in localStorage
                    localStorage.setItem("userDetails", JSON.stringify(freshDataResponse.data.data));
                    alert('Information updated successfully!');
                    navigate('/home', { replace: true });
                }
            } else {
                setError("Failed to update user details");
            }
        } catch (error) {
            console.error('Update error:', error);
            setError(error.response?.data?.message || 'Error updating user details');
        }
    };

    if (loading) return <div className="text-center text-white">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
            style={{ 
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), 
                url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`
            }}>
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold text-center mb-6">Update User Information</h2>
                {userDetails && (
                    <div className="space-y-4">
                        <div>
                            <label className="font-semibold">Name:</label>
                            <input 
                                type="text" 
                                value={userDetails.name || ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Email:</label>
                            <input 
                                type="email" 
                                value={userDetails.email || ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Mobile:</label>
                            <input 
                                type="text" 
                                value={userDetails.mobile || ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Address:</label>
                            <input 
                                type="text" 
                                value={userDetails.address || ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>
                        <div>
                            <label className="font-semibold">City:</label>
                            <input 
                                type="text" 
                                value={userDetails.city|| ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, city : e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>

                        <div>
                            <label className="font-semibold">City:</label>
                            <input 
                                type="text" 
                                value={userDetails.state|| ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, state : e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Country:</label>
                            <input 
                                type="text" 
                                value={userDetails.country|| ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, country : e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Date of Birth:</label>
                            <input 
                                type="text" 
                                value={userDetails.dob|| ''} 
                                onChange={(e) => setUserDetails({ ...userDetails, dob : e.target.value })}
                                className="border border-gray-300 p-2 rounded w-full" 
                            />
                        </div>
                       
                        
                        <button 
                            onClick={handleUpdate}
                            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                        >
                            Update Information
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateWithoutToken;