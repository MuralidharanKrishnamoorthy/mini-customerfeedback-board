import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/feedbackApi';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await login(form);
      const userData = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <input className="border w-full p-2 mb-2" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input type="password" className="border w-full p-2 mb-4" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button onClick={handleLogin} className="bg-blue-600 text-white w-full py-2 rounded">Login</button>
    </div>
  );
};

export default Login;
