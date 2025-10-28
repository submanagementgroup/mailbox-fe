import { useState, useEffect } from 'react';
import { mailboxApi } from '../lib/api';

export interface Mailbox {
  id: number;
  email_address: string;
  quota_mb: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useMailboxes() {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMailboxes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mailboxApi.getMailboxes();
      setMailboxes(response.data.data || response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load mailboxes');
      console.error('Failed to load mailboxes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMailboxes();
  }, []);

  return {
    mailboxes,
    loading,
    error,
    reload: loadMailboxes,
  };
}
