import { Typography, Paper, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export function Forwarding() {
  const { mailboxId } = useParams();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Forwarding Rules
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Forwarding rules for mailbox {mailboxId} will appear here.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Implementation in Commit 10
        </Typography>
      </Paper>
    </Box>
  );
}
