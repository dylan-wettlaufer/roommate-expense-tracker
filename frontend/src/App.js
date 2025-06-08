import React, { useState } from 'react';
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Register from './features/Auth/pages/Register';
import Login from './features/Auth/pages/Login';
import DisplayGroups from './features/Groups/pages/DisplayGroups';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/groups" element={<DisplayGroups />} />
      </Routes>
    </Router>
  );
}

export default App;