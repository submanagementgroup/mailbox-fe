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
} from '@mui/material';
import { adminApi } from '../../lib/api';
import AddIcon from '@mui/icons-material/Add';

interface Mailbox {
  id: number;
  email_address: string;
  quota_mb: number;
  is_active: boolean;
}

export function MailboxManagement() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    emailAddress: '',
    quotaMb: 5120,
  });

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
      await adminApi.createMailbox(formData);
      setDialogOpen(false);
      setFormData({ emailAddress: '', quotaMb: 5120 });
      loadMailboxes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create mailbox');
    }
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
            <TableCell>Quota (MB)</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mailboxes.map((mailbox) => (
            <TableRow key={mailbox.id}>
              <TableCell>{mailbox.email_address}</TableCell>
              <TableCell>{mailbox.quota_mb}</TableCell>
              <TableCell>
                <Chip
                  label={mailbox.is_active ? 'Active' : 'Inactive'}
                  color={mailbox.is_active ? 'success' : 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Mailbox</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Email Address"
              type="email"
              value={formData.emailAddress}
              onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Quota (MB)"
              type="number"
              value={formData.quotaMb}
              onChange={(e) => setFormData({ ...formData, quotaMb: parseInt(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!formData.emailAddress}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
