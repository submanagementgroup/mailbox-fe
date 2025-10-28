import axios, { AxiosInstance } from 'axios';
import { msalInstance, loginRequest } from './msalConfig';
import awsConfig from '../aws-exports';

/**
 * API client with automatic token injection
 */

const apiClient: AxiosInstance = axios.create({
  baseURL: awsConfig.apiUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  async (config) => {
    const accounts = msalInstance.getAllAccounts();

    if (accounts.length > 0) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        });

        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error('Token acquisition failed:', error);
        // Redirect to login if token acquisition fails
        await msalInstance.loginRedirect(loginRequest);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect to login
      await msalInstance.loginRedirect(loginRequest);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// ============================================
// API Functions
// ============================================

export const mailboxApi = {
  // Mailboxes
  getMailboxes: () => apiClient.get('/mailboxes'),

  // Messages
  getMessages: (mailboxId: number, params?: any) =>
    apiClient.get(`/mailboxes/${mailboxId}/messages`, { params }),

  getMessage: (mailboxId: number, messageId: number) =>
    apiClient.get(`/mailboxes/${mailboxId}/messages/${messageId}`),

  replyToMessage: (mailboxId: number, messageId: number, body: { body: string; subject?: string }) =>
    apiClient.post(`/mailboxes/${mailboxId}/messages/${messageId}/reply`, body),

  // Forwarding Rules
  getForwardingRules: (mailboxId: number) =>
    apiClient.get(`/mailboxes/${mailboxId}/forwarding`),

  createForwardingRule: (mailboxId: number, data: { recipientEmail: string; isEnabled?: boolean }) =>
    apiClient.post(`/mailboxes/${mailboxId}/forwarding`, data),

  updateForwardingRule: (mailboxId: number, ruleId: number, data: any) =>
    apiClient.put(`/mailboxes/${mailboxId}/forwarding/${ruleId}`, data),

  deleteForwardingRule: (mailboxId: number, ruleId: number) =>
    apiClient.delete(`/mailboxes/${mailboxId}/forwarding/${ruleId}`),
};

export const adminApi = {
  // Users
  getUsers: () => apiClient.get('/admin/users'),

  createUser: (data: { email: string; displayName: string; role: string }) =>
    apiClient.post('/admin/users', data),

  deleteUser: (userId: string) => apiClient.delete(`/admin/users/${userId}`),

  resetPassword: (userId: string) => apiClient.post(`/admin/users/${userId}/reset-password`),

  // Mailboxes (admin)
  getAllMailboxes: () => apiClient.get('/admin/mailboxes'),

  createMailbox: (data: { emailAddress: string; quotaMb?: number }) =>
    apiClient.post('/admin/mailboxes', data),

  assignMailbox: (mailboxId: number, userId: string) =>
    apiClient.post(`/admin/mailboxes/${mailboxId}/assign`, { userId }),

  // Whitelist
  getWhitelistedSenders: () => apiClient.get('/admin/whitelist/senders'),

  addWhitelistedSender: (domain: string) =>
    apiClient.post('/admin/whitelist/senders', { domain }),

  removeWhitelistedSender: (domain: string) =>
    apiClient.delete(`/admin/whitelist/senders/${domain}`),

  getWhitelistedRecipients: () => apiClient.get('/admin/whitelist/recipients'),

  addWhitelistedRecipient: (email: string) =>
    apiClient.post('/admin/whitelist/recipients', { email }),

  // Audit Log
  getAuditLog: (params?: any) => apiClient.get('/admin/audit-log', { params }),
};
