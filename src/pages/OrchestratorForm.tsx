import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Divider, 
  FormControl, 
  FormControlLabel, 
  Grid, 
  InputLabel, 
  MenuItem, 
  Paper, 
  Select, 
  SelectChangeEvent, 
  Snackbar, 
  Stack, 
  Switch, 
  TextField, 
  Typography,
  Alert
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FolderIcon from '@mui/icons-material/Folder';

import { useAuth } from '../context/AuthContext';
import RepositorySearch from '../components/RepositorySearch';
import RepositoryList from '../components/RepositoryList';
import GitHubService, { RepositoryInput, WorkflowInput, Repository } from '../services/GitHubService';

const OrchestratorForm: React.FC = () => {
  const { token } = useAuth();
  const [repositories, setRepositories] = useState<RepositoryInput[]>([]);
  const [targetRepoName, setTargetRepoName] = useState('');
  const [targetRepoDescription, setTargetRepoDescription] = useState('Ein automatisch generiertes MonoRepo');
  const [targetOwner, setTargetOwner] = useState('');
  const [packageManager, setPackageManager] = useState<'npm' | 'yarn' | 'pnpm' | 'lerna'>('npm');
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Handler für das Hinzufügen eines Repositories
  const handleAddRepository = (repo: Repository, subfolder: string) => {
    // Prüfe, ob das Repository bereits hinzugefügt wurde
    if (repositories.some(r => r.owner === repo.owner.login && r.repo === repo.name)) {
      setSnackbar({
        open: true,
        message: 'Dieses Repository wurde bereits hinzugefügt',
        severity: 'error',
      });
      return;
    }

    setRepositories([
      ...repositories,
      {
        owner: repo.owner.login,
        repo: repo.name,
        subfolder,
      },
    ]);
  };

  // Handler für das Entfernen eines Repositories
  const handleRemoveRepository = (index: number) => {
    const newRepositories = [...repositories];
    newRepositories.splice(index, 1);
    setRepositories(newRepositories);
  };

  // Handler für die Änderung des Package Managers
  const handlePackageManagerChange = (event: SelectChangeEvent) => {
    setPackageManager(event.target.value as 'npm' | 'yarn' | 'pnpm' | 'lerna');
  };

  // Handler für die Form-Validierung
  const isFormValid = () => {
    return repositories.length > 0 && targetRepoName.trim() !== '';
  };

  // Handler für die Form-Übermittlung
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const githubService = new GitHubService(token);
      
      const workflowInput: WorkflowInput = {
        repositories,
        target_repo_name: targetRepoName,
        target_repo_description: targetRepoDescription,
        target_owner: targetOwner || undefined,
        package_manager: packageManager,
        create_private_repo: isPrivate,
      };
      
      const result = await githubService.triggerWorkflow(workflowInput);
      
      if (result.status === 'success') {
        setSnackbar({
          open: true,
          message: 'Workflow erfolgreich gestartet! Das MonoRepo wird erstellt...',
          severity: 'success',
        });
        
        // Wenn die URL verfügbar ist, leite zur Workflow-Seite weiter
        if (result.url) {
          setTimeout(() => {
            window.open(result.url, '_blank');
          }, 1500);
        }
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        MonoRepo Orchestrator
      </Typography>
      
      <Typography variant="body1" paragraph>
        Erstellen Sie ein MonoRepo durch Zusammenführung mehrerer bestehender Repositories.
      </Typography>
      
      <Paper 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          boxShadow: 2
        }}
      >
        <Grid container spacing={4}>
          {/* Linke Spalte: Repository-Auswahl */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              <GitHubIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Repositories auswählen
            </Typography>
            
            <RepositorySearch onRepositorySelected={handleAddRepository} />
            
            <Box sx={{ mt: 3 }}>
              <RepositoryList 
                repositories={repositories} 
                onRemoveRepository={handleRemoveRepository} 
              />
            </Box>
          </Grid>
          
          {/* Rechte Spalte: Konfiguration */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              <FolderIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              MonoRepo Konfiguration
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                label="MonoRepo Name"
                variant="outlined"
                fullWidth
                required
                value={targetRepoName}
                onChange={(e) => setTargetRepoName(e.target.value)}
                placeholder="mein-awesome-monorepo"
                helperText="Name des zu erstellenden Repositories"
              />
              
              <TextField
                label="Beschreibung"
                variant="outlined"
                fullWidth
                value={targetRepoDescription}
                onChange={(e) => setTargetRepoDescription(e.target.value)}
                placeholder="Ein automatisch generiertes MonoRepo"
                helperText="Kurze Beschreibung des Repositories"
              />
              
              <TextField
                label="Owner / Organisation"
                variant="outlined"
                fullWidth
                value={targetOwner}
                onChange={(e) => setTargetOwner(e.target.value)}
                placeholder="Ihr GitHub Benutzername oder eine Organisation"
                helperText="Leer lassen für den aktuellen Benutzer"
              />
              
              <FormControl fullWidth>
                <InputLabel id="package-manager-label">Package Manager</InputLabel>
                <Select
                  labelId="package-manager-label"
                  value={packageManager}
                  label="Package Manager"
                  onChange={handlePackageManagerChange}
                >
                  <MenuItem value="npm">npm</MenuItem>
                  <MenuItem value="yarn">yarn</MenuItem>
                  <MenuItem value="pnpm">pnpm</MenuItem>
                  <MenuItem value="lerna">lerna</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={isPrivate} 
                    onChange={(e) => setIsPrivate(e.target.checked)} 
                  />
                }
                label="Privates Repository erstellen"
              />
            </Stack>
          </Grid>
          
          {/* Formular-Aktionen */}
          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!isFormValid() || loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
              >
                {loading ? 'Wird gestartet...' : 'Workflow starten'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Erweiterte Informationen */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Was passiert im Hintergrund?
          </Typography>
          
          <Typography variant="body2" paragraph>
            Der Workflow führt folgende Schritte aus:
          </Typography>
          
          <ol>
            <Typography variant="body2" component="li">
              Klonen der ausgewählten Repositories
            </Typography>
            <Typography variant="body2" component="li">
              Strukturieren in einer MonoRepo-Architektur mit apps/, libs/, packages/ und tools/
            </Typography>
            <Typography variant="body2" component="li">
              Konfiguration des ausgewählten Package Managers
            </Typography>
            <Typography variant="body2" component="li">
              Erstellen von TypeScript, ESLint und Prettier Konfigurationen
            </Typography>
            <Typography variant="body2" component="li">
              Einrichtung einer GitHub Actions CI/CD Pipeline
            </Typography>
            <Typography variant="body2" component="li">
              Erstellung eines neuen Repositories und Push des MonoRepo
            </Typography>
          </ol>
        </CardContent>
      </Card>
      
      {/* Snackbar für Benachrichtigungen */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrchestratorForm;
