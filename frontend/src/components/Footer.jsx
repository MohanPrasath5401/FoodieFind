// frontend/src/components/Footer.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Footer = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Sending...');
        try {
            const response = await axiosInstance.post('/api/contact', formData);
            setStatusMessage(response.data.message); // Success message from backend
            setFormData({ name: '', email: '', message: '' }); // Clear form
        } catch (error) {
            setStatusMessage(error.response?.data?.message || 'Failed to send message.'); // Error from backend or a generic one
        }
    };

    return (
        <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Column 1: Info & Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">FoodieFind</h3>
                        <p className="text-gray-400 mb-4">The best local restaurants, delivered to you.</p>
                        <h4 className="font-semibold mb-2">Address</h4>
                        <p className="text-gray-400">123 Foodie Lane, Flavor Town, 12345</p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:underline text-gray-300">Home</Link></li>
                            <li><Link to="/" className="hover:underline text-gray-300">About</Link></li>
                            <li><a href="#contact-section" className="hover:underline text-gray-300">Contact</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Form */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows="4" className="w-full p-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">Send Message</button>
                        </form>
                        {statusMessage && <p className="mt-4 text-sm">{statusMessage}</p>}
                    </div>
                </div>
            </div>
            <div className="bg-gray-900 text-center py-4 text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} FoodieFind. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;