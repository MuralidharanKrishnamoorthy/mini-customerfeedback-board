// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Home from './pages/Home';
import Submit from './pages/Submit';
import Detail from './pages/Detail';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import UserFeedback from './pages/UserFeedback';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '24px' }}>
        <Outlet />
      </main>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/feedback/:id" element={<Detail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-feedback" element={<UserFeedback />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
