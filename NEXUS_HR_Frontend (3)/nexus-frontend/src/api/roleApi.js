import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.RoleController  ->  /api/roles

export const getAllRoles = () => axiosClient.get('/roles').then((res) => res.data);
export const getRoleById = (id) => axiosClient.get(`/roles/${id}`).then((res) => res.data);
export const createRole = (payload) => axiosClient.post('/roles', payload).then((res) => res.data);
export const updateRole = (id, payload) => axiosClient.put(`/roles/${id}`, payload).then((res) => res.data);
export const deleteRole = (id) => axiosClient.delete(`/roles/${id}`).then((res) => res.data);
