import { useState, useEffect } from 'react';
import { getProductBySellerId } from '../api/productApi';
import type { Product } from '../types/productTypes';
import { getIdFromToken } from '../api/userServices';
import ProductCard from '../components/products/ProductCard';
import {
  Box,
  Typography,
  Container,
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
  Tabs,
  Tab,
  Button
} from '@mui/material';
import {
  StorefrontOutlined,
  CheckCircleRounded,
  RefreshRounded,
  InventoryOutlined,
  AttachMoneyRounded,
  PendingActionsOutlined,
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
const EmptyState = ({ 
  onRefresh, 
  isSold = false 
}: { 
  onRefresh: () => void; 
  isSold?: boolean; 
}) => (
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
          background: isSold 
            ? 'linear-gradient(135deg, #e8f5e8 0%, #f3e5f5 100%)'
            : 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 3,
        }}
      >
        {isSold ? (
          <CheckCircleRounded sx={{ fontSize: 48, color: '#4caf50' }} />
        ) : (
          <InventoryOutlined sx={{ fontSize: 48, color: 'primary.main' }} />
        )}
      </Box>
      <Typography variant="h5" fontWeight={600} gutterBottom color="text.primary">
        {isSold ? 'No tienes productos vendidos' : 'No tienes productos activos'}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
        {isSold 
          ? 'Cuando vendas tu primer producto, aparecerá aquí con todas las estadísticas de venta.'
          : 'Cuando publiques productos para vender, aparecerán aquí para gestionar ofertas y ventas.'
        }
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

// Componente de estadísticas
const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  bgColor 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string; 
  bgColor: string; 
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: 3,
      background: `linear-gradient(135deg, ${bgColor} 0%, #ffffff 100%)`,
      border: `1px solid ${color}20`,
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={700} sx={{ color }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

// Interface para las pestañas
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`products-tabpanel-${index}`}
      aria-labelledby={`products-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function MyProducts() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalProducts: 0,
    soldProducts: 0,
    activeProducts: 0,
    totalEarnings: 0,
  });

  const sellerId = getIdFromToken();

  const fetchProducts = async () => {
    if (!sellerId) {
      setError("No se pudo obtener el ID del vendedor");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const products = await getProductBySellerId(sellerId);
      setAllProducts(products);

      // Calcular estadísticas
      const soldProducts = products.filter(p => p.isSold);
      const activeProducts = products.filter(p => !p.isSold);
      const totalEarnings = soldProducts.reduce((sum, product) => sum + (product.price || 0), 0);

      setStats({
        totalProducts: products.length,
        soldProducts: soldProducts.length,
        activeProducts: activeProducts.length,
        totalEarnings,
      });

    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar los productos. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sellerId]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filtrar productos según la pestaña activa
  const getFilteredProducts = () => {
    switch (tabValue) {
      case 0: // Activos
        return allProducts.filter(p => !p.isSold);
      case 1: // Vendidos
        return allProducts.filter(p => p.isSold);
      default:
        return allProducts.filter(p => !p.isSold);
    }
  };

  const filteredProducts = getFilteredProducts();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header con gradiente */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
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
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpolygon points="30 0 60 30 30 60 0 30"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
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
            <StorefrontOutlined sx={{ fontSize: 40 }} />
          </Box>
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
              Mis Productos
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Gestiona todos tus productos activos y ventas realizadas
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Estadísticas */}
      {!isLoading && allProducts.length > 0 && (
        <Fade in timeout={400}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 3, 
            mb: 4 
          }}>
            <Box>
              <StatsCard
                title="Total productos"
                value={stats.totalProducts}
                icon={<InventoryOutlined sx={{ color: 'white' }} />}
                color="#2196f3"
                bgColor="#e3f2fd"
              />
            </Box>

            <Box>
              <StatsCard
                title="Productos activos"
                value={stats.activeProducts}
                icon={<PendingActionsOutlined sx={{ color: 'white' }} />}
                color="#ff9800"
                bgColor="#fff3e0"
              />
            </Box>

            <Box>
              <StatsCard
                title="Productos vendidos"
                value={stats.soldProducts}
                icon={<CheckCircleRounded sx={{ color: 'white' }} />}
                color="#4caf50"
                bgColor="#e8f5e8"
              />
            </Box>

            <Box>
              <StatsCard
                title="Total ganado"
                value={`$${stats.totalEarnings.toLocaleString()}`}
                icon={<AttachMoneyRounded sx={{ color: 'white' }} />}
                color="#9c27b0"
                bgColor="#f3e5f5"
              />
            </Box>
          </Box>
        </Fade>
      )}

      {/* Barra de progreso de carga */}
      {isLoading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress 
            sx={{ 
              borderRadius: 2, 
              height: 6,
              bgcolor: 'rgba(25, 118, 210, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#1976d2',
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
            <Button color="inherit" size="small" onClick={fetchProducts}>
              Reintentar
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Pestañas de filtrado */}
      {!isLoading && allProducts.length > 0 && (
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            centered
            sx={{ 
              px: 2,
              '& .MuiTab-root': {
                minHeight: 60,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
              }
            }}
          >
            <Tab 
              label={`Activos (${stats.activeProducts})`} 
              icon={<PendingActionsOutlined />}
              iconPosition="start"
            />
            <Tab 
              label={`Vendidos (${stats.soldProducts})`} 
              icon={<CheckCircleRounded />}
              iconPosition="start"
            />
          </Tabs>
        </Paper>
      )}

      {/* Contenido de las pestañas */}
      <TabPanel value={tabValue} index={0}>
        {isLoading ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }, 
            gap: 3 
          }}>
            {[...Array(8)].map((_, index) => (
              <Box key={index}>
                <ProductSkeleton />
              </Box>
            ))}
          </Box>
        ) : filteredProducts.length === 0 ? (
          <EmptyState onRefresh={fetchProducts} isSold={false} />
        ) : (
          <Fade in timeout={600}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(4, 1fr)' 
              }, 
              gap: 3,
              justifyContent: 'center',
              alignItems: 'stretch'
            }}>
              {filteredProducts.map((product, index) => (
                <Box key={product.id}>
                  <Fade in timeout={300 + index * 100}>
                    <Box>
                      <ProductCard product={product} />
                    </Box>
                  </Fade>
                </Box>
              ))}
            </Box>
          </Fade>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {filteredProducts.length === 0 ? (
          <EmptyState onRefresh={fetchProducts} isSold={true} />
        ) : (
          <Fade in timeout={600}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(2, 1fr)', 
                md: 'repeat(3, 1fr)', 
                lg: 'repeat(4, 1fr)' 
              }, 
              gap: 3,
              justifyContent: 'center',
              alignItems: 'stretch'
            }}>
              {filteredProducts.map((product, index) => (
                <Box key={product.id}>
                  <Fade in timeout={300 + index * 100}>
                    <Box>
                      <ProductCard product={product} hideOffersAndEdit />
                    </Box>
                  </Fade>
                </Box>
              ))}
            </Box>
          </Fade>
        )}
      </TabPanel>

      {/* Botón flotante de actualización */}
      {!isLoading && (
        <Tooltip title="Actualizar productos">
          <IconButton
            onClick={fetchProducts}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              bgcolor: '#1976d2',
              color: 'white',
              boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)',
              '&:hover': {
                bgcolor: '#1565c0',
                boxShadow: '0 12px 32px rgba(25, 118, 210, 0.4)',
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