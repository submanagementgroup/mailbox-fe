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
} from '@mui/material';
import { adminApi } from '../../lib/api';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface WhitelistEntry {
  id: number;
  domain: string;
  added_at: string;
}

export function WhitelistManagement() {
  const [senders, setSenders] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSender, setNewSender] = useState('');

  useEffect(() => {
    loadWhitelists();
  }, []);

  const loadWhitelists = async () => {
    try {
      setLoading(true);
      const sendersRes = await adminApi.getWhitelistedSenders();
      setSenders(sendersRes.data.data || sendersRes.data);
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
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Only emails from these domains will be accepted by the mailbox system.
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
      <Table size="small">
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
    </Box>
  );
}
