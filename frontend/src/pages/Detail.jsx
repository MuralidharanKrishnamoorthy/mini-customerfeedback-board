// src/pages/Detail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getFeedbackById,
  upvoteFeedback,
  updateStatus,
  postComment,
} from '../services/feedbackApi';
import Navbar from '../components/Navbar';

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  const statusColors = {
    Open: "bg-orange-50 text-orange-700 border-orange-200",
    Planned: "bg-blue-50 text-blue-700 border-blue-200",
    'In Progress': "bg-purple-50 text-purple-700 border-purple-200",
    Done: "bg-green-50 text-green-700 border-green-200",
  };

  const categoryColors = {
    Bug: "bg-red-50 text-red-600 border-red-200",
    Feature: "bg-indigo-50 text-indigo-600 border-indigo-200",
    UI: "bg-pink-50 text-pink-600 border-pink-200",
  };

  const statusIcons = {
    Open: "🔵",
    Planned: "📋",
    'In Progress': "⚡",
    Done: "✅",
  };

  const categoryIcons = {
    Bug: "🐛",
    Feature: "✨",
    UI: "🎨",
  };

  const fetchFeedback = async () => {
    try {
      const res = await getFeedbackById(id);
      setFeedback(res.data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    try {
      await upvoteFeedback(id);
      fetchFeedback();
    } catch (error) {
      console.error('Error upvoting feedback:', error);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      await updateStatus(id, e.target.value);
      fetchFeedback();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user || !user.userId) {
      alert("Login required to comment.");
      return;
    }
    if (!comment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    setIsSubmittingComment(true);
    try {
      await postComment(id, {
        userId: user.userId,
        text: comment.trim(),
        author: user.username,
      });
      setComment("");
      fetchFeedback();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading feedback...</span>
          </div>
        </div>
      </>
    );
  }

  if (!feedback) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Feedback not found</h2>
            <p className="text-gray-600 mb-4">The feedback you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const statusClass = statusColors[feedback.status] || "bg-gray-50 text-gray-700 border-gray-200";
  const categoryClass = categoryColors[feedback.category] || "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to feedback
          </button>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${categoryClass}`}>
                      <span className="text-sm">{categoryIcons[feedback.category]}</span>
                      {feedback.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${statusClass}`}>
                      <span className="text-sm">{statusIcons[feedback.status]}</span>
                      {feedback.status}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    {feedback.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span>ID: #{feedback._id.slice(-6)}</span>
                    <span>•</span>
                    <span>{new Date(feedback.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Upvote Button */}
                <div className="ml-6">
                  <button
                    onClick={handleUpvote}
                    className="flex flex-col items-center justify-center min-w-[64px] px-4 py-3 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 hover:shadow-sm group"
                  >
                    <svg className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                      {feedback.upvotes}
                    </span>
                  </button>
                </div>
              </div>

              {/* Admin Status Control */}
              {user?.role === "admin" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <label className="text-sm font-medium text-blue-900">Admin: Update Status</label>
                    <select
                      value={feedback.status}
                      onChange={handleStatusChange}
                      className="border border-blue-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Planned">Planned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {feedback.description}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Comments ({feedback.comments?.length || 0})
                </h2>
              </div>

              {/* Comments List */}
              <div className="space-y-4 mb-8">
                {feedback.comments?.length > 0 ? (
                  feedback.comments.map((c, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-600">
                            {c.author?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{c.author}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-11 whitespace-pre-wrap">{c.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Add Comment Form */}
              {user ? (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">
                        {user.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-gray-500">
                          Commenting as {user.username}
                        </p>
                        <button
                          onClick={handleCommentSubmit}
                          disabled={isSubmittingComment || !comment.trim()}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium transition-all
                            ${isSubmittingComment || !comment.trim()
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }
                          `}
                        >
                          {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-6 text-center">
                  <p className="text-gray-600 mb-4">Sign in to join the conversation</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Detail;