import { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack, Collapse, SelectChangeEvent } from '@mui/material';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <Stack spacing={2}>
        {/* Botón de búsqueda avanzada */}
        <Button
          variant="outlined"
          onClick={toggleAdvancedFilters}
          endIcon={showAdvancedFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          fullWidth
          sx={{ justifyContent: 'space-between' }}
        >
          Búsqueda avanzada
        </Button>

        {/* Filtros avanzados */}
        <Collapse in={showAdvancedFilters}>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Categoría</InputLabel>
              <Select
                name="categoryId"
                value={filters.categoryId?.toString() || ''}
                onChange={handleSelectChange}
                label="Categoría"
              >
                <MenuItem value="">Todas</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Stack direction="row" spacing={2}>
              <TextField
                name="minPrice"
                label="Precio mínimo"
                type="number"
                value={filters.minPrice || ''}
                onChange={handleTextChange}
                fullWidth
              />
              <TextField
                name="maxPrice"
                label="Precio máximo"
                type="number"
                value={filters.maxPrice || ''}
                onChange={handleTextChange}
                fullWidth
              />
            </Stack>

            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                name="status"
                value={filters.status || ''}
                onChange={handleSelectChange}
                label="Estado"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="NUEVO">Nuevo</MenuItem>
                <MenuItem value="USADO">Usado</MenuItem>
                <MenuItem value="SEMINUEVO">Seminuevo</MenuItem>
              </Select>
            </FormControl>

            <TextField
              name="location"
              label="Ubicación"
              value={filters.location || ''}
              onChange={handleTextChange}
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                fullWidth
              >
                Aplicar filtros
              </Button>
              <Button 
                type="button" 
                variant="outlined" 
                onClick={handleReset}
                fullWidth
              >
                Limpiar
              </Button>
            </Stack>
          </Stack>
        </Collapse>
      </Stack>
    </form>
  );
} 