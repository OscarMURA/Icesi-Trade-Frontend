import { useState } from 'react';
import {
  Modal,
  Backdrop,
  Fade,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Close,
  LocalOffer,
  AttachMoney,
  Send,
  TrendingUp,
} from '@mui/icons-material';
import { Product } from '../../types/productTypes';
import { createSale } from '../../api/salesApi';
import { addNotification } from '../../api/notificationApi';
import { getIdFromToken } from '../../api/userServices';

interface ProductOfferModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onOfferSubmitted?: () => void;
}

export default function ProductOfferModal({
  open,
  onClose,
  product,
  onOfferSubmitted,
}: ProductOfferModalProps) {
  const [offerPrice, setOfferPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offerPrice || isNaN(Number(offerPrice))) {
      setError('Por favor ingresa un precio válido.');
      return;
    }

    const price = parseFloat(offerPrice);
    if (price <= 0) {
      setError('El precio debe ser mayor a 0.');
      return;
    }

    if (price >= product.price) {
      setError('La oferta debe ser menor al precio original.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const offer = {
        buyerId: getIdFromToken(),
        productId: product.id,
        price: price,
        status: 'pending',
      };

      await createSale(offer);
      
      // Enviar notificación al vendedor
      await addNotification({
        createdAt: new Date().toISOString(),
        typeId: 3,
        read: false,
        userId: product.sellerId,
        message: `Has recibido una nueva oferta de $${price.toLocaleString()} para tu producto: ${product.title}`,
      });

      setSuccess(true);
      setOfferPrice('');
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        onClose();
        setSuccess(false);
        if (onOfferSubmitted) {
          onOfferSubmitted();
        }
      }, 2000);

    } catch (err: any) {
      console.error('Error al enviar oferta:', err);
      setError(err.response?.data?.message || 'Error al enviar la oferta. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setOfferPrice('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  const getDiscountPercentage = () => {
    if (!offerPrice || isNaN(Number(offerPrice))) return 0;
    const price = parseFloat(offerPrice);
    return ((product.price - price) / product.price) * 100;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Fade in={open}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 500,
            width: '100%',
            borderRadius: 3,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: 24,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
              p: 3,
              color: 'white',
              position: 'relative',
            }}
          >
            <IconButton
              onClick={handleClose}
              disabled={isSubmitting}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'white',
              }}
            >
              <Close />
            </IconButton>
            
            <Stack direction="row" spacing={2} alignItems="center">
              <LocalOffer sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  Hacer oferta
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Propón un precio para este producto
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Contenido */}
          <Box sx={{ p: 4 }}>
            {/* Información del producto */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {product.title}
              </Typography>
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Precio original
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  ${product.price.toLocaleString()}
                </Typography>
              </Stack>
            </Paper>

            {/* Formulario de oferta */}
            <Stack spacing={3}>
              <TextField
                label="Tu oferta"
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                disabled={isSubmitting}
                InputProps={{
                  startAdornment: <AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                helperText="Ingresa un precio menor al original"
                error={!!error}
              />

              {/* Información de descuento */}
              {offerPrice && !isNaN(Number(offerPrice)) && parseFloat(offerPrice) > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)',
                    border: '1px solid #4caf5020',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TrendingUp color="success" />
                      <Typography variant="body2" color="text.secondary">
                        Descuento
                      </Typography>
                    </Stack>
                    <Chip
                      label={`${getDiscountPercentage().toFixed(1)}%`}
                      color="success"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                </Paper>
              )}

              {/* Mensajes de error/éxito */}
              {error && (
                <Alert severity="error" sx={{ borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  ¡Oferta enviada exitosamente! El vendedor será notificado.
                </Alert>
              )}

              {/* Botones */}
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    py: 1.5,
                  }}
                >
                  Cancelar
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting || !offerPrice || isNaN(Number(offerPrice))}
                  startIcon={<Send />}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f57c00 0%, #ffb300 100%)',
                    },
                    '&:disabled': {
                      background: 'grey.300',
                    },
                  }}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar oferta'}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
} 