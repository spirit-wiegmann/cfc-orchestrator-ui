import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom sx={{ fontSize: '7rem', fontWeight: 'bold' }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" gutterBottom>
          Seite nicht gefunden
        </Typography>
        
        <Typography variant="body1" paragraph>
          Die von Ihnen gesuchte Seite existiert nicht oder wurde verschoben.
        </Typography>
        
        <Button
          component={RouterLink}
          to="/"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3 }}
        >
          Zurück zur Startseite
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
