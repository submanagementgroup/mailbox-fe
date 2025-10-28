import { useState, useEffect } from 'react';
import { mailboxApi } from '../lib/api';

export interface EmailMessage {
  id: number;
  message_id: string;
  from_address: string;
  to_address: string;
  subject: string;
  body_text?: string;
  body_html?: string;
  received_at: string;
  created_at: string;
}

export function useMessages(mailboxId: number) {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadMessages = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await mailboxApi.getMessages(mailboxId, {
        page: pageNum,
        pageSize: 50,
      });
      const data = response.data.data || response.data;
      setMessages(data.items || data);
      setTotal(data.total || data.length);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load messages');
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mailboxId) {
      loadMessages();
    }
  }, [mailboxId]);

  return {
    messages,
    loading,
    error,
    total,
    page,
    loadMessages,
    reload: () => loadMessages(page),
  };
}
