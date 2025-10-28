import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { mailboxApi } from '../lib/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

interface ForwardingRule {
  id: number;
  recipient_email: string;
  is_enabled: boolean;
  is_system?: boolean;
}

export function Forwarding() {
  const { mailboxId } = useParams();
  const navigate = useNavigate();
  const [rules, setRules] = useState<ForwardingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadRules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailboxId]);

  const loadRules = async () => {
    try {
      setLoading(true);
      const response = await mailboxApi.getForwardingRules(parseInt(mailboxId || '0'));
      setRules(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load forwarding rules');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newEmail.trim()) return;

    try {
      setAdding(true);
      await mailboxApi.createForwardingRule(parseInt(mailboxId || '0'), {
        recipientEmail: newEmail,
        isEnabled: true,
      });
      setNewEmail('');
      loadRules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create forwarding rule');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (ruleId: number) => {
    if (!window.confirm('Delete this forwarding rule?')) return;

    try {
      await mailboxApi.deleteForwardingRule(parseInt(mailboxId || '0'), ruleId);
      loadRules();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete rule');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/mailbox/${mailboxId}`)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4">
          Forwarding Rules
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Add new rule */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add Forwarding Rule
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            fullWidth
            label="Recipient Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="user@example.com"
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            disabled={adding || !newEmail.trim()}
          >
            Add
          </Button>
        </Box>
      </Paper>

      {/* Rules list */}
      <Paper>
        <Box p={2}>
          <Typography variant="h6">Your Forwarding Rules</Typography>
        </Box>
        <Divider />
        {rules.length === 0 ? (
          <Box p={3}>
            <Typography color="text.secondary">
              No forwarding rules configured
            </Typography>
          </Box>
        ) : (
          <List>
            {rules.map((rule, index) => (
              <ListItem
                key={rule.id}
                divider={index < rules.length - 1}
                secondaryAction={
                  !rule.is_system && (
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(rule.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={rule.recipient_email}
                  secondary={
                    rule.is_system
                      ? 'System Rule (Protected)'
                      : rule.is_enabled
                      ? 'Active'
                      : 'Disabled'
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
