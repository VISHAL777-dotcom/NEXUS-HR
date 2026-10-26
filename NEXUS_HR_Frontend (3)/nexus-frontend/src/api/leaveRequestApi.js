import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.LeaveRequestController  ->  /api/leave-requests

export const getAllLeaveRequests = () => axiosClient.get('/leave-requests').then((res) => res.data);
export const getLeaveRequestById = (id) => axiosClient.get(`/leave-requests/${id}`).then((res) => res.data);
export const getLeaveRequestsByUser = (userId) =>
  axiosClient.get(`/leave-requests/user/${userId}`).then((res) => res.data);
export const getPendingRequests = () => axiosClient.get('/leave-requests/pending').then((res) => res.data);
export const createLeaveRequest = (userId, payload) =>
  axiosClient.post(`/leave-requests/user/${userId}`, payload).then((res) => res.data);
export const approveLeaveRequest = (id, approverId, comment) =>
  axiosClient
    .patch(`/leave-requests/${id}/approve`, { comment }, { params: { approverId } })
    .then((res) => res.data);
export const rejectLeaveRequest = (id, approverId, comment) =>
  axiosClient
    .patch(`/leave-requests/${id}/reject`, { comment }, { params: { approverId } })
    .then((res) => res.data);
export const deleteLeaveRequest = (id) => axiosClient.delete(`/leave-requests/${id}`).then((res) => res.data);
