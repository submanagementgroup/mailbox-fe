import { Button, Box, Typography, Paper } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

/**
 * Development-only login component
 * Bypasses Azure Entra and sets mock authentication
 */
export function DevLogin() {
  const handleDevLogin = () => {
    const mockUser = {
      homeAccountId: 'dev-account-id',
      environment: 'dev',
      tenantId: 'dev-tenant',
      username: 'matt@submanagementgroup.com',
      localAccountId: 'dev-local-id',
      name: 'Matt Chadburn (Dev Mode)',
      idTokenClaims: {
        roles: ['SYSTEM_ADMIN'],
        email: 'matt@submanagementgroup.com',
        name: 'Matt Chadburn',
        sub: 'dev-user-id',
      },
    };

    // Store mock token in session storage (MSAL format)
    sessionStorage.setItem('msal.token.keys', JSON.stringify({
      'dev-token-key': {
        credentialType: 'AccessToken',
        homeAccountId: 'dev-account-id',
        environment: 'dev',
        clientId: 'dev-client',
        realm: 'dev-tenant',
      },
    }));

    sessionStorage.setItem('msal.dev-token', JSON.stringify({
      accessToken: 'DEV_TOKEN_BYPASS',
      expiresOn: Date.now() + 86400000, // 24 hours
      account: mockUser,
    }));

    sessionStorage.setItem('msal.account.dev-account-id', JSON.stringify(mockUser));

    // Reload to trigger auth state change
    window.location.reload();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 6,
          maxWidth: 500,
          textAlign: 'center',
          borderRadius: 4,
        }}
      >
        <Box mb={3}>
          <img src="/smg-logo.png" alt="SMG Logo" style={{ height: 80 }} />
        </Box>

        <Typography variant="h4" gutterBottom>
          Email MFA Platform
        </Typography>

        <Typography variant="h6" color="warning.main" gutterBottom sx={{ mt: 2 }}>
          Development Mode
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Authentication is bypassed for local development
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={<LoginIcon />}
          onClick={handleDevLogin}
          sx={{ py: 1.5, fontSize: '1.1rem' }}
        >
          Login as matt@submanagementgroup.com
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Role: SYSTEM_ADMIN (full access)
        </Typography>
      </Paper>
    </Box>
  );
}
