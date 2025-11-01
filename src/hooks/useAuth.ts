import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../lib/msalConfig';

/**
 * Authentication hook
 */
export function useAuth() {
  const { instance, accounts } = useMsal();
  let isAuthenticated = useIsAuthenticated();

  // Check for dev mode authentication bypass
  const devToken = sessionStorage.getItem('msal.dev-token');
  const devAccount = sessionStorage.getItem('msal.account.dev-account-id');

  // Check for local login (email/password) authentication
  const localToken = sessionStorage.getItem('local-access-token');
  const localUser = sessionStorage.getItem('local-user');

  let user = accounts[0];
  let roles: string[] = [];

  if (devToken && devAccount) {
    // Dev mode: Use mock account
    const mockAccount = JSON.parse(devAccount);
    user = mockAccount;
    roles = mockAccount.idTokenClaims?.roles || ['SYSTEM_ADMIN'];
    isAuthenticated = true;
  } else if (localToken && localUser) {
    // Local auth: Use stored user from login response
    const userData = JSON.parse(localUser);
    user = {
      username: userData.email,
      name: userData.name,
      localAccountId: userData.id?.toString(),
      idTokenClaims: {
        email: userData.email,
        name: userData.name,
        roles: [userData.role], // Single role from backend
      },
    } as any;
    roles = [userData.role];
    isAuthenticated = true;
  } else {
    // Normal MSAL flow
    roles = (user?.idTokenClaims as any)?.roles || [];
  }

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    // Clear all auth tokens
    sessionStorage.removeItem('msal.dev-token');
    sessionStorage.removeItem('msal.account.dev-account-id');
    sessionStorage.removeItem('msal.token.keys');
    sessionStorage.removeItem('local-access-token');
    sessionStorage.removeItem('local-refresh-token');
    sessionStorage.removeItem('local-user');

    // If using MSAL, logout via MSAL
    if (accounts.length > 0) {
      instance.logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      });
    } else {
      // For local auth, just reload the page
      window.location.href = '/';
    }
  };

  const isAdmin = roles.includes('SYSTEM_ADMIN');
  const isTeamMember = roles.includes('TEAM_MEMBER') || roles.includes('SYSTEM_ADMIN');
  const isClient = roles.includes('CLIENT_USER');

  return {
    isAuthenticated,
    user,
    roles,
    login,
    logout,
    isAdmin,
    isTeamMember,
    isClient,
  };
}
