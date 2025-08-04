import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Typography 
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          CFC Orchestrator UI
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          Erstellen Sie MonoRepos durch Zusammenführung bestehender GitHub Repositories.
        </Typography>
        
        <Card sx={{ width: '100%', mt: 4 }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Anmelden mit GitHub
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Melden Sie sich mit Ihrem GitHub-Konto an, um den Orchestrator zu verwenden.
            </Typography>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<GitHubIcon />}
              onClick={login}
              sx={{ mt: 2 }}
            >
              Mit GitHub anmelden
            </Button>
          </CardContent>
        </Card>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          Sie benötigen ein GitHub-Konto mit Zugriff auf die Repositories, die Sie verwenden möchten.
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;
