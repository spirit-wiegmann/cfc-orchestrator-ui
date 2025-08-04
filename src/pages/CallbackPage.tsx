import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Mock für die Tokenauthentifizierung - in einer tatsächlichen Implementierung würde dies
// über einen Backend-Service erfolgen, um das Client Secret zu schützen
const exchangeCodeForToken = async (code: string): Promise<string> => {
  // In einer echten Implementierung würde dies einen API-Aufruf an ein Backend machen
  // Da dies eine Demo ist, simulieren wir einfach eine erfolgreiche Antwort
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simuliere API-Aufruf
  
  // Gebe einen Dummy-Token zurück
  return `gh_dummy_token_${code}_${Date.now()}`;
};

const CallbackPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const errorMsg = searchParams.get('error');
      
      if (errorMsg) {
        setError(`Authentifizierungsfehler: ${errorMsg}`);
        return;
      }
      
      if (!code) {
        setError('Kein Autorisierungscode erhalten');
        return;
      }
      
      try {
        const token = await exchangeCodeForToken(code);
        setToken(token);
        navigate('/form');
      } catch (err) {
        setError('Fehler bei der Token-Anfrage');
        console.error(err);
      }
    };
    
    handleCallback();
  }, [searchParams, setToken, navigate]);

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Typography variant="body1">
          Bitte versuchen Sie es erneut oder kontaktieren Sie den Administrator.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 4 }}>
        Authentifizierung wird abgeschlossen...
      </Typography>
    </Box>
  );
};

export default CallbackPage;
