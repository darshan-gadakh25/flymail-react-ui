export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/users/register',
  SIGNIN: '/users/signin',
  REQUEST_OTP: '/users/otp',
  RESET_PASSWORD: '/users/reset-password',
  
  // Mail
  MAIL: '/mail',
  MAIL_SENT: '/mail/sent',
  MAIL_DRAFTS: '/mail/drafts',
  MAIL_COMPOSE: '/mail/compose',
  MAIL_READ: (id) => `/mail/${id}/read`,
  MAIL_DELETE: (id) => `/mail/${id}`,
  MAIL_GET: (id) => `/mail/${id}`,
  MAIL_SEARCH: (query) => `/mail/search?q=${query}`,
  
  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_TOGGLE_USER: (id) => `/admin/users/${id}/toggle-active`,
  ADMIN_USER_MAIL: (id) => `/admin/users/${id}/mail`,
  ADMIN_DELETE_USER: (id) => `/admin/user/${id}`,
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const MAIL_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  DRAFT: 'draft',
  SENT: 'sent',
};

