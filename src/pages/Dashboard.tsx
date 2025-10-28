import { Typography, Paper, Box } from '@mui/material';

export function Dashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography>
          Your mailboxes will appear here.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Implementation in Commit 10
        </Typography>
      </Paper>
    </Box>
  );
}
