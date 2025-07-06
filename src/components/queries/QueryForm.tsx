import { useState } from 'react';
import { 
  TextField, 
  Button, 
  InputAdornment, 
  Paper, 
  Box, 
  IconButton,
  Fade,
  Typography,
  Stack,
} from '@mui/material';
import { 
  Search,
  Clear,
} from '@mui/icons-material';

interface QueryFormProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function QueryForm({ onSearch, searchQuery, setSearchQuery }: QueryFormProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };



  return (
    <Fade in timeout={300}>
      <Paper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        elevation={isFocused ? 8 : (isHovered ? 4 : 2)}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f4ff 100%)',
          border: '2px solid',
          borderColor: isFocused ? 'primary.main' : (isHovered ? 'primary.light' : 'transparent'),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
            opacity: isFocused ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Search sx={{ color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c2c2c' }}>
                  ¿Qué estás buscando?
                </Typography>
              </Box>

              {/* Search Input */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
                <TextField
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Escribe aquí lo que buscas... (ej: iPhone, laptop, bicicleta)"
                  autoComplete="off"
                  variant="outlined"
                  fullWidth
                  size="medium"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: isFocused ? 'primary.main' : 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClear}
                          edge="end"
                          size="small"
                          sx={{ 
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'error.main',
                              bgcolor: 'error.light',
                            }
                          }}
                        >
                          <Clear />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontSize: '1.1rem',
                      bgcolor: 'background.paper',
                      '& fieldset': {
                        borderColor: 'divider',
                        borderWidth: 1,
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: 2,
                        boxShadow: '0 0 0 4px rgba(106, 27, 154, 0.1)',
                      },
                    },
                    '& .MuiInputBase-input': {
                      py: 2,
                    },
                  }}
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  size="medium"
                  disabled={!searchQuery.trim()}
                  sx={{ 
                    borderRadius: 3,
                    px: 4,
                    py: 2,
                    minWidth: 120,
                    background: searchQuery.trim() 
                      ? 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)' 
                      : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                    boxShadow: searchQuery.trim() 
                      ? '0 4px 12px rgba(106, 27, 154, 0.3)' 
                      : 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: searchQuery.trim() 
                        ? 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)'
                        : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                      boxShadow: searchQuery.trim() 
                        ? '0 6px 16px rgba(106, 27, 154, 0.4)' 
                        : 'none',
                      transform: searchQuery.trim() ? 'translateY(-2px)' : 'none',
                    },
                    '&:disabled': {
                      color: 'text.disabled',
                    }
                  }}
                >
                  Buscar
                </Button>
              </Box>

              
            </Stack>
          </form>
        </Box>
      </Paper>
    </Fade>
  );
}