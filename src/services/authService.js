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
  console.log('requestOTP called with email:', email);
  console.log('OTP endpoint:', API_ENDPOINTS.REQUEST_OTP);
  try {
    const response = await axios.post(API_ENDPOINTS.REQUEST_OTP, { email });
    console.log('requestOTP success response:', response.data);
    return response.data;
  } catch (error) {
    console.log('requestOTP error response:', error.response);
    console.log('requestOTP error data:', error.response?.data);
    throw error;
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  console.log('resetPassword called with:', { email, otp, newPassword: '***' });
  console.log('Reset password endpoint:', API_ENDPOINTS.RESET_PASSWORD);
  try {
    const response = await axios.put(API_ENDPOINTS.RESET_PASSWORD, {
      email,
      otp,
      newPassword,
    });
    console.log('resetPassword success response:', response.data);
    return response.data;
  } catch (error) {
    console.log('resetPassword error response:', error.response);
    console.log('resetPassword error data:', error.response?.data);
    throw error;
  }
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

