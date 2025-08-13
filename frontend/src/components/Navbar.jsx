// frontend/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- RECTIFIED CODE ---
  // 1. Get the entire context object first.
  const cartContext = useCart();
  
  // 2. Defensively destructure cartItems only if the context is not undefined.
  const cartItems = cartContext ? cartContext.cartItems : [];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // 3. Ensure cartItems exists before trying to run .reduce() on it.
  const cartItemCount = cartItems ? cartItems.reduce((acc, item) => acc + item.qty, 0) : 0;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold">FoodieFind</Link>
      <div className="flex items-center space-x-6">
        {user ? (
          <>
            <Link to="/restaurants" className="hover:underline">Restaurants</Link>
            
            {user.role === 'user' && (
              <>
                <Link to="/myorders" className="hover:underline">My Orders</Link>
                <Link to="/cart" className="hover:underline flex items-center">
                    Cart
                    {/* 4. Ensure cartItemCount is a valid number */}
                    {cartItemCount > 0 && (
                        <span className="ml-1.5 bg-green-400 text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {cartItemCount}
                        </span>
                    )}
                </Link>
              </>
            )}

            <Link to="/profile" className="hover:underline">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link
              to="/register"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;