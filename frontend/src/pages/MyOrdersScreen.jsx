// frontend/src/pages/MyOrdersScreen.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const MyOrdersScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await axiosInstance.get('/api/orders/myorders', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch user's orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, [user.token]);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            {loading ? <p>Loading orders...</p> : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 text-left">ORDER ID</th>
                                <th className="p-4 text-left">DATE</th>
                                <th className="p-4 text-left">TOTAL</th>
                                <th className="p-4 text-left">PAID</th>
                                <th className="p-4"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? orders.map(order => (
                                <tr key={order._id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-mono text-sm">{order._id}</td>
                                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4">${order.totalPrice.toFixed(2)}</td>
                                    <td className="p-4 text-green-600">{order.isPaid ? `Paid on ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}</td>
                                    <td className="p-4 text-center">
                                        <Link to={`/order/${order._id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center">You have no orders.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrdersScreen;