import { useState } from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Button, 
  Stack, 
  Collapse, 
  SelectChangeEvent,
  Paper,
  Box,
  Typography,
  Chip,
  InputAdornment,
  Fade,
  Divider,
  Badge,
} from '@mui/material';
import { 
  ExpandMore,
  ExpandLess,
  Clear,
  Search,
  AttachMoney,
  LocationOn,
  Category,
  NewReleases,
  TuneRounded,
} from '@mui/icons-material';

interface FilterFormProps {
  onFilter: (filters: FilterOptions) => void;
  categories: { id: number; name: string }[];
}

export interface FilterOptions {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  location?: string;
}

export default function FilterForm({ onFilter, categories }: FilterFormProps) {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name.includes('Price') ? Number(value) : value)
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === '' ? undefined : (name === 'categoryId' ? Number(value) : value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  // Obtener labels de filtros activos
  const getActiveFilterLabels = () => {
    const labels = [];
    if (filters.categoryId) {
      const category = categories.find(c => c.id === filters.categoryId);
      if (category) labels.push(category.name);
    }
    if (filters.minPrice) labels.push(`Min: $${filters.minPrice.toLocaleString()}`);
    if (filters.maxPrice) labels.push(`Max: $${filters.maxPrice.toLocaleString()}`);
    if (filters.status) labels.push(filters.status);
    if (filters.location) labels.push(filters.location);
    return labels;
  };

  const activeLabels = getActiveFilterLabels();

  return (
    <Fade in timeout={300}>
      <Paper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        elevation={isHovered ? 8 : 2}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: isHovered ? 'primary.main' : 'divider',
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
            opacity: showAdvancedFilters ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Header con título y botón de filtros */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TuneRounded sx={{ color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c2c2c' }}>
                    Filtros de búsqueda
                  </Typography>
                </Box>
                
                <Badge badgeContent={activeFiltersCount} color="primary">
                  <Button
                    variant={showAdvancedFilters ? "contained" : "outlined"}
                    onClick={toggleAdvancedFilters}
                    endIcon={showAdvancedFilters ? <ExpandLess /> : <ExpandMore />}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 'auto',
                      ...(showAdvancedFilters && {
                        background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                        boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
                      })
                    }}
                  >
                    {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} filtros
                  </Button>
                </Badge>
              </Box>

              {/* Chips de filtros activos */}
              {activeLabels.length > 0 && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', fontWeight: 500 }}>
                    Filtros activos:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {activeLabels.map((label, index) => (
                      <Chip
                        key={index}
                        label={label}
                        size="small"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 500,
                          '& .MuiChip-deleteIcon': {
                            color: 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              color: 'white',
                            }
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Filtros avanzados */}
              <Collapse in={showAdvancedFilters} timeout={300}>
                <Stack spacing={3}>
                  <Divider />
                  
                  {/* Categoría */}
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      name="categoryId"
                      value={filters.categoryId?.toString() || ''}
                      onChange={handleSelectChange}
                      label="Categoría"
                      startAdornment={
                        <InputAdornment position="start">
                          <Category sx={{ color: 'text.secondary', ml: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Todas las categorías</em>
                      </MenuItem>
                      {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Rango de precios */}
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 500 }}>
                      💰 Rango de precios
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        name="minPrice"
                        label="Precio mínimo"
                        type="number"
                        value={filters.minPrice || ''}
                        onChange={handleTextChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                      <TextField
                        name="maxPrice"
                        label="Precio máximo"
                        type="number"
                        value={filters.maxPrice || ''}
                        onChange={handleTextChange}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <AttachMoney sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* Estado del producto */}
                  <FormControl fullWidth>
                    <InputLabel>Estado del producto</InputLabel>
                    <Select
                      name="status"
                      value={filters.status || ''}
                      onChange={handleSelectChange}
                      label="Estado del producto"
                      startAdornment={
                        <InputAdornment position="start">
                          <NewReleases sx={{ color: 'text.secondary', ml: 1 }} />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    >
                      <MenuItem value="">
                        <em>Todos los estados</em>
                      </MenuItem>
                      <MenuItem value="NUEVO">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#4caf50' }} />
                          Nuevo
                        </Box>
                      </MenuItem>
                      <MenuItem value="SEMINUEVO">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#ff9800' }} />
                          Seminuevo
                        </Box>
                      </MenuItem>
                      <MenuItem value="USADO">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#2196f3' }} />
                          Usado
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {/* Ubicación */}
                  <TextField
                    name="location"
                    label="Ubicación"
                    value={filters.location || ''}
                    onChange={handleTextChange}
                    fullWidth
                    placeholder="Ej: Bogotá, Medellín..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />

                  <Divider />

                  {/* Botones de acción */}
                  <Stack direction="row" spacing={2}>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      size="large"
                      startIcon={<Search />}
                      fullWidth
                      sx={{ 
                        borderRadius: 2,
                        background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                        boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
                          boxShadow: '0 6px 16px rgba(106, 27, 154, 0.4)',
                        }
                      }}
                    >
                      Aplicar filtros
                    </Button>
                    <Button 
                      type="button" 
                      variant="outlined" 
                      size="large"
                      onClick={handleReset}
                      startIcon={<Clear />}
                      fullWidth
                      sx={{ 
                        borderRadius: 2,
                        borderColor: 'text.secondary',
                        color: 'text.secondary',
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': {
                          bgcolor: 'text.secondary',
                          color: 'white',
                          borderColor: 'text.secondary',
                        }
                      }}
                    >
                      Limpiar todo
                    </Button>
                  </Stack>
                </Stack>
              </Collapse>
            </Stack>
          </form>
        </Box>
      </Paper>
    </Fade>
  );
}