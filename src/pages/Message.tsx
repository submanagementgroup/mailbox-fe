import { Typography, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export function Message() {
  const { mailboxId, messageId } = useParams();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Message {messageId}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Email message detail will appear here.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Mailbox: {mailboxId} | Implementation in Commit 10
        </Typography>
      </Paper>
    </Box>
  );
}
