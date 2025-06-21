// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import FeedbackCard from '../components/FeedbackCard';
import { getFeedbacks, upvoteFeedback } from '../services/feedbackApi';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';

const Home = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("latest");
  const [search, setSearch] = useState("");

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = {
        status: statusFilter,
        category: categoryFilter,
        sort,
        search,
      };
      const res = await getFeedbacks(params);
      setFeedbacks(res.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await upvoteFeedback(id);
      fetchFeedbacks();
    } catch (error) {
      console.error('Error upvoting feedback:', error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [statusFilter, categoryFilter, sort, search]);

  const getStatusStats = () => {
    const stats = {
      total: feedbacks.length,
      open: feedbacks.filter(f => f.status === 'Open').length,
      planned: feedbacks.filter(f => f.status === 'Planned').length,
      inProgress: feedbacks.filter(f => f.status === 'In Progress').length,
      done: feedbacks.filter(f => f.status === 'Done').length,
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Product Feedback Board
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Help us improve our product by sharing your feedback, suggestions, and bug reports. 
                Your voice matters in shaping the future of our platform.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
                <div className="text-sm text-gray-600">Open</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.planned}</div>
                <div className="text-sm text-gray-600">Planned</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.done}</div>
                <div className="text-sm text-gray-600">Done</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            setStatusFilter={setStatusFilter}
            setCategoryFilter={setCategoryFilter}
            setSort={setSort}
            setSearch={setSearch}
          />

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-600">Loading feedback...</span>
              </div>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-600 mb-4">
                {search || statusFilter || categoryFilter 
                  ? "Try adjusting your filters to see more results." 
                  : "Be the first to share your feedback!"
                }
              </p>
              {!search && !statusFilter && !categoryFilter && (
                <a
                  href="/submit"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add First Feedback
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((fb) => (
                <FeedbackCard key={fb._id} feedback={fb} onUpvote={handleUpvote} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;