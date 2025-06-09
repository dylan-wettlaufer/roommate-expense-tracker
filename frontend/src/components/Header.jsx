import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/Auth/services/auth';


const Header = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
    <header className="bg-black shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-white">SplitMates</h1>
            <nav className="flex space-x-4">
            <a href="#" className="text-white hover:text-gray-200 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-gray-200 transition-colors">Profile</a>
            </nav>
            <button 
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
        </div>
    </header>
        );
};

export default Header;
