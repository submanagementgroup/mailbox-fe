import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import { adminApi } from '../../lib/api';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface WhitelistEntry {
  id: number;
  domain?: string;
  email?: string;
  added_at: string;
}

export function WhitelistManagement() {
  const [senders, setSenders] = useState<WhitelistEntry[]>([]);
  const [recipients, setRecipients] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSender, setNewSender] = useState('');
  const [newRecipient, setNewRecipient] = useState('');

  useEffect(() => {
    loadWhitelists();
  }, []);

  const loadWhitelists = async () => {
    try {
      setLoading(true);
      const [sendersRes, recipientsRes] = await Promise.all([
        adminApi.getWhitelistedSenders(),
        adminApi.getWhitelistedRecipients(),
      ]);
      setSenders(sendersRes.data.data || sendersRes.data);
      setRecipients(recipientsRes.data.data || recipientsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load whitelists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSender = async () => {
    if (!newSender.trim()) return;
    try {
      await adminApi.addWhitelistedSender(newSender);
      setNewSender('');
      loadWhitelists();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add sender');
    }
  };

  const handleAddRecipient = async () => {
    if (!newRecipient.trim()) return;
    try {
      await adminApi.addWhitelistedRecipient(newRecipient);
      setNewRecipient('');
      loadWhitelists();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add recipient');
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
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Whitelisted Senders */}
      <Typography variant="h6" gutterBottom>
        Whitelisted Sender Domains
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Domain (e.g., example.com)"
          value={newSender}
          onChange={(e) => setNewSender(e.target.value)}
          placeholder="example.com"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSender}
          disabled={!newSender.trim()}
        >
          Add
        </Button>
      </Box>
      <Table size="small" sx={{ mb: 4 }}>
        <TableHead>
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell>Added</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {senders.map((sender) => (
            <TableRow key={sender.id}>
              <TableCell>{sender.domain}</TableCell>
              <TableCell>{new Date(sender.added_at).toLocaleDateString()}</TableCell>
              <TableCell align="right">
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider sx={{ my: 4 }} />

      {/* Whitelisted Recipients */}
      <Typography variant="h6" gutterBottom>
        Whitelisted Recipient Emails
      </Typography>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          value={newRecipient}
          onChange={(e) => setNewRecipient(e.target.value)}
          placeholder="user@example.com"
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRecipient}
          disabled={!newRecipient.trim()}
        >
          Add
        </Button>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Added</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipients.map((recipient) => (
            <TableRow key={recipient.id}>
              <TableCell>{recipient.email}</TableCell>
              <TableCell>{new Date(recipient.added_at).toLocaleDateString()}</TableCell>
              <TableCell align="right">
                <IconButton size="small" color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
