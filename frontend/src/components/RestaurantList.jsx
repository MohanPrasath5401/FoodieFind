// frontend/src/components/RestaurantList.jsx
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

// --- MODIFIED --- Component now accepts `isAdmin` prop
const RestaurantList = ({ restaurants, setRestaurants, setEditingRestaurant, isAdmin }) => {
  const { user } = useAuth();

  const handleDelete = async (restaurantId) => {
    if (window.confirm("Are you sure you want to delete this restaurant? This cannot be undone.")) {
      try {
        await axiosInstance.delete(`/api/restaurants/${restaurantId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setRestaurants(prevRestaurants => prevRestaurants.filter((r) => r._id !== restaurantId));
      } catch (error) {
        console.error("Failed to delete restaurant:", error);
        alert('Failed to delete restaurant. You must be an admin.');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{isAdmin ? "Manage Restaurants" : "Available Restaurants"}</h2>
      {restaurants.length === 0 ? (
        <p className="text-gray-600 p-4 bg-white rounded-lg shadow">No restaurants match your search or have been added yet.</p>
      ) : (
        // --- MODIFIED --- Using a grid for better layout
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            // --- MODIFIED --- The entire card is a component
            <div key={restaurant._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col justify-between">
              {/* This Link wraps the main content of the card */}
              <Link to={`/restaurants/${restaurant._id}`} className="block p-6 flex-grow">
                <h3 className="font-bold text-xl text-blue-700 hover:underline">{restaurant.name}</h3>
                <p className="text-gray-800 mt-2"><strong>Cuisine:</strong> {restaurant.cuisine}</p>
                <p className="text-sm text-gray-600"><strong>Address:</strong> {restaurant.address}</p>
              </Link>
              
              {/* --- MODIFIED --- Conditional rendering of admin buttons */}
              {isAdmin && (
                <div className="bg-gray-100 p-3 flex justify-end space-x-2">
                  <button
                    onClick={() => setEditingRestaurant(restaurant)}
                    className="bg-yellow-500 text-white px-3 py-1 text-sm rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(restaurant._id)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;