import React from 'react';

const Header = () => {
    return (
    <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">SplitMates</h1>
            <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Profile</a>
            </nav>
        </div>
        </div>
    </header>
        );
};

export default Header;
