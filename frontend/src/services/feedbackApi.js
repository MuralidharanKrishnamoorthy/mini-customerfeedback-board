import axios from 'axios';

//const API_URL = 'http://localhost:5000/api'; 
const API_URL = import.meta.env.VITE_API_BASE_URL;


const API = axios.create({ baseURL: API_URL });

API.interceptors.request.use((req) => {
    const user = localStorage.getItem('user');
    console.log('API Request - User from localStorage:', user);
    if (user) {
      const userData = JSON.parse(user);
      console.log('API Request - User data:', userData);
      console.log('API Request - Token:', userData.token);
      
      if (!userData.token) {
        console.log('API Request - No token found, clearing invalid user data');
        localStorage.removeItem('user');
        // Don't set Authorization header if no token
      } else {
        req.headers.Authorization = `Bearer ${userData.token}`;
      }
    } else {
      console.log('API Request - No user found in localStorage');
    }
    console.log('API Request - Final headers:', req.headers);
    return req;
});

// Add response interceptor to handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log('API Response - 401 Unauthorized, clearing user data');
      localStorage.removeItem('user');
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Feedback
export const getFeedbacks = (params) => API.get('/feedback', { params });
export const getFeedbackById = (id) => API.get(`/feedback/${id}`);
export const createFeedback = (feedbackData) => API.post('/feedback', feedbackData);
export const upvoteFeedback = (id) => API.post(`/feedback/${id}/upvote`);
export const updateFeedbackStatus = (id, status) => API.put(`/feedback/${id}/status`, { status });
export const addReplyToFeedback = (id, reply) => API.post(`/feedback/${id}/reply`, { reply });
export const addComment = (id, commentData) => API.post(`/feedback/${id}/comments`, commentData);
export const addReplyToComment = (feedbackId, commentId, replyData) => API.post(`/feedback/${feedbackId}/comments/${commentId}/reply`, replyData);
export const deleteFeedback = (id) => API.delete(`/feedback/${id}`);

// Auth
export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);