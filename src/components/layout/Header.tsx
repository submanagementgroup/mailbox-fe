import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AccountCircle from '@mui/icons-material/AccountCircle';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/smg-logo-small.png" alt="SMG Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h6" component="div">
            Email MFA Platform
          </Typography>
        </Box>

        {isAdmin && (
          <Button color="inherit" onClick={() => navigate('/admin')}>
            Admin
          </Button>
        )}

        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ mr: 2 }}>
            {user?.name || user?.username}
          </Typography>
          <Button
            onClick={handleMenu}
            color="inherit"
            startIcon={<AccountCircle />}
          >
            Account
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.username}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
