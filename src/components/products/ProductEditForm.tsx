import { useState } from 'react';
import { Product } from '../../types/productTypes';
import { Button, TextField, Stack } from '@mui/material';

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
      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
        <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
      </Stack>
    </Stack>
  );
}