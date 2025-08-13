// frontend/src/pages/CartScreen.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
    const navigate = useNavigate();
    const { cartItems, addToCart, removeFromCart } = useCart();

    // Calculate subtotal (total number of items) and total price
    const subtotalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);

    const checkoutHandler = () => {
        // Navigate to the checkout page if the user is ready to proceed
        navigate('/checkout');
    };
    
    // Handler for changing quantity from the dropdown
    const handleQtyChange = (item, newQty) => {
        const qtyDifference = newQty - item.qty;
        addToCart(item, qtyDifference);
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
            {cartItems.length === 0 ? (
                <div className="bg-blue-100 p-4 rounded-lg text-center">
                    <p>Your cart is empty.</p>
                    <Link to="/restaurants" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
                        &larr; Go Back To Restaurants
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.name + item.restaurantId} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
                                <div className="flex-1 min-w-0">
                                    <Link to={`/restaurants/${item.restaurantId}`} className="text-lg font-semibold text-blue-700 hover:underline truncate" title={item.name}>
                                        {item.name}
                                    </Link>
                                </div>
                                <div className="w-24 text-center text-md font-medium">${item.price.toFixed(2)}</div>
                                <div className="w-24">
                                    <select 
                                        value={item.qty} 
                                        onChange={(e) => handleQtyChange(item, Number(e.target.value))} 
                                        className="border rounded p-2 w-full bg-gray-50"
                                    >
                                        {[...Array(5).keys()].map(x => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-20 text-right">
                                    <button 
                                        onClick={() => removeFromCart(item.name)} 
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        title="Remove item"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Summary Box */}
                    <div className="md:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl mb-4 font-bold border-b pb-2">
                                Order Summary
                            </h2>
                            <div className="flex justify-between text-lg mb-2">
                                <span>Subtotal ({subtotalItems} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <hr/>
                            <button 
                                onClick={checkoutHandler} 
                                className="w-full bg-blue-600 text-white mt-4 p-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400" 
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartScreen;