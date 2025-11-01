import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';
import { DevLogin } from './DevLogin';
import { LocalLogin } from './LocalLogin';
import { isEntraConfigured } from '../../lib/msalConfig';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

/**
 * Authentication guard component
 * - Dev mode (localhost): Shows DevLogin button for quick bypass
 * - Azure not configured: Shows LocalLogin (email/password)
 * - Azure configured: Redirects to SSO
 * Shows forbidden if user doesn't have required role
 */
export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { isAuthenticated, login, roles } = useAuth();
  const [isDevMode] = useState(process.env.NODE_ENV === 'development');
  const [entraConfigured] = useState(isEntraConfigured());

  useEffect(() => {
    // Only auto-redirect to SSO if:
    // 1. Not authenticated
    // 2. Not in dev mode (localhost)
    // 3. Azure Entra is actually configured
    if (!isAuthenticated && !isDevMode && entraConfigured) {
      login();
    }
  }, [isAuthenticated, isDevMode, entraConfigured, login]);

  if (!isAuthenticated) {
    // Dev mode: Show dev login button (localhost only)
    if (isDevMode) {
      return <DevLogin />;
    }

    // Azure Entra not configured: Show local email/password login
    if (!entraConfigured) {
      return <LocalLogin />;
    }

    // Azure Entra configured: Show loading while redirecting to SSO
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Redirecting to SSO login...
        </Typography>
      </Box>
    );
  }

  // Check role requirement
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => roles.includes(role));

    if (!hasRequiredRole) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="100vh"
        >
          <Typography variant="h4" color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You don't have permission to access this page.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Required role: {requiredRoles.join(' or ')}
          </Typography>
        </Box>
      );
    }
  }

  return <>{children}</>;
}
