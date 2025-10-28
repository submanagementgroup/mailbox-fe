import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Box, CircularProgress, Typography } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

/**
 * Authentication guard component
 * Redirects to login if not authenticated
 * Shows forbidden if user doesn't have required role
 */
export function AuthGuard({ children, requiredRoles }: AuthGuardProps) {
  const { isAuthenticated, login, roles } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      login();
    }
  }, [isAuthenticated, login]);

  if (!isAuthenticated) {
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
          Redirecting to login...
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
