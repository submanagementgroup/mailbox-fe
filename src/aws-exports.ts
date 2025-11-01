/**
 * Local development configuration
 * Copy this file to aws-exports.ts for local development:
 * cp src/aws-exports.local.ts src/aws-exports.ts
 */

export const awsConfig = {
  // API Configuration - Choose one:
  // Option 1: Local Express server (requires mailbox-api/npm run dev)
  apiUrl: 'http://localhost:3001',

  // Option 2: Deployed dev API (simpler, no local backend needed)
  //apiUrl: 'https://lmcl61jrz0.execute-api.ca-central-1.amazonaws.com/dev',

  // Azure Entra External ID Configuration
  entra: {
    tenantId: 'YOUR_ENTRA_TENANT_ID',
    tenantName: 'yourcompany.ciamlogin.com',
    clientId: 'YOUR_ENTRA_CLIENT_ID',
    redirectUri: 'http://localhost:3000/auth/callback', // Local dev
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  },

  // Application Configuration
  app: {
    name: 'Email MFA Platform (Local Dev)',
    environment: 'local',
    domain: 'localhost:3000',
    mailboxDomain: 'funding.dev.submanagementgroup.com',
  },
};

export default awsConfig;
