// frontend/src/components/RestaurantForm.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const RestaurantForm = ({ restaurants, setRestaurants, editingRestaurant, setEditingRestaurant }) => {
  const { user } = useAuth();
  // State for form data, tailored for restaurants
  const [formData, setFormData] = useState({ name: '', address: '', cuisine: '' });

  // Pre-fill form if we are editing an existing restaurant
  useEffect(() => {
    if (editingRestaurant) {
      setFormData({
        name: editingRestaurant.name,
        address: editingRestaurant.address,
        cuisine: editingRestaurant.cuisine,
      });
    } else {
      // Clear form if not editing
      setFormData({ name: '', address: '', cuisine: '' });
    }
  }, [editingRestaurant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.cuisine) {
        alert("Please fill out all fields.");
        return;
    }
    try {
      if (editingRestaurant) {
        // Update existing restaurant
        const response = await axiosInstance.put(`/api/restaurants/${editingRestaurant._id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRestaurants(restaurants.map((r) => (r._id === response.data._id ? response.data : r)));
      } else {
        // Create new restaurant
        const response = await axiosInstance.post('/api/restaurants', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRestaurants([...restaurants, response.data]);
      }
      // Reset form and editing state
      setEditingRestaurant(null);
      setFormData({ name: '', address: '', cuisine: '' });
    } catch (error) {
      console.error("Failed to save restaurant:", error);
      alert('Failed to save restaurant. Check console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingRestaurant ? 'Edit Restaurant' : 'Add a New Restaurant'}
      </h1>
      <input
        type="text"
        placeholder="Restaurant Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
       <input
        type="text"
        placeholder="Cuisine (e.g., Italian, Mexican)"
        value={formData.cuisine}
        onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        {editingRestaurant ? 'Update Restaurant' : 'Create Restaurant'}
      </button>
    </form>
  );
};

export default RestaurantForm;