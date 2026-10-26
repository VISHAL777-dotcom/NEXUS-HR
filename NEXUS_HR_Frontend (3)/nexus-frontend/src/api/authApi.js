import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.AuthController

export const login = (email, password) =>
  axiosClient.post('/auth/login', { email, password }).then((res) => res.data);

export const register = (payload) =>
  axiosClient.post('/auth/register', payload).then((res) => res.data);
