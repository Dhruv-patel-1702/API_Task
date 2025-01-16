import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TokenWithUserDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get('https://interview-task-bmcl.onrender.com/api/user/display', {
                    headers: {
                        Authorization: token
                    }
                });
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

        fetchUserDetails();
    }, []);

    if (loading) return <div className="text-center text-white">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('data:image/jpeg;base64,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')" }}>
            <div className="bg-white bg-opacity-70 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-lg w-full">
                <h1 className="text-2xl font-bold text-center mb-6">User Details</h1>
                {userDetails && (
                    <div className="space-y-4">
                        <p className="text-lg"><strong>Name:</strong> {userDetails.name}</p>
                        <p className="text-lg"><strong>Email:</strong> {userDetails.email}</p>
                        <p className="text-lg"><strong>Mobile:</strong> {userDetails.mobile}</p>
                        <p className="text-lg"><strong>Address:</strong> {userDetails.address}</p>
                        <p className="text-lg"><strong>City:</strong> {userDetails.city}</p>
                        <p className="text-lg"><strong>State:</strong> {userDetails.state}</p>
                        <p className="text-lg"><strong>Country:</strong> {userDetails.country}</p>
                        <p className="text-lg"><strong>Date of Birth:</strong> {userDetails.dob}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TokenWithUserDetails; 