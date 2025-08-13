// frontend/src/pages/Restaurants.jsx
import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import RestaurantForm from '../components/RestaurantForm';
import RestaurantList from '../components/RestaurantList';
import { useAuth } from '../context/AuthContext';

const Restaurants = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search term

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const response = await axiosInstance.get('/api/restaurants', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error('Failed to fetch restaurants:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [user]);

  // --- NEW --- Filter restaurants based on the search term
  const filteredRestaurants = restaurants.filter(restaurant => {
    const term = searchTerm.toLowerCase();
    const nameMatch = restaurant.name.toLowerCase().includes(term);
    // Also check if any menu item's name matches the search term
    const menuMatch = restaurant.menu.some(item => item.name.toLowerCase().includes(term));
    return nameMatch || menuMatch;
  });

  if (loading) return <div className="text-center mt-20">Loading restaurants...</div>;

  return (
    <div className="container mx-auto p-6">
      {/* --- MODIFIED --- Conditionally render the form only if the user is an admin */}
      {user && user.role === 'admin' && (
        <RestaurantForm
          restaurants={restaurants}
          setRestaurants={setRestaurants}
          editingRestaurant={editingRestaurant}
          setEditingRestaurant={setEditingRestaurant}
        />
      )}
      
      {/* --- NEW --- Search Bar */}
      <div className="my-6">
        <input 
          type="text"
          placeholder="Search for a restaurant or food item..."
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* --- MODIFIED --- Pass filtered list and isAdmin prop */}
      <RestaurantList
        restaurants={filteredRestaurants} 
        setRestaurants={setRestaurants}
        setEditingRestaurant={setEditingRestaurant}
        isAdmin={user && user.role === 'admin'} 
      />
    </div>
  );
};

export default Restaurants;