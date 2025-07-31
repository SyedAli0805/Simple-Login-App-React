import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiry or unauthorized access
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      const message = response.data?.message || '';
      if (message.includes('Token has expired') || message.includes('Unauthenticated')) {
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
