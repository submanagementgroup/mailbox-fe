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

  let user = accounts[0];
  let roles: string[] = [];

  if (devToken && devAccount) {
    // Dev mode: Use mock account
    const mockAccount = JSON.parse(devAccount);
    user = mockAccount;
    roles = mockAccount.idTokenClaims?.roles || ['SYSTEM_ADMIN'];
    isAuthenticated = true;
  } else {
    // Normal MSAL flow
    roles = (user?.idTokenClaims as any)?.roles || [];
  }

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = () => {
    // Clear dev mode tokens if present
    sessionStorage.removeItem('msal.dev-token');
    sessionStorage.removeItem('msal.account.dev-account-id');
    sessionStorage.removeItem('msal.token.keys');

    // Normal MSAL logout
    instance.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
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
