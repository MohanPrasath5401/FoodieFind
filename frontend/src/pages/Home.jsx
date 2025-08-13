// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to FoodieFind</h1>
      <p className="text-lg text-gray-700 mb-6">
        Your ultimate destination for discovering and ordering from the best local restaurants.
      </p>
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
        <ol className="list-decimal list-inside text-left space-y-2">
          <li><strong>Browse Restaurants:</strong> Explore a wide variety of cuisines and places.</li>
          <li><strong>View Menus:</strong> Check out detailed menus to find your perfect meal.</li>
          <li><strong>Place Your Order:</strong> A simple and fast ordering process is coming soon!</li>
        </ol>
      </div>
      <div className="mt-8">
        <Link 
            to="/login" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-xl hover:bg-blue-700 transition duration-300"
        >
            Get Started & View Restaurants
        </Link>
      </div>
    </div>
  );
};

export default Home;