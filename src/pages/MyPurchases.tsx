import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { getIdFromToken, getToken } from '../api/userServices';
import ProductCard from '../components/products/ProductCard';
import { Product } from '../types/productTypes';
import { Review } from '../types/reviewTypes';
import ReviewDialog from '../components/ReviewDialog';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Skeleton,
  Fade,
  Chip,
  Stack,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  ShoppingBagOutlined,
  StarRounded,
  CheckCircleRounded,
  RefreshRounded,
  TrendingUpRounded,
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
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        <ShoppingBagOutlined sx={{ fontSize: 48, color: 'primary.main' }} />
      </Box>
      <Typography variant="h5" fontWeight={600} gutterBottom color="text.primary">
        No tienes compras registradas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
        Cuando realices tu primera compra, aparecerá aquí para que puedas hacer seguimiento y dejar reseñas.
      </Typography>
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
    </Paper>
  </Fade>
);

// Componente principal mejorado
export default function MyPurchases() {
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<number>>(new Set());
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalPurchases: 0,
    totalSpent: 0,
    pendingReviews: 0,
  });

  const buyerId = getIdFromToken();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Obtener ventas del comprador
      const salesRes = await axios.get(`/api/sales/buyer/${buyerId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const acceptedSales = salesRes.data.filter((sale: any) => sale.status === 'accepted');
      const productIds = acceptedSales.map((sale: any) => sale.productId).filter(Boolean);

      // Obtener productos
      const productRequests = productIds.map((id: number) =>
        axios.get(`/api/products/${id}`).then((res) => res.data).catch(() => null)
      );

      const products = (await Promise.all(productRequests)).filter((p) => p && p.id);
      setPurchasedProducts(products);

      // Obtener reviews existentes
      const reviewsRes = await axios.get(`/api/reviews?reviewerId=${buyerId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const reviewedIds = new Set<number>(
        reviewsRes.data.map((review: Review) => review.productId)
      );
      setReviewedProductIds(reviewedIds);

      // Calcular estadísticas
      const totalSpent = acceptedSales.reduce((sum: number, sale: any) => sum + (sale.price || 0), 0);
      const pendingReviews = products.filter(p => !reviewedIds.has(p.id)).length;
      
      setStats({
        totalPurchases: products.length,
        totalSpent,
        pendingReviews,
      });

    } catch (error) {
      console.error('Error al cargar compras:', error);
      setError('Error al cargar las compras. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [buyerId]);

  const handleOpen = (productId: number) => {
    setOpenDialogs((prev) => ({ ...prev, [productId]: true }));
  };

  const handleClose = (productId: number) => {
    setOpenDialogs((prev) => ({ ...prev, [productId]: false }));
  };

  const handleReviewSubmitted = (productId: number) => {
    setReviewedProductIds(prev => new Set([...prev, productId]));
    setStats(prev => ({ ...prev, pendingReviews: prev.pendingReviews - 1 }));
    handleClose(productId);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con gradiente */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
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
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
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
            <ShoppingBagOutlined sx={{ fontSize: 40 }} />
          </Box>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
              Mis Compras
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Gestiona y revisa todos tus productos adquiridos
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Estadísticas */}
      {!isLoading && purchasedProducts.length > 0 && (
        <Fade in timeout={400}>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
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
                    <CheckCircleRounded sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="#4caf50">
                      {stats.totalPurchases}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total de compras
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                  border: '1px solid #2196f320',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#2196f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUpRounded sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="#2196f3">
                      ${stats.totalSpent.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total gastado
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
                  border: '1px solid #ff980020',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: '#ff9800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <StarRounded sx={{ color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="h4" fontWeight={700} color="#ff9800">
                      {stats.pendingReviews}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pendientes de reseña
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Barra de progreso de carga */}
      {isLoading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            sx={{ 
              borderRadius: 2, 
              height: 6,
              bgcolor: 'rgba(106, 27, 154, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
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
            <Button color="inherit" size="small" onClick={fetchData}>
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
      ) : purchasedProducts.length === 0 ? (
        <EmptyState onRefresh={fetchData} />
      ) : (
        <Fade in timeout={600}>
          <Grid container spacing={3}>
            {purchasedProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Fade in timeout={300 + index * 100}>
                  <Box>
                    <ProductCard product={product} hideOffersAndEdit />
                    
                    {/* Botón de calificación mejorado */}
                    {!reviewedProductIds.has(product.id) ? (
                      <Box sx={{ mt: 2 }}>
                        <Button
                          variant="contained"
                          fullWidth
                          size="large"
                          onClick={() => handleOpen(product.id)}
                          startIcon={<StarRounded />}
                          sx={{
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                            py: 1.5,
                            fontWeight: 600,
                            '&:hover': {
                              background: 'linear-gradient(135deg, #f57c00 0%, #ffb300 100%)',
                              boxShadow: '0 6px 16px rgba(255, 152, 0, 0.4)',
                            }
                          }}
                        >
                          Calificar producto
                        </Button>
                        <ReviewDialog
                          open={openDialogs[product.id] || false}
                          onClose={() => handleClose(product.id)}
                          productId={product.id}
                          revieweeId={product.sellerId}
                          onReviewSubmitted={() => handleReviewSubmitted(product.id)}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          icon={<CheckCircleRounded />}
                          label="Ya calificado"
                          color="success"
                          variant="outlined"
                          sx={{
                            width: '100%',
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}

      {/* Botón flotante de actualización */}
      {!isLoading && (
        <Tooltip title="Actualizar compras">
          <IconButton
            onClick={fetchData}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: 'primary.main',
              color: 'white',
              boxShadow: '0 8px 24px rgba(106, 27, 154, 0.3)',
              '&:hover': {
                bgcolor: 'primary.dark',
                boxShadow: '0 12px 32px rgba(106, 27, 154, 0.4)',
              },
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