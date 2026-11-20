import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the JWT to every request when the user is logged in
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('userInfo');
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore broken storage */
    }
  }
  return config;
});

// Turns an Axios error into a readable message
export const getError = (err) =>
  err.response?.data?.message || err.message || 'Something went wrong';

export default api;
