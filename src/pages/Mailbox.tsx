import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useMessages } from '../hooks/useMessages';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings';

export function Mailbox() {
  const { mailboxId } = useParams();
  const navigate = useNavigate();
  const { messages, loading, error } = useMessages(parseInt(mailboxId || '0'));

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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4">
            Inbox
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<SettingsIcon />}
          onClick={() => navigate(`/mailbox/${mailboxId}/forwarding`)}
        >
          Forwarding Rules
        </Button>
      </Box>

      {messages.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">
            No messages in this mailbox.
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={message.id}
                divider={index < messages.length - 1}
                disablePadding
              >
                <ListItemButton
                  onClick={() => navigate(`/mailbox/${mailboxId}/message/${message.id}`)}
                >
                  <ListItemText
                    primary={message.subject || '(No Subject)'}
                    secondary={
                      <Box display="flex" gap={2} mt={1}>
                        <Typography variant="caption">
                          From: {message.from_address}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(message.received_at).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
