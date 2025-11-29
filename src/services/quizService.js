import { apiFetch } from './api';

export async function createQuiz(payload) {
  const res = await apiFetch('/quizzes', { method: 'POST', body: payload });
  return res.data;
}

export async function listQuizzes() {
  const res = await apiFetch('/quizzes', { method: 'GET' });
  return res.data;
}

export async function getQuiz(id) {
  const res = await apiFetch(`/quizzes/${id}`, { method: 'GET' });
  return res.data;
}

export async function getQuizForTaking(id) {
  const res = await apiFetch(`/quizzes/take/${id}`, { method: 'GET', auth: false });
  return res.data;
}

export async function getQuizBySlug(slug) {
  const res = await apiFetch(`/quizzes/slug/${slug}`, { method: 'GET', auth: false });
  return res.data;
}

export async function updateQuiz(id, payload) {
  const res = await apiFetch(`/quizzes/${id}`, { method: 'PUT', body: payload });
  return res.data;
}

export async function deleteQuiz(id) {
  const res = await apiFetch(`/quizzes/${id}`, { method: 'DELETE' });
  return res.data;
}

export async function listQuizAttempts(quizId) {
  const res = await apiFetch(`/attempts/quizzes/${quizId}/attempts`, { method: 'GET' });
  return res.data;
}

export async function getMyAttempts() {
  const res = await apiFetch('/attempts/my-attempts', { method: 'GET' });
  return res.data;
}
