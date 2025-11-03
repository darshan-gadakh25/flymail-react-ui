import axios from '../utils/axios';
import { API_ENDPOINTS } from '../utils/constants';

export const register = async (userData) => {
  const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(API_ENDPOINTS.SIGNIN, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const requestOTP = async (email) => {
  const response = await axios.post(API_ENDPOINTS.REQUEST_OTP, { email });
  return response.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const response = await axios.put(API_ENDPOINTS.RESET_PASSWORD, {
    email,
    otp,
    newPassword,
  });
  return response.data;
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

