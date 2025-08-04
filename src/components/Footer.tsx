import React from 'react';
import { Box, Container, Divider, Link, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
      }}
    >
      <Container maxWidth="lg">
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} Crownpeak. Alle Rechte vorbehalten.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="https://github.com/spirit-wiegmann/cfc-orchestrator" target="_blank" color="inherit" underline="hover">
              GitHub
            </Link>
            <Link href="https://github.com/spirit-wiegmann/cfc-orchestrator/docs" target="_blank" color="inherit" underline="hover">
              Dokumentation
            </Link>
            <Link href="https://github.com/spirit-wiegmann/cfc-orchestrator/issues" target="_blank" color="inherit" underline="hover">
              Fehler melden
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
