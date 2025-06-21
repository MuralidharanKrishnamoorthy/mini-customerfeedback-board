// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Submit from './pages/Submit';
import Detail from './pages/Detail';
import Login from './pages/Login';      // ✅
import Admin from './pages/Admin';      // ✅

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/feedback/:id" element={<Detail />} />
        <Route path="/login" element={<Login />} />     {/* ✅ Add this */}
        <Route path="/admin" element={<Admin />} />     {/* ✅ Add this */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
