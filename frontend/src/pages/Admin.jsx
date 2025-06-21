import React, { useEffect, useState } from 'react';
import { getFeedbacks, updateStatus, deleteFeedback } from '../services/feedbackApi';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  const fetchFeedbacks = async () => {
    const res = await getFeedbacks();
    setFeedbacks(res.data);
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    fetchFeedbacks();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      await deleteFeedback(id);
      fetchFeedbacks();
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    } else {
      fetchFeedbacks();
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      {feedbacks.map(fb => (
        <div key={fb._id} className="bg-gray-100 p-4 mb-4 rounded shadow-sm">
          <h3 className="font-semibold text-lg">{fb.title}</h3>
          <p className="text-sm text-gray-700 mb-2">{fb.description}</p>
          <div className="flex items-center gap-3">
            <select
              value={fb.status}
              onChange={(e) => handleStatusChange(fb._id, e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option>Open</option>
              <option>Planned</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <button
              className="text-red-500 ml-auto hover:underline"
              onClick={() => handleDelete(fb._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;
