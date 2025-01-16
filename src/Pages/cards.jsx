import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const imageStyles = {
  fadeIn: {
    opacity: 1,
    transition: 'opacity 0.3s ease-in'
  },
  loading: {
    opacity: 0
  }
};

const Cards = () => {
  const navigate = useNavigate();

  // States
  const [images, setImages] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageError, setImageError] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemFile, setEditingItemFile] = useState(null);
  const [isCartItemEditing, setIsCartItemEditing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [localImages, setLocalImages] = useState(() => {
    const saved = localStorage.getItem('uploadedImages');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'https://interview-task-bmcl.onrender.com/api/cart/display_cart',
        {
          headers: {
            Authorization: token
          },
          params: { userId }
        }
      );

      if (response.data.success) {
        setCartItems(response.data.data || []);
        // Also update uploadedImages with the fetched data
        const formattedImages = (response.data.data || []).map(item => ({
          id: item._id,
          url: item.cart_photos[0], // Assuming first photo is main
          name: item.title
        }));
        setUploadedImages(formattedImages);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load images. Please try again.');
    }
  };

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        // Store base64 string directly
        resolve(event.target.result);
      };
    });
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Reset states for new upload
  const handleMultipleImageUpload = () => {
    setSelectedImages([]);
    setImageError('');
    setPreviewImages([]);
  };

  // Handle image selection
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImageError("");

    // Validate file types
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setImageError('Please select only image files');
      return;
    }

    // Check file sizes
    const largeFiles = files.filter(file => file.size > 5000000);
    if (largeFiles.length > 0) {
      setImageError('Each file should be less than 5MB');
      return;
    }

    setSelectedImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Handle image upload
  const handleUploadMultipleImages = async () => {
    if (selectedImages.length === 0) {
      setImageError('Please select images to upload');
      return;
    }

    setLoading(true);
    try {
      // Convert images to base64 and store
      const newItems = await Promise.all(
        selectedImages.map(async (image, index) => {
          const base64Image = await compressImage(image);
          return {
            id: `IMG_${Date.now()}_${index}`,
            url: base64Image, // Store base64 string directly
            name: image.name,
            title: title,
            description: description,
            createdAt: new Date().toISOString()
          };
        })
      );

      // Update state and local storage
      setLocalImages(prevImages => {
        const updatedImages = [...newItems, ...prevImages];
        localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
        return updatedImages;
      });

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedImages([]);
      setPreviewImages([]);
      setImageError('');
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setImageError('Failed to upload images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit mode
  const handleCartItemEdit = (itemId) => {
    setEditingItemId(itemId);
    setIsCartItemEditing(true);
  };

  // Handle file change in edit mode
  const handleCartItemFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setEditingItemFile(file);
    } else {
      alert('Please select an image file');
    }
  };

  // Handle item update
  const handleCartItemUpdate = async () => {
    if (!editingItemFile) return;

    try {
      const base64Image = await compressImage(editingItemFile);

      setLocalImages(prevImages => {
        const updatedImages = prevImages.map(item => {
          if (item.id === editingItemId) {
            return {
              ...item,
              url: base64Image,
              name: editingItemFile.name,
              updatedAt: new Date().toISOString()
            };
          }
          return item;
        });
        localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
        return updatedImages;
      });

      setIsCartItemEditing(false);
      setEditingItemId(null);
      setEditingItemFile(null);
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update image');
    }
  };

  // Handle delete all items
  const handleDeleteCart = () => {
    if (window.confirm('Are you sure you want to delete all items?')) {
      setLocalImages([]);
      localStorage.removeItem('uploadedImages');
    }
  };

  // Handle delete single item
  const handleDeleteCartItem = (itemId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      setLocalImages(prevImages => {
        const updatedImages = prevImages.filter(item => item.id !== itemId);
        localStorage.setItem('uploadedImages', JSON.stringify(updatedImages));
        return updatedImages;
      });
    }
  };

  // Reset form helper
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedImages([]);
    setPreviewImages([]);
    setImageError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Upload Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Upload Multiple Images</h2>
            <button
              onClick={handleDeleteCart}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear All
            </button>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            handleUploadMultipleImages();
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full p-2 border rounded-md"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Multiple Images
              </label>
              <input
                type="file"
                onChange={handleMultipleImagesChange}
                multiple
                accept="image/jpeg,image/png,image/gif"
                className="mt-1 w-full p-2 border rounded-md"
                required
              />
            </div>

            {imageError && (
              <div className="mt-4 p-3 bg-red-100 text-red-600 rounded-md">
                {imageError}
              </div>
            )}

            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {previewImages.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Uploading..." : "Upload Images"}
            </button>
          </form>
        </div>

        {/* Display Uploaded Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localImages.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={item.url}
                  alt={item.title || 'Image'}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  style={imageStyles.fadeIn}
                  onLoad={(e) => e.target.style.opacity = 1}
                  onError={(e) => e.target.style.opacity = 0}
                />
                <div className="absolute bottom-0 right-0 p-2 space-x-2 bg-black bg-opacity-50">
                  <button
                    onClick={() => handleCartItemEdit(item.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCartItem(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isCartItemEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Update Image</h3>
            <input
              type="file"
              onChange={handleCartItemFileChange}
              accept="image/*"
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCartItemEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCartItemUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
