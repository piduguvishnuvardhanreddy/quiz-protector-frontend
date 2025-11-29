import { apiFetch } from './api';

export async function startAttempt({ quizId, name, email }) {
  const res = await apiFetch('/attempts/start', {
    method: 'POST',
    body: { quizId, name, email },
    auth: false,
  });
  return res.data;
}

export async function submitAnswers(attemptId, answers) {
  const res = await apiFetch(`/attempts/${attemptId}/answers`, {
    method: 'POST',
    body: { answers },
    auth: false,
  });
  return res.data;
}

export async function recordTabSwitch(attemptId) {
  const res = await apiFetch(`/attempts/${attemptId}/tabswitch`, {
    method: 'PATCH',
    auth: false,
  });
  return res;
}

export async function submitFeedback(attemptId, feedback) {
  const res = await apiFetch(`/attempts/${attemptId}/feedback`, {
    method: 'POST',
    body: { feedback },
    auth: false,
  });
  return res.data;
}

export async function getAttempt(attemptId) {
  const res = await apiFetch(`/attempts/${attemptId}`, { 
    method: 'GET',
    auth: false,
  });
  return res.data;
}
