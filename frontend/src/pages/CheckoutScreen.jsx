// frontend/src/pages/CheckoutScreen.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, saveShippingAddress, clearCart } = useCart();
  const { user } = useAuth();
  
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [loading, setLoading] = useState(false);
  
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example shipping cost
  const totalPrice = itemsPrice + shippingPrice;

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    saveShippingAddress({ address, city, postalCode });

    try {
      const order = {
        orderItems: cartItems,
        shippingAddress: { address, city, postalCode },
        paymentMethod: 'DummyPay', // As this is a dummy payment page
        totalPrice: totalPrice,
      };

      const { data: createdOrder } = await axiosInstance.post('/api/orders', order, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      
      clearCart(); // Clear the cart from state and localStorage
      navigate(`/order/${createdOrder._id}`); // Redirect to the final order confirmation screen
    } catch (error) {
      console.error('Order placement failed', error);
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Shipping Address Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl mb-4">Shipping Address</h2>
            <form onSubmit={placeOrderHandler}>
              <div className="space-y-4">
                <input type="text" placeholder="Enter address" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 border rounded" />
                <input type="text" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full p-2 border rounded" />
                <input type="text" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className="w-full p-2 border rounded" />
              </div>
            </form>
          </div>
          {/* Dummy Payment Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4">Payment Method</h2>
            <p>Method: DummyPay / Credit Card</p>
          </div>
        </div>
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl mb-4">Order Summary</h2>
            <ul className="mb-4 space-y-2">
              {cartItems.map((item, index) => (
                <li key={index} className="flex justify-between"><span>{item.name} (x{item.qty})</span><span>${(item.price * item.qty).toFixed(2)}</span></li>
              ))}
            </ul>
            <hr />
            <div className="my-4 space-y-2">
              <p className="flex justify-between"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></p>
              <p className="flex justify-between font-bold"><span>Total</span><span>${totalPrice.toFixed(2)}</span></p>
            </div>
            <button
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Placing Order...' : 'Place Order & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;