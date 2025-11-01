/**
 * Development environment configuration
 * This file is copied to aws-exports.ts during build
 */

export const awsConfig = {
  // API Configuration
  apiUrl: 'https://dev-api.submanagementgroup.com/dev', // TODO: Update after API Gateway deployment

  // Azure Entra External ID Configuration
  entra: {
    tenantId: 'YOUR_ENTRA_TENANT_ID',
    tenantName: 'yourcompany.ciamlogin.com',
    clientId: 'YOUR_ENTRA_CLIENT_ID',
    redirectUri: 'https://mail.dev.submanagementgroup.com/auth/callback',
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  },

  // Application Configuration
  app: {
    name: 'Email MFA Platform',
    environment: 'development',
    domain: 'mail.dev.submanagementgroup.com',
    mailboxDomain: 'funding.dev.submanagementgroup.com',
  },
};

export default awsConfig;
