import { useState, useEffect } from "react";
import { getCategories } from "../api/categoryApi";
import { Category } from "../types/categoryTypes";
import { createProduct } from "../api/productApi";
import {  uploadMultipleImages } from "../api/uploadImage";
import { ProductCreateDto } from "../types/productTypes";
import { useNavigate } from "react-router-dom";

import { 
  Button, 
  TextField, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  CircularProgress, 
  Stack, 
  Typography,
  Box,
  Paper,
  Container,
  Fade,
  InputAdornment,
  IconButton,
  Avatar,
  Alert,
  Chip,
  Collapse,
  Link
} from '@mui/material';

import {
  AddCircleRounded,
  TitleRounded,
  DescriptionRounded,
  AttachMoneyRounded,
  LocationOnRounded,
  LabelRounded,
  CategoryRounded,
  PhotoCameraRounded,
  DeleteRounded,
  PublishRounded,
  ImageRounded,
  CheckCircleRounded,
  InfoRounded,
  ExpandLessRounded
} from '@mui/icons-material';

// Función para obtener el color del estado
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'nuevo':
      return { color: '#4caf50', bg: '#e8f5e8' };
    case 'seminuevo':
      return { color: '#ff9800', bg: '#fff3e0' };
    case 'usado':
      return { color: '#2196f3', bg: '#e3f2fd' };
    default:
      return { color: '#757575', bg: '#f5f5f5' };
  }
};

export default function CreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Omit<ProductCreateDto, 'sellerId'>>({
    title: "",
    description: "",
    status: "Nuevo",
    price: 0,
    location: "",
    categoryId: 0,
    imageUrl: "" 
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showImageHelp, setShowImageHelp] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError("Error cargando categorías"));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      
      // Verificar límite de 3 imágenes
      if (selectedFiles.length > 3) {
        setError("Máximo 3 imágenes permitidas.");
        return;
      }
      
      // Verificar tamaño de cada archivo (1MB = 1 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024; // 1MB
      for (const file of selectedFiles) {
        if (file.size > maxSize) {
          setError(`El archivo "${file.name}" es demasiado grande. Máximo 1MB permitido por imagen.`);
          setShowImageHelp(true);
          return;
        }
      }
      
      setImages(selectedFiles);
      setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
      setError(''); // Limpiar errores previos
      setShowImageHelp(false); // Ocultar ayuda
    }
  };



  const handleRemoveSingleImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    
    // Actualizar imageUrl si hay imágenes restantes
    if (newImages.length > 0) {
      const urls = newImages.map(img => URL.createObjectURL(img));
      setForm({ ...form, imageUrl: urls.join(',') });
    } else {
      setForm({ ...form, imageUrl: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const finalForm = { ...form, title: form.title.slice(0, 40) };
      
      if (images.length > 0) {
        // Subir múltiples imágenes de una vez
        const urls = await uploadMultipleImages(images);
        finalForm.imageUrl = urls.join(',');
      }

      const data = await createProduct(finalForm);
      console.log("Producto creado:", data);
      setSuccess(true);
      
      // Esperar un poco para mostrar el éxito y luego navegar
      setTimeout(() => {
        navigate('/my-products');
      }, 1500);
      
    } catch (error) {
      setError("Error al publicar el producto");
      console.error("Error al publicar:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = getStatusColor(form.status || 'Nuevo');

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
      <Fade in timeout={300}>
        <Box>
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              bgcolor: 'rgba(106, 27, 154, 0.08)',
              p: { xs: 2, sm: 3 },
              mb: 3,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap'
            }}
          >
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'white',
                width: { xs: 48, sm: 56 },
                height: { xs: 48, sm: 56 }
              }}
            >
              <AddCircleRounded fontSize="large" />
            </Avatar>
            <Box sx={{ flex: 1, minWidth: '200px' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#2c2c2c',
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Publicar Producto
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Comparte tu producto con la comunidad
              </Typography>
            </Box>
          </Paper>

          {/* Alertas */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<CheckCircleRounded fontSize="inherit" />}
            >
              ¡Producto publicado exitosamente! Redirigiendo...
            </Alert>
          )}

          {/* Ayuda de alivianadores de imágenes */}
          <Collapse in={showImageHelp}>
            <Paper 
              elevation={0}
              sx={{ 
                mb: 3, 
                p: 3, 
                borderRadius: 2, 
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                border: '1px solid',
                borderColor: 'primary.light'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <InfoRounded color="primary" />
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  ¿Necesitas reducir el tamaño de tu imagen?
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Puedes usar estos alivianadores de imágenes gratuitos para reducir el tamaño sin perder calidad. 
                Recuerda que puedes subir hasta 3 imágenes de máximo 1MB cada una:
              </Typography>
              
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip size="small" label="Online" color="primary" variant="outlined" />
                  <Link href="https://tinypng.com" target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>
                    TinyPNG
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    - Compresión inteligente para PNG y JPEG
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip size="small" label="Online" color="primary" variant="outlined" />
                  <Link href="https://compressor.io" target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>
                    Compressor.io
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    - Compresión avanzada con control de calidad
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip size="small" label="Online" color="primary" variant="outlined" />
                  <Link href="https://squoosh.app" target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>
                    Squoosh.app
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    - Herramienta de Google con comparación en tiempo real
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip size="small" label="App" color="secondary" variant="outlined" />
                  <Link href="https://imageoptim.com" target="_blank" rel="noopener" sx={{ fontWeight: 500 }}>
                    ImageOptim
                  </Link>
                  <Typography variant="caption" color="text.secondary">
                    - Aplicación de escritorio (Mac/Windows)
                  </Typography>
                </Box>
              </Stack>
              
              <Button
                size="small"
                onClick={() => setShowImageHelp(false)}
                sx={{ mt: 2 }}
                startIcon={<ExpandLessRounded />}
              >
                Ocultar ayuda
              </Button>
            </Paper>
          </Collapse>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              
              {/* Imagen del producto */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: 'divider',
                  background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1 
                  }}
                >
                  <ImageRounded color="primary" />
                  Imagen del producto
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2, 
                  flexWrap: 'wrap',
                  justifyContent: { xs: 'center', sm: 'flex-start' }
                }}>
                  {previews.map((preview, index) => (
                    <Box key={index} sx={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Vista previa ${index + 1}`}
                        style={{ 
                          width: '150px', 
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: 16,
                          border: '3px solid #e0e0e0',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveSingleImage(index)}
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
                  ))}
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<PhotoCameraRounded />}
                    sx={{ 
                      borderRadius: 2,
                      borderStyle: 'dashed',
                      py: 2,
                      px: 3,
                      minHeight: previews.length > 0 ? 'auto' : '150px',
                      minWidth: { xs: '100%', sm: '200px' },
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(106, 27, 154, 0.04)',
                        borderColor: 'primary.dark'
                      }
                    }}
                  >
                    {previews.length > 0 ? 'Cambiar imágenes' : 'Subir imágenes'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      hidden
                      multiple
                    />
                    {!previews.length && (
                      <Typography variant="caption" color="text.secondary">
                        JPG, PNG máx. 1MB cada una (máx. 3 imágenes)
                      </Typography>
                    )}
                  </Button>
                </Box>
              </Paper>

              {/* Información básica */}
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 3, 
                  border: '1px solid', 
                  borderColor: 'divider' 
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Información básica
                </Typography>
                
                <Stack spacing={3}>
                  <TextField
                    label="Título del producto"
                    name="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value.slice(0, 40) })}
                    fullWidth
                    variant="outlined"
                    required
                    inputProps={{ maxLength: 40 }}
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
                    label="Descripción detallada"
                    name="description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    required
                    placeholder="Describe las características, estado y detalles importantes..."
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

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2 
                  }}>
                    <TextField
                      label="Precio"
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      variant="outlined"
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoneyRounded color="action" />
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
                      label="Ubicación"
                      name="location"
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      variant="outlined"
                      required
                      placeholder="Ej: Cali, Valle del Cauca"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOnRounded color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2 
                  }}>
                    <FormControl variant="outlined">
                      <InputLabel>Estado del producto</InputLabel>
                      <Select
                        name="status"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        required
                        label="Estado del producto"
                        startAdornment={
                          <InputAdornment position="start">
                            <LabelRounded color="action" />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        <MenuItem value="Nuevo">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            🆕 Nuevo
                            <Chip 
                              size="small" 
                              label="Nuevo" 
                              sx={{ 
                                bgcolor: '#e8f5e8', 
                                color: '#4caf50',
                                fontSize: '0.7rem'
                              }} 
                            />
                          </Box>
                        </MenuItem>
                        <MenuItem value="Seminuevo">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            ✨ Seminuevo
                            <Chip 
                              size="small" 
                              label="Seminuevo" 
                              sx={{ 
                                bgcolor: '#fff3e0', 
                                color: '#ff9800',
                                fontSize: '0.7rem'
                              }} 
                            />
                          </Box>
                        </MenuItem>
                        <MenuItem value="Usado">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            🔄 Usado
                            <Chip 
                              size="small" 
                              label="Usado" 
                              sx={{ 
                                bgcolor: '#e3f2fd', 
                                color: '#2196f3',
                                fontSize: '0.7rem'
                              }} 
                            />
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl variant="outlined">
                      <InputLabel>Categoría</InputLabel>
                      <Select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
                        required
                        label="Categoría"
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryRounded color="action" />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        <MenuItem value={0} disabled>
                          Selecciona una categoría
                        </MenuItem>
                        {categories.map((cat) => (
                          <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Stack>
              </Paper>

              {/* Vista previa del estado seleccionado */}
              {form.status && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    borderRadius: 2, 
                    bgcolor: statusColors.bg,
                    border: `1px solid ${statusColors.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Estado seleccionado:
                  </Typography>
                  <Chip
                    label={form.status}
                    size="small"
                    sx={{
                      bgcolor: statusColors.bg,
                      color: statusColors.color,
                      fontWeight: 600,
                      border: `1px solid ${statusColors.color}`,
                    }}
                  />
                </Paper>
              )}

              {/* Botón de envío */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 2, sm: 3 },
                  borderRadius: 3,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || success}
                  fullWidth
                  size="large"
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : success ? (
                      <CheckCircleRounded />
                    ) : (
                      <PublishRounded />
                    )
                  }
                  sx={{ 
                    py: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    background: success 
                      ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                      : 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                    boxShadow: success 
                      ? '0 4px 12px rgba(76, 175, 80, 0.3)'
                      : '0 4px 12px rgba(106, 27, 154, 0.3)',
                    '&:hover': {
                      background: success
                        ? 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)'
                        : 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
                      boxShadow: success
                        ? '0 6px 16px rgba(76, 175, 80, 0.4)'
                        : '0 6px 16px rgba(106, 27, 154, 0.4)',
                    },
                    '&:disabled': {
                      background: '#cccccc',
                      boxShadow: 'none'
                    }
                  }}
                >
                  {loading 
                    ? 'Publicando producto...' 
                    : success 
                      ? '¡Producto publicado!' 
                      : 'Publicar producto'
                  }
                </Button>
              </Paper>
            </Stack>
          </form>
        </Box>
      </Fade>
    </Container>
  );
}