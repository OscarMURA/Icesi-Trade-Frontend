import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Fade,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  Person,
  Category as CategoryIcon,
  Star,
  Favorite,
  FavoriteBorder,
  Share,
  Visibility,
  TrendingUp,
  LocalOffer,
  AccountCircle,
} from '@mui/icons-material';
import { Product } from '../../types/productTypes';
import { getFavoriteProductsByUser, toggleFavoriteProduct } from '../../api/favoriteApi';
import { getIdFromToken, getUserById } from '../../api/userServices';
import useAuth from '../../hooks/useAuth';
import { UserResponseDto } from '../../types/userTypes';
import { getCategories } from '../../api/categoryApi';
import { Category } from '../../types/categoryTypes';

interface ProductDetailsInfoProps {
  product: Product;
  onContactSeller?: () => void;
  onMakeOffer?: () => void;
}

export default function ProductDetailsInfo({
  product,
  onContactSeller,
  onMakeOffer,
}: ProductDetailsInfoProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sellerName, setSellerName] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const isOwner = user && product.sellerId === getIdFromToken();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const favorites = await getFavoriteProductsByUser();
        const found = favorites.some((fav) => fav.productId === product.id);
        setIsFavorite(found);
      } catch (err) {
        console.error('Error al cargar favoritos', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();

    // Obtener nombre del vendedor
    const fetchSeller = async () => {
      try {
        const user: UserResponseDto = await getUserById(product.sellerId);
        setSellerName(user.name);
      } catch  {
        setSellerName('Vendedor');
      }
    };
    fetchSeller();
  }, [product.id, user, product.sellerId]);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavoriteProduct({ userId: getIdFromToken(), productId: product.id });
      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error('Error al actualizar favorito:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Aquí podrías mostrar un toast de confirmación
    }
  };

  const handleViewSellerProfile = () => {
    navigate(`/user/${product.sellerId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'success';
      case 'good':
        return 'warning';
      case 'fair':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'excellent':
        return 'Excelente';
      case 'good':
        return 'Bueno';
      case 'fair':
        return 'Regular';
      default:
        return status;
    }
  };

  return (
    <Fade in timeout={600}>
      <Stack spacing={3}>
        {/* Header con título y precio */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                ${product.price.toLocaleString()}
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <Tooltip title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                <IconButton
                  onClick={handleToggleFavorite}
                  disabled={isLoading}
                  sx={{
                    bgcolor: isFavorite ? 'error.main' : 'grey.100',
                    color: isFavorite ? 'white' : 'grey.700',
                    '&:hover': {
                      bgcolor: isFavorite ? 'error.dark' : 'grey.200',
                    },
                  }}
                >
                  {isFavorite ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Compartir">
                <IconButton
                  onClick={handleShare}
                  sx={{
                    bgcolor: 'grey.100',
                    color: 'grey.700',
                    '&:hover': {
                      bgcolor: 'grey.200',
                    },
                  }}
                >
                  <Share />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* Estado del producto */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)',
            border: '1px solid #4caf5020',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Chip
              icon={<Star />}
              label={getStatusLabel(product.status)}
              color={getStatusColor(product.status) as any}
              sx={{ fontWeight: 600 }}
            />
            <Typography variant="body1" color="text.secondary">
              Estado del producto
            </Typography>
          </Stack>
        </Paper>

        {/* Descripción */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
            Descripción
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {product.description || 'No hay descripción disponible para este producto.'}
          </Typography>
        </Paper>

        {/* Información adicional */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: { md: '0 0 50%' } }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                border: '1px solid #2196f320',
                height: '100%',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Información del producto
                </Typography>
                
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <LocationOn color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Ubicación
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {product.location}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CategoryIcon color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Categoría
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {categories.length > 0
                          ? categories.find((cat) => cat.id === product.categoryId)?.name || `ID: ${product.categoryId}`
                          : `ID: ${product.categoryId}`}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <CalendarToday color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Publicado el
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {formatDate(product.createdAt)}
                      </Typography>
                    </Box>
                  </Stack>
                  
                  {product.updatedAt !== product.createdAt && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <TrendingUp color="primary" />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Última actualización
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {formatDate(product.updatedAt)}
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Paper>
          </Box>
          
          <Box sx={{ flex: { md: '0 0 50%' } }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
                border: '1px solid #ff980020',
                height: '100%',
              }}
            >
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Información del vendedor
                </Typography>
                
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Person color="primary" />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Vendedor
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {sellerName}
                    </Typography>
                  </Box>
                  <Tooltip title="Ver perfil del vendedor">
                    <IconButton
                      onClick={handleViewSellerProfile}
                      size="small"
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Visibility color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Estado de venta
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {product.isSold ? 'Vendido' : 'Disponible'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        </Box>

        {/* Acciones */}
        {!isOwner && !product.isSold && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
              Acciones
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LocalOffer />}
                onClick={onMakeOffer}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #f57c00 0%, #ffb300 100%)',
                  },
                }}
              >
                Hacer oferta
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<Person />}
                onClick={onContactSeller}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    borderColor: 'primary.dark',
                    bgcolor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                Contactar vendedor
              </Button>
            </Stack>
          </Paper>
        )}

        {/* Alerta si el producto está vendido */}
        {product.isSold && (
          <Alert 
            severity="info" 
            sx={{ borderRadius: 2 }}
            icon={<Visibility />}
          >
            Este producto ya ha sido vendido y no está disponible para compra.
          </Alert>
        )}
      </Stack>
    </Fade>
  );
} 