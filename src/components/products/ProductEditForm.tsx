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
  Box,
  Paper,
  Avatar,
  IconButton,
  Fade,
  InputAdornment,
} from '@mui/material';
import {
  EditRounded,
  SaveRounded,
  CancelRounded,
  PhotoCameraRounded,
  AttachMoneyRounded,
  TitleRounded,
  DescriptionRounded,
  LabelRounded,
  ImageRounded,
  DeleteRounded,
} from '@mui/icons-material';
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

  const handleRemoveImage = () => {
    setImage(null);
    setPreview('');
    setForm({ ...form, imageUrl: '' });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      let imageUrl = form.imageUrl;

      if (image) {
        imageUrl = await uploadImage(image);
      } else if (!preview) {
        imageUrl = '';
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
    <Fade in timeout={300}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(106, 27, 154, 0.08)',
            p: 2.5,
            mb: 2,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <EditRounded />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c2c2c' }}>
              Editar Producto
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Modifica los detalles de tu producto
            </Typography>
          </Box>
        </Paper>

        {/* Form Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <Stack spacing={3}>
            {/* Imagen del producto */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageRounded color="primary" />
                Imagen del producto
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {preview && (
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={preview}
                      alt="Vista previa"
                      style={{ 
                        width: '120px', 
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: 12,
                        border: '2px solid #e0e0e0'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleRemoveImage}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: '#f44336',
                        color: 'white',
                        '&:hover': { bgcolor: '#d32f2f' },
                        boxShadow: 2
                      }}
                    >
                      <DeleteRounded fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCameraRounded />}
                  sx={{ 
                    borderRadius: 2,
                    borderStyle: 'dashed',
                    py: 1.5,
                    px: 3,
                    minHeight: preview ? 'auto' : '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  {preview ? 'Cambiar imagen' : 'Subir imagen'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                  {!preview && (
                    <Typography variant="caption" color="text.secondary">
                      JPG, PNG máx. 5MB
                    </Typography>
                  )}
                </Button>
              </Box>

              {product.imageUrl && !image && !preview && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Imagen actual: 
                  <Button 
                    size="small" 
                    onClick={() => setPreview(product.imageUrl || '')}
                    sx={{ ml: 1 }}
                  >
                    Ver imagen actual
                  </Button>
                </Typography>
              )}
            </Paper>

            {/* Información básica */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Información básica
              </Typography>
              
              <Stack spacing={2.5}>
                <TextField
                  name="title"
                  label="Título del producto"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TitleRounded color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  name="description"
                  label="Descripción"
                  value={form.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <DescriptionRounded color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    name="price"
                    label="Precio"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    sx={{ 
                      flex: '1 1 200px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AttachMoneyRounded color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControl sx={{ flex: '1 1 200px' }}>
                    <InputLabel>Estado del producto</InputLabel>
                    <Select
                      name="status"
                      value={form.status}
                      label="Estado del producto"
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      startAdornment={
                        <InputAdornment position="start">
                          <LabelRounded color="action" />
                        </InputAdornment>
                      }
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      <MenuItem value="Nuevo">🆕 Nuevo</MenuItem>
                      <MenuItem value="Seminuevo">✨ Seminuevo</MenuItem>
                      <MenuItem value="Usado">🔄 Usado</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>
            </Paper>

            {/* Error message */}
            {error && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: '#ffebee', 
                  border: '1px solid #f44336',
                  borderRadius: 2 
                }}
              >
                <Typography color="error" variant="body2">
                  ⚠️ {error}
                </Typography>
              </Paper>
            )}
          </Stack>
        </Box>

        {/* Footer con botones */}
        <Paper 
          elevation={0}
          sx={{ 
            bgcolor: 'rgba(0,0,0,0.02)',
            p: 2.5,
            mt: 2,
            borderRadius: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button 
              variant="outlined" 
              onClick={onCancel}
              startIcon={<CancelRounded />}
              disabled={loading}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                borderColor: '#757575',
                color: '#757575',
                '&:hover': {
                  borderColor: '#424242',
                  bgcolor: 'rgba(117, 117, 117, 0.04)'
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveRounded />}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1,
                background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
                  boxShadow: '0 6px 16px rgba(106, 27, 154, 0.4)',
                },
                '&:disabled': {
                  background: '#cccccc',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Fade>
  );
}