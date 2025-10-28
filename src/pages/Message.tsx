import { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  Divider,
  Chip,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { mailboxApi } from '../lib/api';
import { EmailMessage } from '../hooks/useMessages';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReplyIcon from '@mui/icons-material/Reply';

export function Message() {
  const { mailboxId, messageId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReply, setShowReply] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailboxId, messageId]);

  const loadMessage = async () => {
    try {
      setLoading(true);
      const response = await mailboxApi.getMessage(
        parseInt(mailboxId || '0'),
        parseInt(messageId || '0')
      );
      setMessage(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load message');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyBody.trim()) return;

    try {
      setSending(true);
      await mailboxApi.replyToMessage(
        parseInt(mailboxId || '0'),
        parseInt(messageId || '0'),
        {
          body: replyBody,
          subject: `Re: ${message?.subject}`,
        }
      );
      alert('Reply sent successfully!');
      setReplyBody('');
      setShowReply(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !message) {
    return <Alert severity="error">{error || 'Message not found'}</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/mailbox/${mailboxId}`)}
        >
          Back to Inbox
        </Button>
        <Button
          variant="contained"
          startIcon={<ReplyIcon />}
          onClick={() => setShowReply(!showReply)}
        >
          {showReply ? 'Cancel Reply' : 'Reply'}
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {message.subject || '(No Subject)'}
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <Chip label={`From: ${message.from_address}`} variant="outlined" />
          <Chip
            label={new Date(message.received_at).toLocaleString()}
            variant="outlined"
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {message.body_html ? (
          <Box
            component="iframe"
            srcDoc={message.body_html}
            sx={{
              width: '100%',
              minHeight: '400px',
              border: 'none',
              borderRadius: 1,
            }}
          />
        ) : (
          <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {message.body_text || 'No message body'}
          </Typography>
        )}
      </Paper>

      {showReply && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Reply to {message.from_address}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Message"
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Type your reply here..."
            sx={{ mt: 2 }}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button
              variant="contained"
              onClick={handleReply}
              disabled={sending || !replyBody.trim()}
            >
              {sending ? 'Sending...' : 'Send Reply'}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
