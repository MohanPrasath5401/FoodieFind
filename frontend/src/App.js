// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';

// --- NEW IMPORTS ---
// Import all the new screens for the ordering process.
import CartScreen from './pages/CartScreen';
import CheckoutScreen from './pages/CheckoutScreen';
import OrderScreen from './pages/OrderScreen';
import MyOrdersScreen from './pages/MyOrdersScreen';
import Footer from './components/Footer';

import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  
  return (
    <Router>
      <Navbar />
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          {/* Public & Authentication Routes */}
          <Route path="/" element={!user ? <Home /> : <Navigate to="/restaurants" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/restaurants" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/restaurants" />} />
          
          {/* General Protected Routes */}
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/restaurants" element={user ? <Restaurants /> : <Navigate to="/login" />} />
          <Route path="/restaurants/:id" element={user ? <RestaurantDetail /> : <Navigate to="/login" />} />
          
          {/* --- NEW USER-ONLY PROTECTED ROUTES --- */}
          {/* Added the full set of routes for the cart and order workflow */}
          <Route path="/cart" element={user ? <CartScreen /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <CheckoutScreen /> : <Navigate to="/login" />} />
          <Route path="/order/:id" element={user ? <OrderScreen /> : <Navigate to="/login" />} />
          <Route path="/myorders" element={user ? <MyOrdersScreen /> : <Navigate to="/login" />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;