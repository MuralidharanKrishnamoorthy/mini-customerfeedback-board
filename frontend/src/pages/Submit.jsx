// src/pages/Submit.jsx
import React, { useState } from 'react';
import { postFeedback } from '../services/feedbackApi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Submit = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Feature',
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill all required fields.');
      return;
    }
    await postFeedback(formData);
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto mt-10 px-4">
        <h2 className="text-xl font-bold mb-4">Submit New Feedback</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="w-full border p-2 rounded"
            onChange={handleChange}
          />
          <select
            name="category"
            className="w-full border p-2 rounded"
            onChange={handleChange}
            value={formData.category}
          >
            <option value="Feature">Feature</option>
            <option value="Bug">Bug</option>
            <option value="UI">UI</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Submit;
