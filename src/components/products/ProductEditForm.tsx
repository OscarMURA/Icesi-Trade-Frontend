import { useState } from 'react';
import { Product } from '../../types/productTypes';
import {
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { uploadImage } from '../../api/uploadImage';

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
    imageUrl: product.imageUrl || '',
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(product.imageUrl || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setImage(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let imageUrl = form.imageUrl;

      if (image) {
        imageUrl = await uploadImage(image);
      } else {
        imageUrl = product.imageUrl || '';
      }

      const updatedProduct = { ...product, ...form, imageUrl };
      onUpdate(updatedProduct);
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setError('Error al subir imagen o actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Editar producto</Typography>

      <TextField
        name="title"
        label="Título"
        value={form.title}
        onChange={handleChange}
        fullWidth
      />
      <TextField
        name="description"
        label="Descripción"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
      />
      <TextField
        name="price"
        label="Precio"
        type="number"
        value={form.price}
        onChange={handleChange}
        fullWidth
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

      <div>
        <label htmlFor="image-upload">Imagen del producto</label><br />
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        {product.imageUrl && !image && (
          <Typography variant="body2" color="textSecondary">
            Imagen actual: <a href={product.imageUrl} target="_blank" rel="noopener noreferrer">Ver imagen</a>
          </Typography>
        )}
      </div>

      {preview && (
        <img
          src={preview}
          alt="Vista previa"
          style={{ width: '120px', borderRadius: 8, marginTop: 8 }}
        />
      )}

      {error && <Typography color="error">{error}</Typography>}

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancelar
        </Button>
      </Stack>
    </Stack>
  );
}