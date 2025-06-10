import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../features/Auth/services/auth';


const Header = () => {

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
    <header className="bg-gradient-to-r from-cyan-600 to-sky-600 shadow-sm border-b border-gray-500 rounded-b-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <h1 className="text-4xl font-extrabold tracking-wider text-white font-serif">SplitMates</h1>
            <nav className="flex space-x-4">
            <Link to="/groups" className="text-white hover:text-white transition-colors">Home</Link>
            <Link to="/profile" className="text-white hover:text-white transition-colors">Profile</Link>
            </nav>
            <button 
            onClick={handleLogout}
            className="bg-white hover:bg-zinc-300 text-neutral-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
        </div>
    </header>
        );
};

export default Header;
