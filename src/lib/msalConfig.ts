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
