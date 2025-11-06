import axios from '../utils/axios';
import { API_ENDPOINTS } from '../utils/constants';

export const getInbox = async () => {
  const response = await axios.get(API_ENDPOINTS.MAIL);
  return response.data;
};

export const getSent = async () => {
  const response = await axios.get(API_ENDPOINTS.MAIL_SENT);
  console.log('getSent response:', response.data);
  return response.data;
};

export const getDrafts = async () => {
  const response = await axios.get(API_ENDPOINTS.MAIL_DRAFTS);
  return response.data;
};

export const getMailById = async (id) => {
  const response = await axios.get(API_ENDPOINTS.MAIL_GET(id));
  return response.data;
};

export const compose = async (mailData) => {
  const response = await axios.post(API_ENDPOINTS.MAIL_COMPOSE, mailData);
  return response.data;
};

export const composeMail = async (mailData) => {
  const response = await axios.post(API_ENDPOINTS.MAIL_COMPOSE, mailData);
  return response.data;
};

export const deleteMail = async (id) => {
  const response = await axios.delete(API_ENDPOINTS.MAIL_DELETE(id));
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await axios.patch(API_ENDPOINTS.MAIL_READ(id));
  return response.data;
};

export const search = async (query) => {
  const response = await axios.get(API_ENDPOINTS.MAIL_SEARCH(query));
  return response.data;
};

export const searchMails = async (query) => {
  console.log('searchMails called with query:', query);
  console.log('Search endpoint:', API_ENDPOINTS.MAIL_SEARCH(query));
  const response = await axios.get(API_ENDPOINTS.MAIL_SEARCH(query));
  console.log('searchMails response:', response.data);
  return response.data;
};

