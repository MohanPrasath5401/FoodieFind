// frontend/src/pages/AboutPage.jsx
import React from 'react';

const AboutPage = () => {
    return (
        <div className="container mx-auto p-8">
            <div className="bg-white p-10 rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-4">About FoodieFind</h1>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    FoodieFind was born from a simple idea: to connect people with the vibrant, diverse, and delicious food scenes in their local communities. We believe that great food is about more than just taste; it's about the experience, the culture, and the people behind it.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                    Our platform empowers local restaurants by providing them with the tools to reach a wider audience, while offering our users a seamless and enjoyable way to discover new favorites and enjoy classic comforts. From the trendiest new spots to timeless neighborhood gems, FoodieFind is your trusted partner in culinary exploration.
                </p>
            </div>
        </div>
    );
};

export default AboutPage;