import { Configuration, PublicClientApplication } from '@azure/msal-browser';
import awsConfig from '../aws-exports';

/**
 * MSAL configuration for Azure Entra External ID
 */

export const msalConfig: Configuration = {
  auth: {
    clientId: awsConfig.entra.clientId,
    authority: `https://${awsConfig.entra.tenantName}/${awsConfig.entra.tenantId}`,
    redirectUri: awsConfig.entra.redirectUri,
    postLogoutRedirectUri: `https://${awsConfig.app.domain}`,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: awsConfig.app.environment === 'development' ? 3 : 0,
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case 0: console.error(message); return;
          case 1: console.warn(message); return;
          case 2: console.info(message); return;
          case 3: console.debug(message); return;
        }
      },
    },
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: awsConfig.entra.scopes,
};

/**
 * Check if Azure Entra is actually configured (not using placeholder values)
 * @returns true if Entra is configured with real credentials, false if using placeholders
 */
export function isEntraConfigured(): boolean {
  const placeholders = [
    'YOUR_ENTRA_TENANT_ID',
    'YOUR_ENTRA_CLIENT_ID',
    'yourcompany.ciamlogin.com',
    'YOUR_',
  ];

  // Check if any config value contains placeholder text
  const hasPlaceholder =
    placeholders.some(placeholder =>
      awsConfig.entra.clientId?.includes(placeholder) ||
      awsConfig.entra.tenantId?.includes(placeholder) ||
      awsConfig.entra.tenantName?.includes(placeholder)
    );

  // Also check if values are empty or undefined
  const hasEmptyValues =
    !awsConfig.entra.clientId ||
    !awsConfig.entra.tenantId ||
    !awsConfig.entra.tenantName;

  return !hasPlaceholder && !hasEmptyValues;
}
