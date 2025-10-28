import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Typography,
  TablePagination,
} from '@mui/material';
import { adminApi } from '../../lib/api';

interface AuditLogEntry {
  id: number;
  entra_user_id: string;
  user_email: string;
  action: string;
  resource_type?: string;
  resource_id?: number;
  timestamp: string;
  ip_address?: string;
}

export function AuditLogViewer() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadAuditLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const loadAuditLog = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAuditLog({
        page: page + 1,
        pageSize: rowsPerPage,
      });
      const data = response.data.data || response.data;
      setEntries(data.items || data);
      setTotal(data.total || data.length);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load audit log');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading && entries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        System Audit Log
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Resource</TableCell>
            <TableCell>IP Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {new Date(entry.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>
                <Typography variant="body2">{entry.user_email}</Typography>
              </TableCell>
              <TableCell>
                <Chip label={entry.action} size="small" />
              </TableCell>
              <TableCell>
                {entry.resource_type && entry.resource_id ? (
                  <Typography variant="caption">
                    {entry.resource_type} #{entry.resource_id}
                  </Typography>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell>
                <Typography variant="caption">{entry.ip_address || '-'}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[25, 50, 100]}
      />
    </Box>
  );
}
