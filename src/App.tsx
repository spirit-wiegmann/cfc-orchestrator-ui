import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import OrchestratorForm from './pages/OrchestratorForm';
import CallbackPage from './pages/CallbackPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Header />
      
      <Container component="main" sx={{ flex: 1, py: 4 }}>
        <Routes>
          <Route path="/" element={
            isAuthenticated 
              ? <OrchestratorForm /> 
              : <LoginPage />
          } />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/form" element={
            isAuthenticated 
              ? <OrchestratorForm /> 
              : <Navigate to="/" replace />
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default App;
