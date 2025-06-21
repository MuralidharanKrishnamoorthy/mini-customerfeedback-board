// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
    <h1 className="text-xl font-bold text-blue-600">Mini Feedback Board</h1>
    <div className="space-x-4">
      <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
      <Link to="/submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Submit Feedback
      </Link>
    </div>
  </nav>
);

export default Navbar;
