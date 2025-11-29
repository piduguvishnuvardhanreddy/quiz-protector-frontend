// Always use the deployed backend URL
const API_BASE = 'https://quiz-protector.onrender.com/api';

const getToken = () => {
  return localStorage.getItem('token') || null;
};

export async function apiFetch(path, { method = 'GET', body, headers = {}, auth = true } = {}) {
  const init = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include', // allow httpOnly cookies if present
  };
  if (body !== undefined) init.body = JSON.stringify(body);
  if (auth) {
    const token = getToken();
    if (token) init.headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, init);
    
    if (!res.ok) {
      let errorMessage = `Request failed: ${res.status}`;
      try {
        const data = await res.json();
        errorMessage = data?.message || data?.error || errorMessage;
      } catch (e) {
        // JSON parsing failed, use default error
      }
      throw new Error(errorMessage);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    // Network error or other fetch errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    throw error;
  }
}
