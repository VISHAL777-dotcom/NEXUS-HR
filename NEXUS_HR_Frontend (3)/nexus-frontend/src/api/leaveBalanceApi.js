import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.LeaveBalanceController  ->  /api/leave-balances

export const getBalancesByUserAndYear = (userId, year) =>
  axiosClient.get(`/leave-balances/user/${userId}/year/${year}`).then((res) => res.data);
export const getBalanceById = (id) => axiosClient.get(`/leave-balances/${id}`).then((res) => res.data);
export const createBalance = (userId, payload) =>
  axiosClient.post(`/leave-balances/user/${userId}`, payload).then((res) => res.data);
export const updateBalance = (id, payload) =>
  axiosClient.put(`/leave-balances/${id}`, payload).then((res) => res.data);
export const deleteBalance = (id) => axiosClient.delete(`/leave-balances/${id}`).then((res) => res.data);
