// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import FeedbackCard from '../components/FeedbackCard';
import { getFeedbacks, upvoteFeedback } from '../services/feedbackApi';
import Navbar from '../components/Navbar';

const Home = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    const res = await getFeedbacks();
    setFeedbacks(res.data);
    setLoading(false);
  };

  const handleUpvote = async (id) => {
    await upvoteFeedback(id);
    fetchFeedbacks();
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Mini Feedback Board 👋</h2>
        <p className="mb-6 text-gray-600">Share ideas, report bugs, and upvote suggestions.</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          feedbacks.map((fb) => (
            <FeedbackCard key={fb._id} feedback={fb} onUpvote={handleUpvote} />
          ))
        )}
      </div>
    </>
  );
};

export default Home;
