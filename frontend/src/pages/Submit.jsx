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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.userId) {
      alert("You must be logged in to submit feedback.");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await postFeedback({ ...formData, userId: user.userId });
      navigate('/');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'Feature', label: '✨ Feature Request', description: 'Suggest a new feature or enhancement' },
    { value: 'Bug', label: '🐛 Bug Report', description: 'Report a problem or issue you encountered' },
    { value: 'UI', label: '🎨 UI/UX Improvement', description: 'Suggest improvements to user interface' },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Feedback</h1>
            <p className="text-gray-600">
              Share your ideas, report bugs, or suggest improvements to help us make the product better.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  What type of feedback is this? *
                </label>
                <div className="grid gap-3">
                  {categoryOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                        relative flex cursor-pointer rounded-lg border p-4 transition-all
                        ${formData.category === option.value 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={option.value}
                        checked={formData.category === option.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-lg font-medium text-gray-900">
                            {option.label}
                          </span>
                          {formData.category === option.value && (
                            <svg className="ml-auto h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  placeholder="Give your feedback a clear, descriptive title..."
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 transition-colors"
                  onChange={handleChange}
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  placeholder="Provide details about your feedback. Include steps to reproduce for bugs, or explain the value of your feature request..."
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 transition-colors resize-vertical"
                  onChange={handleChange}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                  className={`
                    px-6 py-2 text-sm font-medium rounded-lg transition-all
                    ${isSubmitting || !formData.title.trim() || !formData.description.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-sm font-medium text-blue-900 mb-3">💡 Tips for great feedback</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific and descriptive in your title</li>
              <li>• Include steps to reproduce for bugs</li>
              <li>• Explain the impact or value of feature requests</li>
              <li>• Check if similar feedback already exists</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Submit;