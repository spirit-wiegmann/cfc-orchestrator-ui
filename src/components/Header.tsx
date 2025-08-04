import React from 'react';
import { 
  AppBar, 
  Avatar, 
  Box, 
  Button, 
  Container, 
  Toolbar, 
  Typography 
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo und Titel */}
          <Avatar 
            src="/logo192.png" 
            alt="CFC Orchestrator Logo"
            sx={{ mr: 2 }}
          />
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            CFC Orchestrator
          </Typography>
          
          {/* Flexibler Abstandshalter */}
          <Box sx={{ flexGrow: 1 }} />
          
          {/* GitHub Link */}
          <Button 
            href="https://github.com/spirit-wiegmann/cfc-orchestrator" 
            target="_blank"
            startIcon={<GitHubIcon />}
            sx={{ mr: 2 }}
          >
            GitHub
          </Button>
          
          {/* Login/Logout Button */}
          {isAuthenticated && (
            <Button 
              color="primary" 
              variant="outlined" 
              onClick={logout}
            >
              Abmelden
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
