import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.PayrollController  ->  /api/payroll

export const getAllPayroll = () => axiosClient.get('/payroll').then((res) => res.data);
export const getPayrollById = (id) => axiosClient.get(`/payroll/${id}`).then((res) => res.data);
export const getPayrollByUser = (userId) => axiosClient.get(`/payroll/user/${userId}`).then((res) => res.data);
export const generatePayroll = (userId, payload) =>
  axiosClient.post(`/payroll/user/${userId}`, payload).then((res) => res.data);
export const markAsPaid = (id) => axiosClient.patch(`/payroll/${id}/mark-paid`).then((res) => res.data);
export const deletePayroll = (id) => axiosClient.delete(`/payroll/${id}`).then((res) => res.data);
