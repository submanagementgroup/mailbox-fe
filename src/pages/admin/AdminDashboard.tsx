import { useState } from 'react';
import { Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { UserManagement } from '../../components/admin/UserManagement';
import { MailboxManagement } from '../../components/admin/MailboxManagement';
import { WhitelistManagement } from '../../components/admin/WhitelistManagement';
import { AuditLogViewer } from '../../components/admin/AuditLogViewer';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function AdminDashboard() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Users" />
          <Tab label="Mailboxes" />
          <Tab label="Whitelist" />
          <Tab label="Audit Log" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <UserManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MailboxManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <WhitelistManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <AuditLogViewer />
        </TabPanel>
      </Paper>
    </Box>
  );
}
