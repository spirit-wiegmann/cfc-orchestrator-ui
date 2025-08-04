import React, { useState, useEffect } from 'react';
import { 
  Autocomplete, 
  Box, 
  Button, 
  CircularProgress, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Typography,
  Grid,
  Avatar
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAuth } from '../context/AuthContext';
import GitHubService, { Repository } from '../services/GitHubService';

interface RepositorySearchProps {
  onRepositorySelected: (repo: Repository, subfolder: string) => void;
}

const RepositorySearch: React.FC<RepositorySearchProps> = ({ onRepositorySelected }) => {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subfolder, setSubfolder] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Suche nach Repositories
  useEffect(() => {
    const searchRepositories = async () => {
      if (searchQuery.length < 3) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const githubService = new GitHubService(token);
        const results = await githubService.searchRepositories(searchQuery);
        setSearchResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchRepositories, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, token]);

  // Dialogsteuerung
  const handleOpenDialog = (repo: Repository) => {
    setSelectedRepo(repo);
    
    // Vorschlag für den Subfolder basierend auf Repository-Typ generieren
    let suggestedSubfolder = '';
    const repoName = repo.name.toLowerCase();
    
    if (repoName.includes('api') || repoName.includes('backend') || repoName.includes('server')) {
      suggestedSubfolder = `apps/${repo.name}`;
    } else if (repoName.includes('web') || repoName.includes('frontend') || repoName.includes('ui')) {
      suggestedSubfolder = `apps/${repo.name}`;
    } else if (repoName.includes('lib') || repoName.includes('common') || repoName.includes('util')) {
      suggestedSubfolder = `libs/${repo.name}`;
    } else if (repoName.includes('tool') || repoName.includes('script')) {
      suggestedSubfolder = `tools/${repo.name}`;
    } else if (repoName.includes('package') || repoName.includes('component')) {
      suggestedSubfolder = `packages/${repo.name}`;
    } else {
      suggestedSubfolder = `apps/${repo.name}`;
    }
    
    setSubfolder(suggestedSubfolder);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedRepo(null);
    setSubfolder('');
  };

  const handleConfirmSelection = () => {
    if (selectedRepo && subfolder) {
      onRepositorySelected(selectedRepo, subfolder);
      handleCloseDialog();
    }
  };

  return (
    <>
      <Autocomplete
        id="repository-search"
        options={searchResults}
        loading={loading}
        onInputChange={(_, value) => setSearchQuery(value)}
        getOptionLabel={(option) => `${option.owner.login}/${option.name}`}
        renderOption={(props, option) => (
          <li {...props}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                  <GitHubIcon fontSize="small" />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="body1">
                  {option.owner.login}/{option.name}
                </Typography>
                {option.description && (
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {option.description}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Repository suchen"
            variant="outlined"
            fullWidth
            error={!!error}
            helperText={error || "Mind. 3 Zeichen eingeben zur Suche"}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
        onChange={(_, value) => {
          if (value) {
            handleOpenDialog(value);
          }
        }}
        noOptionsText="Keine Repositories gefunden"
        loadingText="Suche..."
      />

      {/* Dialog für Subfolder-Auswahl */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Repository hinzufügen
        </DialogTitle>
        
        <DialogContent>
          {selectedRepo && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <GitHubIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
                {selectedRepo.owner.login}/{selectedRepo.name}
              </Typography>
              
              {selectedRepo.description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedRepo.description}
                </Typography>
              )}
              
              <TextField
                label="Zielordner im MonoRepo"
                variant="outlined"
                fullWidth
                value={subfolder}
                onChange={(e) => setSubfolder(e.target.value)}
                required
                helperText="z.B. apps/frontend, libs/utils, etc."
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseDialog}>Abbrechen</Button>
          <Button 
            onClick={handleConfirmSelection} 
            variant="contained" 
            disabled={!subfolder}
          >
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RepositorySearch;
