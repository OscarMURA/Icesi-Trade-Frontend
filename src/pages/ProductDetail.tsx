import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Skeleton,
  Fade,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Refresh,
  Error,
} from '@mui/icons-material';
import { getProductById } from '../api/productApi';
import { Product } from '../types/productTypes';
import ProductImageGallery from '../components/products/ProductImageGallery';
import ProductDetailsInfo from '../components/products/ProductDetailsInfo';
import ProductOfferModal from '../components/products/ProductOfferModal';
import { useChat } from '../contexts/ChatContext';
import useAuth from '../hooks/useAuth';

// Componente de esqueleto para carga
const ProductDetailSkeleton = () => (
  <Container maxWidth="xl" sx={{ py: 4 }}>
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
      {/* Columna de imagen */}
      <Box sx={{ flex: { lg: '0 0 50%' } }}>
        <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 3 }} />
      </Box>
      
      {/* Columna de información */}
      <Box sx={{ flex: { lg: '0 0 50%' } }}>
        <Stack spacing={3}>
          <Skeleton variant="text" height={60} />
          <Skeleton variant="text" height={40} width="60%" />
          <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="text" height={24} />
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
        </Stack>
      </Box>
    </Box>
  </Container>
);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedUser, setInputMessage } = useChat();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const productData = await getProductById(parseInt(id));
        setProduct(productData);
      } catch (err: any) {
        console.error('Error al cargar el producto:', err);
        setError(
          err.response?.status === 404 
            ? 'El producto no fue encontrado.' 
            : 'Error al cargar el producto. Por favor, intenta nuevamente.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleContactSeller = () => {
    if (!product || !user) return;
    
    setSelectedUser(product.sellerId);
    if (setInputMessage) {
      setInputMessage(`Hola, me interesa tu producto: ${product.title}`);
    }
    navigate('/g1/losbandalos/Icesi-Trade/chat');
  };

  const handleMakeOffer = () => {
    if (!user) {
      // Redirigir al login si no está autenticado
      navigate('/g1/losbandalos/Icesi-Trade/login');
      return;
    }
    setShowOfferModal(true);
  };

  const handleOfferSubmitted = () => {
    // Aquí podrías actualizar el estado del producto si es necesario
    console.log('Oferta enviada exitosamente');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Error sx={{ fontSize: 64, color: 'error.main', mb: 3 }} />
            <Typography variant="h4" fontWeight={600} gutterBottom color="text.primary">
              {error || 'Producto no encontrado'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              No pudimos cargar la información del producto solicitado.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleGoBack}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Volver
              </Button>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Reintentar
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
       

        {/* Botón de volver */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{
              borderRadius: 2,
              px: 3,
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.main',
                color: 'white',
              },
            }}
          >
            Volver
          </Button>
        </Box>

        {/* Contenido principal */}
        <Fade in timeout={800}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
            {/* Columna de imagen */}
            <Box sx={{ flex: { lg: '0 0 50%' } }}>
              <ProductImageGallery
                imageUrl={product.imageUrl}
                title={product.title}
                status={product.status}
                price={product.price}
              />
            </Box>
            
            {/* Columna de información */}
            <Box sx={{ flex: { lg: '0 0 50%' } }}>
              <ProductDetailsInfo
                product={product}
                onContactSeller={handleContactSeller}
                onMakeOffer={handleMakeOffer}
              />
            </Box>
          </Box>
        </Fade>

        {/* Botón flotante de actualización */}
        <Tooltip title="Actualizar página">
          <IconButton
            onClick={handleRefresh}
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
            <Refresh />
          </IconButton>
        </Tooltip>
      </Container>

      {/* Modal de oferta */}
      <ProductOfferModal
        open={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        product={product}
        onOfferSubmitted={handleOfferSubmitted}
      />
    </>
  );
}