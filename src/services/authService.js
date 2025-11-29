import { apiFetch } from './api';

export async function register({ name, email, password, role, adminCode }) {
  const endpoint = role === 'admin' ? '/auth/register/admin' : '/auth/register/student';
  const body = role === 'admin' ? { name, email, password, role, adminCode } : { name, email, password, role };
  const res = await apiFetch(endpoint, {
    method: 'POST',
    body,
    auth: false,
  });
  return { token: res.token, user: res.data };
}

export async function login(email, password) {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  return { token: res.token, user: res.data };
}

export async function getCurrentUser() {
  const res = await apiFetch('/auth/me', { method: 'GET' });
  return res.data;
}

export async function logout() {
  await apiFetch('/auth/logout', { method: 'GET' });
}
