import { useState } from 'react';
import { Product } from '../../types/productTypes';
import { Button, TextField, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function ProductEditForm({
  product,
  onCancel,
  onUpdate,
}: {
  product: Product;
  onCancel: () => void;
  onUpdate: (p: Product) => void;
}) {
  const [form, setForm] = useState({
    title: product.title,
    description: product.description,
    price: product.price,
    status: product.status,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate({ ...product, ...form });
  };

  return (
    <Stack spacing={2}>
      <TextField
        name="title"
        label="Título"
        value={form.title}
        onChange={handleChange}
      />
      <TextField
        name="description"
        label="Descripción"
        value={form.description}
        onChange={handleChange}
        multiline
      />
      <TextField
        name="price"
        label="Precio"
        type="number"
        value={form.price}
        onChange={handleChange}
      />
      <FormControl fullWidth>
        <InputLabel>Estado</InputLabel>
        <Select
          name="status"
          value={form.status}
          label="Estado"
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <MenuItem value="Nuevo">Nuevo</MenuItem>
          <MenuItem value="Usado">Usado</MenuItem>
          <MenuItem value="Seminuevo">Seminuevo</MenuItem>
        </Select>
      </FormControl>
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
        <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
      </Stack>
    </Stack>
  );
}