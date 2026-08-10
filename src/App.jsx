import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Rules from './pages/Rules';
import DonorHome from './pages/DonorHome';
import Requester from './pages/Requester';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/donorHome" element={<DonorHome />} />
        <Route path="/requester" element={<Requester />} />
      </Routes>
    </Router>
  );
}

export default App;