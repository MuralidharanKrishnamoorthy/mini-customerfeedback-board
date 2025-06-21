// src/services/feedbackApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/feedbacks';

export const getFeedbacks = () => axios.get(BASE_URL);
export const getFeedbackById = (id) => axios.get(`${BASE_URL}/${id}`);
export const postFeedback = (data) => axios.post(BASE_URL, data);
export const upvoteFeedback = (id) => axios.patch(`${BASE_URL}/${id}/upvote`);
export const updateStatus = (id, status) =>
  axios.patch(`${BASE_URL}/${id}/status`, { status });
