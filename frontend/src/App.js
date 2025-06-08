import React, { useState } from 'react';
import Register from './features/Auth/pages/Register';
import Login from './features/Auth/pages/Login';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  return (
    <div>
      {/* Simple navigation for testing */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setCurrentView('login')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'login'
              ? 'bg-emerald-600 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setCurrentView('register')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'register'
              ? 'bg-emerald-600 text-white'
              : 'bg-white/80 text-gray-700 hover:bg-white'
          }`}
        >
          Register
        </button>
      </div>

      {currentView === 'login' ? <Login /> : <Register />}
    </div>
  );
}

export default App;