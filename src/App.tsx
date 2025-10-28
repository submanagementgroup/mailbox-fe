import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from './lib/msalConfig';
import { AuthGuard } from './components/auth/AuthGuard';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Mailbox } from './pages/Mailbox';
import { Message } from './pages/Message';
import { Forwarding } from './pages/Forwarding';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// SMG theme colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<div>Redirecting to login...</div>} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <AuthGuard>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </AuthGuard>
              }
            />

            <Route
              path="/mailbox/:mailboxId"
              element={
                <AuthGuard>
                  <Layout>
                    <Mailbox />
                  </Layout>
                </AuthGuard>
              }
            />

            <Route
              path="/mailbox/:mailboxId/message/:messageId"
              element={
                <AuthGuard>
                  <Layout>
                    <Message />
                  </Layout>
                </AuthGuard>
              }
            />

            <Route
              path="/mailbox/:mailboxId/forwarding"
              element={
                <AuthGuard>
                  <Layout>
                    <Forwarding />
                  </Layout>
                </AuthGuard>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/*"
              element={
                <AuthGuard requiredRoles={['SYSTEM_ADMIN']}>
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </AuthGuard>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </MsalProvider>
  );
}

export default App;
