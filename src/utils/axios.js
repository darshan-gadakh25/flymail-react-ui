import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we have a token (authenticated user)
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      // Token expired or invalid for authenticated user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    
    // Enhance error messages for better UX
    if (error.response?.data) {
      const errorData = error.response.data;
      if (typeof errorData === 'string') {
        error.message = errorData;
      } else if (errorData.message) {
        error.message = errorData.message;
      } else if (errorData.error) {
        error.message = errorData.error;
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;

