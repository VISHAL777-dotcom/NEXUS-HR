import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.AuditLogController  ->  /api/audit-logs

export const getAllLogs = () => axiosClient.get('/audit-logs').then((res) => res.data);
export const getLogsByEntity = (entityName) =>
  axiosClient.get(`/audit-logs/entity/${entityName}`).then((res) => res.data);
export const getLogsByUser = (userId) => axiosClient.get(`/audit-logs/user/${userId}`).then((res) => res.data);
