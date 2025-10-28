import {
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  CardActionArea,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMailboxes } from '../hooks/useMailboxes';
import EmailIcon from '@mui/icons-material/Email';

export function Dashboard() {
  const { mailboxes, loading, error } = useMailboxes();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (mailboxes.length === 0) {
    return (
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            No mailboxes assigned to you. Contact your administrator.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Mailboxes
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {mailboxes.map((mailbox) => (
          <Card key={mailbox.id}>
            <CardActionArea onClick={() => navigate(`/mailbox/${mailbox.id}`)}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <EmailIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {mailbox.email_address}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip
                    label={mailbox.is_active ? 'Active' : 'Inactive'}
                    color={mailbox.is_active ? 'success' : 'default'}
                    size="small"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {mailbox.quota_mb} MB
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
