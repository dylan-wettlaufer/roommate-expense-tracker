import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Register from './features/Auth/pages/Register';
import Login from './features/Auth/pages/Login';
import DisplayGroups from './features/Groups/pages/DisplayGroups';
import PrivateRoute from './components/PrivateRoute';
import Landing from './pages/Landing';
import Group from './features/Groups/pages/Group';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> // landing page
        <Route path="/login" element={<Login />} /> // login page
        <Route path="/register" element={<Register />} /> // register page
        <Route element={<PrivateRoute />}> // private route
          <Route path="/groups" element={<DisplayGroups />} /> // display groups
          <Route path="/group/:id" element={<Group />} /> // display group
        </Route>
      </Routes>
    </Router>
  );
}

export default App;