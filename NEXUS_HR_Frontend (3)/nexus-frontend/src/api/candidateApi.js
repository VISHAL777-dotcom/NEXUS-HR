import axiosClient from './axiosClient';

// Maps to: com.example.demo.controller.CandidateController  ->  /api/candidates

export const getAllCandidates = () => axiosClient.get('/candidates').then((res) => res.data);
export const getCandidateById = (id) => axiosClient.get(`/candidates/${id}`).then((res) => res.data);
export const getCandidatesByStage = (stage) =>
  axiosClient.get(`/candidates/stage/${stage}`).then((res) => res.data);
export const createCandidate = (payload) => axiosClient.post('/candidates', payload).then((res) => res.data);
export const moveStage = (id, stage) =>
  axiosClient.patch(`/candidates/${id}/stage`, { stage }).then((res) => res.data);
export const updateAiScore = (id, score) =>
  axiosClient.patch(`/candidates/${id}/ai-score`, { score }).then((res) => res.data);
export const deleteCandidate = (id) => axiosClient.delete(`/candidates/${id}`).then((res) => res.data);
