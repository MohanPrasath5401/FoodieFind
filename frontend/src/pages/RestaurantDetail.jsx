// frontend/src/pages/RestaurantDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import useCart to add items

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart(); // Get the addToCart function from context
  const navigate = useNavigate(); // Hook for programmatic navigation
  
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '' });
  const [qty, setQty] = useState(1); // State to manage the quantity of an item to add

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axiosInstance.get(`/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRestaurant(response.data);
      } catch (error) { 
        console.error("Failed to fetch restaurant details:", error);
      } finally { 
        setLoading(false); 
      }
    };
    fetchRestaurant();
  }, [id, user.token]);
  
  // Admin-only functions (no changes to these)
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newMenuItem.name || !newMenuItem.price) {
      alert("Item name and price are required.");
      return;
    }
    const updatedMenu = [...(restaurant.menu || []), { ...newMenuItem, price: Number(newMenuItem.price) }];
    try {
      const response = await axiosInstance.put(`/api/restaurants/${id}`, { ...restaurant, menu: updatedMenu }, { headers: { Authorization: `Bearer ${user.token}` } });
      setRestaurant(response.data);
      setNewMenuItem({ name: '', description: '', price: '' });
    } catch (error) {
      alert("Failed to add menu item. You must be an admin.");
    }
  };
  const handleDeleteMenuItem = async (itemIndexToDelete) => {
      if (!window.confirm("Are you sure you want to delete this menu item?")) return;
      const updatedMenu = restaurant.menu.filter((_, index) => index !== itemIndexToDelete);
      try {
        const response = await axiosInstance.put(`/api/restaurants/${id}`, { ...restaurant, menu: updatedMenu }, { headers: { Authorization: `Bearer ${user.token}` } });
        setRestaurant(response.data);
      } catch (error) {
        alert("Failed to delete menu item. You must be an admin.");
      }
  };

  // --- MODIFIED: This function replaces the old handleOrder alert ---
  const handleAddToCart = (menuItem) => {
    addToCart({
      product: restaurant._id, // The ID of the restaurant itself
      name: menuItem.name,
      price: menuItem.price,
      restaurantId: restaurant._id, // Also store restaurant ID for potential cart logic
    }, qty); // Add the item with the selected quantity
    navigate('/cart'); // Redirect user to the cart page
  };

  if (loading) return <div className="text-center mt-20">Loading menu...</div>;
  if (!restaurant) return <div className="text-center mt-20">Restaurant not found.</div>;

  return (
    <div className="container mx-auto p-8">
      <Link to="/restaurants" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Restaurants</Link>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-lg text-gray-700">{restaurant.cuisine}</p>
        <p className="text-md text-gray-500">{restaurant.address}</p>
      </div>

      <h2 className="text-3xl font-semibold mb-4">Menu</h2>
      <div className="space-y-4">
        {restaurant.menu && restaurant.menu.length > 0 ? (
          restaurant.menu.map((item, index) => (
            <div key={`${item.name}-${index}`} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-600">{item.description || 'No description available.'}</p>
                <p className="text-lg font-semibold mt-2">${Number(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-3">
                {/* --- NEW: Quantity Selector --- */}
                {user.role === 'user' && (
                  <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="border rounded p-2 text-gray-800">
                    {[...Array(5).keys()].map(x => ( <option key={x + 1} value={x + 1}>{x + 1}</option> ))}
                  </select>
                )}
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                  Add to Cart
                </button>
                {user.role === 'admin' && (
                  <button onClick={() => handleDeleteMenuItem(index)} className="bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold hover:bg-red-600">
                    X
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="bg-white p-4 rounded-lg shadow">This restaurant has not added any menu items yet.</p>
        )}
      </div>

      {user.role === 'admin' && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Add a New Menu Item</h3>
          <form onSubmit={handleAddMenuItem} className="space-y-4">
            <input type="text" placeholder="Item Name" value={newMenuItem.name} onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})} className="w-full p-2 border rounded" required/>
            <textarea placeholder="Item Description (optional)" value={newMenuItem.description} onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})} className="w-full p-2 border rounded" />
            <input type="number" placeholder="Price" value={newMenuItem.price} onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})} className="w-full p-2 border rounded" step="0.01" required />
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Add Item to Menu</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;