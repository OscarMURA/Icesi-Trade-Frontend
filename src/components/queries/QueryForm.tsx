import { TextField, Button, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface QueryFormProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export default function QueryForm({ onSearch, searchQuery, setSearchQuery }: QueryFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
      <TextField
        type="text"
        id="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Buscar productos..."
        autoComplete="off"
        variant="outlined"
        fullWidth
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          style: { borderRadius: 16 }
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="medium"
        sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold', px: 4 }}
      >
        Buscar
      </Button>
    </form>
  );
} 