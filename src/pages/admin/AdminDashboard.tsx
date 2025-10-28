import { Typography, Paper, Box, Grid, Card, CardContent } from '@mui/material';

export function AdminDashboard() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">User Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Create and manage users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Mailbox Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Create and assign mailboxes
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Whitelist Management</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage sender and recipient whitelists
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Audit Log</Typography>
              <Typography variant="body2" color="text.secondary">
                View system audit trail
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Full admin implementation in Commit 11
        </Typography>
      </Paper>
    </Box>
  );
}
