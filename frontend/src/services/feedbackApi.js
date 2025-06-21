import axios from 'axios';

const BASE = "http://localhost:5000";

export const login = (data) => axios.post(`${BASE}/auth/login`, data);
export const register = (data) => axios.post(`${BASE}/auth/register`, data);

export const getFeedbacks = (params) => axios.get(`${BASE}/feedbacks`, { params });
export const getFeedbackById = (id) => axios.get(`${BASE}/feedbacks/${id}`);
export const postFeedback = (data) => axios.post(`${BASE}/feedbacks`, data);
export const upvoteFeedback = (id) => axios.patch(`${BASE}/feedbacks/${id}/upvote`);
export const updateStatus = (id, status) => axios.patch(`${BASE}/feedbacks/${id}/status`, { status });
export const postComment = (id, comment) => axios.post(`${BASE}/feedbacks/${id}/comment`, comment);
export const deleteFeedback = (id) => axios.delete(`${BASE}/feedbacks/${id}`);
