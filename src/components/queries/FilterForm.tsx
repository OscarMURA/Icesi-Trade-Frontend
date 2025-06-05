import { useState } from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Stack } from '@mui/material';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name as string]: value
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Categoría</InputLabel>
          <Select
            name="categoryId"
            value={filters.categoryId || ''}
            onChange={handleChange}
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
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="maxPrice"
            label="Precio máximo"
            type="number"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            fullWidth
          />
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>
          <Select
            name="status"
            value={filters.status || ''}
            onChange={handleChange}
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
          onChange={handleChange}
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
    </form>
  );
} 