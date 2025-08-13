// frontend/src/pages/OrderScreen.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    if (user.token) {
        fetchOrder();
    }
  }, [orderId, user.token]);

  return loading ? (<p>Loading order details...</p>) : order ? (
    <div className="container mx-auto p-8">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6">
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
             <p>Thank you for your purchase. Your order {/*<span className="font-mono bg-green-200 p-1 rounded">{order._id}</span>*/} has been placed.</p> 
        </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-2 font-semibold">Shipping To:</h2>
                <p><strong>{order.user.name}</strong> ({order.user.email})</p>
                <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <div className="mt-4 bg-green-200 p-2 rounded text-center">Paid on {new Date(order.paidAt).toLocaleDateString()}</div>
            </div>
        </div>
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl mb-4">Order Summary</h2>
                {order.orderItems.map((item, index) => (
                    <p key={index} className="flex justify-between"><span>{item.name} (x{item.qty})</span><span>${(item.price * item.qty).toFixed(2)}</span></p>
                ))}
                <hr className="my-2" />
                <p className="flex justify-between font-bold"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></p>
            </div>
        </div>
      </div>
    </div>
  ) : (<p>Order not found.</p>);
};

export default OrderScreen;