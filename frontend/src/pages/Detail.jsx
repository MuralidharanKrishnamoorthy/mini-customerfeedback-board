// src/pages/Detail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFeedbackById, upvoteFeedback } from '../services/feedbackApi';
import Navbar from '../components/Navbar';

const Detail = () => {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);

  const fetchData = async () => {
    const res = await getFeedbackById(id);
    setFeedback(res.data);
  };

  const handleUpvote = async () => {
    await upvoteFeedback(id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!feedback) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4 mt-10">
        <h1 className="text-2xl font-bold">{feedback.title}</h1>
        <p className="text-gray-600 mt-2">{feedback.description}</p>
        <div className="mt-4 flex gap-3 items-center">
          <span className="bg-gray-100 px-2 py-1 rounded">{feedback.category}</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{feedback.status}</span>
          <button
            className="bg-gray-200 px-3 py-1 rounded hover:bg-blue-500 hover:text-white"
            onClick={handleUpvote}
          >
            🔼 {feedback.upvotes}
          </button>
        </div>
      </div>
    </>
  );
};

export default Detail;
