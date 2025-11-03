import axios from '../utils/axios';
import { API_ENDPOINTS } from '../utils/constants';

export const listUsers = async () => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_USERS);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_USERS);
  return response.data;
};

export const toggleActive = async (userId) => {
  const response = await axios.patch(API_ENDPOINTS.ADMIN_TOGGLE_USER(userId));
  return response.data;
};

export const toggleUserActive = async (userId) => {
  const response = await axios.patch(API_ENDPOINTS.ADMIN_TOGGLE_USER(userId));
  return response.data;
};

export const viewUserMail = async (userId) => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_USER_MAIL(userId));
  return response.data;
};

export const getUserMails = async (userId) => {
  const response = await axios.get(API_ENDPOINTS.ADMIN_USER_MAIL(userId));
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(API_ENDPOINTS.ADMIN_DELETE_USER(userId));
  return response.data;
};

