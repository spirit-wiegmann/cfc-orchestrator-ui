import React from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  Divider, 
  IconButton, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemSecondaryAction, 
  Typography 
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import { RepositoryInput } from '../services/GitHubService';

interface RepositoryListProps {
  repositories: RepositoryInput[];
  onRemoveRepository: (index: number) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({ repositories, onRemoveRepository }) => {
  if (repositories.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            Keine Repositories ausgewählt. Suchen Sie nach Repositories und fügen Sie sie hinzu.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Ausgewählte Repositories ({repositories.length})
        </Typography>
        
        <List disablePadding>
          {repositories.map((repo, index) => (
            <React.Fragment key={`${repo.owner}/${repo.repo}`}>
              {index > 0 && <Divider component="li" />}
              <ListItem>
                <ListItemIcon>
                  <FolderIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${repo.owner}/${repo.repo}`}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Chip 
                        label={repo.subfolder} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => onRemoveRepository(index)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
        
        {repositories.length > 1 && (
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button 
              size="small" 
              color="error" 
              onClick={() => {
                if (window.confirm('Alle Repositories entfernen?')) {
                  repositories.forEach((_, index) => onRemoveRepository(0));
                }
              }}
            >
              Alle entfernen
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RepositoryList;
