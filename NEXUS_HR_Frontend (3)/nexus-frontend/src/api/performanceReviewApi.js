import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.PerformanceReviewController  ->  /api/performance-reviews

export const getAllReviews = () => axiosClient.get('/performance-reviews').then((res) => res.data);
export const getReviewById = (id) => axiosClient.get(`/performance-reviews/${id}`).then((res) => res.data);
export const getReviewsByUser = (userId) =>
  axiosClient.get(`/performance-reviews/user/${userId}`).then((res) => res.data);
export const createReview = (userId, reviewerId, payload) =>
  axiosClient
    .post(`/performance-reviews/user/${userId}`, payload, { params: { reviewerId } })
    .then((res) => res.data);
export const finalizeReview = (id) =>
  axiosClient.patch(`/performance-reviews/${id}/finalize`).then((res) => res.data);
export const deleteReview = (id) => axiosClient.delete(`/performance-reviews/${id}`).then((res) => res.data);
