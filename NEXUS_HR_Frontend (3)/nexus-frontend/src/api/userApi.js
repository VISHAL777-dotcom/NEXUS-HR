import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.UserController  ->  /api/users

export const getAllUsers = () => axiosClient.get('/users').then((res) => res.data);
export const getUserById = (id) => axiosClient.get(`/users/${id}`).then((res) => res.data);
export const getUsersByDepartment = (departmentId) =>
  axiosClient.get(`/users/department/${departmentId}`).then((res) => res.data);
export const createUser = (payload) => axiosClient.post('/users', payload).then((res) => res.data);
export const updateUser = (id, payload) => axiosClient.put(`/users/${id}`, payload).then((res) => res.data);
export const deleteUser = (id) => axiosClient.delete(`/users/${id}`).then((res) => res.data);
