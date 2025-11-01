import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  DialogContentText,
  LinearProgress,
  Typography,
} from '@mui/material';
import { adminApi } from '../../lib/api';
import awsConfig from '../../aws-exports';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Mailbox {
  id: number;
  email_address: string;
  quota_mb: number;
  used_mb: number;
  is_active: boolean;
}

export function MailboxManagement() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mailboxToDelete, setMailboxToDelete] = useState<Mailbox | null>(null);
  const [formData, setFormData] = useState({
    username: '',
  });

  const mailboxDomain = awsConfig.app.mailboxDomain || 'funding.dev.submanagementgroup.com';
  const QUOTA_MB = 20480; // 20GB - fixed for all mailboxes

  useEffect(() => {
    loadMailboxes();
  }, []);

  const loadMailboxes = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllMailboxes();
      setMailboxes(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load mailboxes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const emailAddress = `${formData.username}@${mailboxDomain}`;
      await adminApi.createMailbox({ emailAddress, quotaMb: QUOTA_MB });
      setDialogOpen(false);
      setFormData({ username: '' });
      loadMailboxes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create mailbox');
    }
  };

  const handleDeleteClick = (mailbox: Mailbox) => {
    setMailboxToDelete(mailbox);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!mailboxToDelete) return;

    try {
      await adminApi.deleteMailbox(mailboxToDelete.id);
      setDeleteDialogOpen(false);
      setMailboxToDelete(null);
      loadMailboxes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete mailbox');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setMailboxToDelete(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <div></div>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Create Mailbox
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email Address</TableCell>
            <TableCell width="300">Usage</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mailboxes.map((mailbox) => {
            const usedMb = mailbox.used_mb || 0;
            const quotaMb = mailbox.quota_mb;
            const usagePercent = (usedMb / quotaMb) * 100;
            const usedGb = (usedMb / 1024).toFixed(2);
            const quotaGb = (quotaMb / 1024).toFixed(0);

            return (
              <TableRow key={mailbox.id}>
                <TableCell>{mailbox.email_address}</TableCell>
                <TableCell>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {usedGb} GB / {quotaGb} GB
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {usagePercent.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(usagePercent, 100)}
                      color={usagePercent > 90 ? 'error' : usagePercent > 75 ? 'warning' : 'primary'}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={mailbox.is_active ? 'Active' : 'Inactive'}
                    color={mailbox.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleDeleteClick(mailbox)}
                    color="error"
                    size="small"
                    aria-label="delete mailbox"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Mailbox</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Mailbox Username"
              value={formData.username}
              onChange={(e) => setFormData({ username: e.target.value })}
              fullWidth
              required
              helperText={`Full address: ${formData.username || 'username'}@${mailboxDomain}`}
              placeholder="client1"
            />
            <Typography variant="body2" color="text.secondary">
              Quota: 20 GB (standard for all mailboxes)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!formData.username}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Mailbox</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the mailbox{' '}
            <strong>{mailboxToDelete?.email_address}</strong>?
          </DialogContentText>
          <DialogContentText sx={{ mt: 2, color: 'error.main', fontWeight: 'bold' }}>
            ⚠️ Warning: This will permanently delete all emails for this client and cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
