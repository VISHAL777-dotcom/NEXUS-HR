import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.AttendanceController  ->  /api/attendance

export const getAllAttendance = () => axiosClient.get('/attendance').then((res) => res.data);
export const getAttendanceById = (id) => axiosClient.get(`/attendance/${id}`).then((res) => res.data);
export const getAttendanceByUser = (userId) =>
  axiosClient.get(`/attendance/user/${userId}`).then((res) => res.data);
export const getAttendanceByRange = (userId, start, end) =>
  axiosClient.get(`/attendance/user/${userId}/range`, { params: { start, end } }).then((res) => res.data);
export const clockIn = (userId, location) =>
  axiosClient.post(`/attendance/user/${userId}/clock-in`, { location }).then((res) => res.data);
export const clockOut = (userId) =>
  axiosClient.post(`/attendance/user/${userId}/clock-out`).then((res) => res.data);
export const deleteAttendance = (id) => axiosClient.delete(`/attendance/${id}`).then((res) => res.data);
