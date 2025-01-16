import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
    gender: 'male',
    dob: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    setError('');
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formDataToSend = {
        ...formData,
        mobile: Number(formData.mobile),
        pincode: Number(formData.pincode)
      };

      const response = await axios.post(
        'https://interview-task-bmcl.onrender.com/api/user/add_user',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(
        error.response?.data?.message || 
        'Registration failed. Please check your input and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 text-gray-700 bg-white/90";
  const labelStyle = "block text-sm font-semibold text-white mb-2";

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`,
      }}
    >
      <div className="max-w-4xl w-full bg-black/40 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-6 p-3 bg-red-500/80 text-white rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div
              onClick={handleImageClick}
              className="relative cursor-pointer group"
            >
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 ${
                !imagePreview && 'bg-gray-100'
              }`}>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Change Photo
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="mt-2 text-sm text-gray-300">
              Click to upload profile photo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelStyle}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="Your Name"
                className={inputStyle}
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelStyle}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="example@email.com"
                className={inputStyle}
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="mobile" className={labelStyle}>Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                required
                pattern="[0-9]{10}"
                placeholder="10-digit mobile number"
                className={inputStyle}
                value={formData.mobile}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelStyle}>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength="6"
                placeholder="********"
                className={inputStyle}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className={labelStyle}>Address</label>
              <textarea
                id="address"
                name="address"
                required
                rows="2"
                placeholder="Enter your full address"
                className={inputStyle}
                value={formData.address}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="pincode" className={labelStyle}>Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                required
                pattern="[0-9]{6}"
                placeholder="6-digit pincode"
                className={inputStyle}
                value={formData.pincode}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="gender" className={labelStyle}>Gender</label>
              <select
                id="gender"
                name="gender"
                required
                className={inputStyle}
                value={formData.gender}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="city" className={labelStyle}>City</label>
              <input
                type="text"
                id="city"
                name="city"
                required
                placeholder="Your City"
                className={inputStyle}
                value={formData.city}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="state" className={labelStyle}>State</label>
              <input
                type="text"
                id="state"
                name="state"
                required
                placeholder="Your State"
                className={inputStyle}
                value={formData.state}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="country" className={labelStyle}>Country</label>
              <input
                type="text"
                id="country"
                name="country"
                required
                placeholder="Your Country"
                className={inputStyle}
                value={formData.country}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="dob" className={labelStyle}>Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                required
                className={inputStyle}
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <p className="text-center text-white">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;