import React, { useState } from 'react';
import {HashRouter as Router, Routes, Route} from "react-router-dom";
import Register from './features/Auth/pages/Register';
import Login from './features/Auth/pages/Login';
import DisplayGroups from './features/Groups/pages/DisplayGroups';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/groups" element={<DisplayGroups />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;