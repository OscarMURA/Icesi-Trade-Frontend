import { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import { Product } from '../types/productTypes';
import { getFavoriteProductsByUser } from '../api/favoriteApi';
import { getProductById } from '../api/productApi';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Skeleton,
  Fade,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Button
} from '@mui/material';
import {
  FavoriteRounded,
  RefreshRounded,
  HeartBrokenOutlined,
  TrendingUpRounded,
  LocalOfferRounded,
  ShoppingCartOutlined,
} from '@mui/icons-material';

// Componente de esqueleto para carga
const ProductSkeleton = () => (
  <Card sx={{ height: '100%', borderRadius: 3 }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" height={32} />
      <Skeleton variant="text" height={20} />
      <Skeleton variant="text" height={20} width="60%" />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" height={28} width="40%" />
      </Box>
    </CardContent>
  </Card>
);

// Componente de estado vacío
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <Fade in timeout={600}>
    <Paper
      elevation={0}
      sx={{
        textAlign: 'center',
        py: 8,
        px: 4,
        background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%',
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23e91e63" fill-opacity="0.05"%3E%3Cpath d="M30 0c16.569 0 30 13.431 30 30s-13.431 30-30 30S0 46.569 0 30 13.431 0 30 0zm0 7C17.85 7 8 16.85 8 29s9.85 22 22 22 22-9.85 22-22S42.15 7 30 7z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <HeartBrokenOutlined sx={{ fontSize: 48, color: '#e91e63' }} />
      </Box>
      <Typography variant="h5" fontWeight={600} gutterBottom color="text.primary" sx={{ position: 'relative', zIndex: 1 }}>
        No tienes productos favoritos aún
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto', position: 'relative', zIndex: 1 }}>
        Explora el catálogo y agrega productos a tus favoritos. Aquí aparecerán todos los productos que más te gusten.
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ position: 'relative', zIndex: 1 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCartOutlined />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
            boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4a148c 0%, #303f9f 100%)',
              boxShadow: '0 6px 16px rgba(106, 27, 154, 0.4)',
            }
          }}
        >
          Explorar productos
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshRounded />}
          onClick={onRefresh}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
          }}
        >
          Actualizar
        </Button>
      </Stack>
    </Paper>
  </Fade>
);

// Componente de estadísticas
const StatsSection = ({ totalFavorites, avgPrice }: { totalFavorites: number; avgPrice: number }) => (
  <Fade in timeout={400}>
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #fce4ec 0%, #ffffff 100%)',
            border: '1px solid #e91e6320',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: '#e91e63',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FavoriteRounded sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#e91e63">
                {totalFavorites}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Productos favoritos
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)',
            border: '1px solid #4caf5020',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: '#4caf50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUpRounded sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color="#4caf50">
                ${avgPrice.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Precio promedio
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Grid>
    </Grid>
  </Fade>
);

export default function MyFavoriteProducts() {
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    avgPrice: 0,
  });

  const fetchFavorites = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const favorites = await getFavoriteProductsByUser();
      const productPromises = favorites.map(fav => getProductById(fav.productId));
      const products = await Promise.all(productPromises);

      // Filtrar productos válidos
      const validProducts = products.filter(p => p && p.id);
      setListProducts(validProducts);

      // Calcular estadísticas
      const totalPrice = validProducts.reduce((sum, product) => sum + (product.price || 0), 0);
      const avgPrice = validProducts.length > 0 ? totalPrice / validProducts.length : 0;

      setStats({
        totalFavorites: validProducts.length,
        avgPrice: Math.round(avgPrice),
      });

    } catch (err) {
      console.error("Error al cargar productos favoritos", err);
      setError('Error al cargar tus productos favoritos. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con gradiente mejorado */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M30 15c8.284 0 15 6.716 15 15s-6.716 15-15 15-15-6.716-15-15 6.716-15 15-15zm0 2c-7.18 0-13 5.82-13 13s5.82 13 13 13 13-5.82 13-13-5.82-13-13-13z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <FavoriteRounded sx={{ fontSize: 40 }} />
          </Box>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
              Mis Favoritos
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Todos los productos que has guardado como favoritos
            </Typography>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <LocalOfferRounded sx={{ fontSize: 32, opacity: 0.8 }} />
          </Box>
        </Stack>
      </Box>

      {/* Estadísticas */}
      {!isLoading && listProducts.length > 0 && (
        <StatsSection totalFavorites={stats.totalFavorites} avgPrice={stats.avgPrice} />
      )}

      {/* Barra de progreso de carga */}
      {isLoading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            sx={{ 
              borderRadius: 2, 
              height: 6,
              bgcolor: 'rgba(233, 30, 99, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#e91e63',
              }
            }} 
          />
        </Box>
      )}

      {/* Alerta de error */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4, borderRadius: 2 }}
          action={
            <Button color="inherit" size="small" onClick={fetchFavorites}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Contenido principal */}
      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <ProductSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : listProducts.length === 0 ? (
        <EmptyState onRefresh={fetchFavorites} />
      ) : (
        <Fade in timeout={600}>
          <Box>
            <ProductList products={listProducts} />
          </Box>
        </Fade>
      )}

      {/* Botón flotante de actualización */}
      {!isLoading && (
        <Tooltip title="Actualizar favoritos">
          <IconButton
            onClick={fetchFavorites}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: '#e91e63',
              color: 'white',
              boxShadow: '0 8px 24px rgba(233, 30, 99, 0.3)',
              '&:hover': {
                bgcolor: '#c2185b',
                boxShadow: '0 12px 32px rgba(233, 30, 99, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 1000,
            }}
          >
            <RefreshRounded />
          </IconButton>
        </Tooltip>
      )}
    </Container>
  );
}