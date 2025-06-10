import React from 'react';

const Button = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className="bg-cyan-600 hover:bg-cyan-700 border-0 shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             text-white font-medium py-2 px-4 rounded-lg 
        "
        >
            {children}
        </button>
    );
};

export default Button;

// bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700