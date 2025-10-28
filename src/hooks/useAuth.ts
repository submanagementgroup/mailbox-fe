import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../lib/msalConfig';

/**
 * Authentication hook
 */
export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const user = accounts[0];
  const roles = (user?.idTokenClaims as any)?.roles || [];

  const login = () => {
    instance.loginRedirect(loginRequest);
  };

  const logout = () => {
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
