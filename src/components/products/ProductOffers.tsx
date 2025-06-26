import { useEffect, useState } from 'react';
import { Sale } from '../../types/saleTypes';
import axios from '../../api/axiosConfig';
import { getToken, getUserById } from '../../api/userServices';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Fade,
  Avatar,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as AcceptIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  CalendarToday as DateIcon,
  AttachMoney as MoneyIcon,
  LocalOffer as OfferIcon,
} from '@mui/icons-material';

interface ProductOffersProps {
  productId: number;
  onClose: () => void;
}

export default function ProductOffers({ productId, onClose }: ProductOffersProps) {
  const [offers, setOffers] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [buyerNames, setBuyerNames] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchOffers();
  }, [productId]);

  useEffect(() => {
    const fetchBuyerNames = async () => {
      const names: { [key: number]: string } = {};
      await Promise.all(
        offers.map(async (offer) => {
          const buyerId = offer.buyerId;
          if (buyerId && !names[buyerId]) {
            try {
              const user = await getUserById(buyerId);
              names[buyerId] = user?.name || `#${buyerId}`;
            } catch {
              names[buyerId] = `#${buyerId}`;
            }
          }
        })
      );
      setBuyerNames(names);
    };
    if (offers.length > 0) fetchBuyerNames();
  }, [offers]);

  const fetchOffers = async () => {
    try {
      const response = await axios.get(`/api/sales/product/${productId}/offers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setOffers(response.data);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId: number) => {
    setActionLoading(offerId);
    try {
      await axios.put(`/api/sales/${offerId}/accept`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      await fetchOffers();
    } catch (error) {
      console.error('Error al aceptar oferta:', error);
      alert('Error al aceptar la oferta');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectOffer = async (offerId: number) => {
    setActionLoading(offerId);
    try {
      await axios.put(`/api/sales/${offerId}/reject`, {}, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      await fetchOffers();
    } catch (error) {
      console.error('Error al rechazar oferta:', error);
      alert('Error al rechazar la oferta');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: '#fdfaff',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(45deg, #6a1b9a, #9c27b0)',
          color: 'white',
          position: 'relative',
          textAlign: 'center',
          py: 3
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <OfferIcon />
          <Typography variant="h5" fontWeight="bold">
            Ofertas Recibidas
          </Typography>
        </Box>
        
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress size={48} sx={{ color: '#6a1b9a' }} />
          </Box>
        ) : offers.length === 0 ? (
          <Fade in timeout={600}>
            <Box textAlign="center" py={8}>
              <OfferIcon sx={{ fontSize: 80, color: '#bdbdbd', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No hay ofertas pendientes
              </Typography>
              <Typography color="text.disabled">
                Las ofertas aparecerán aquí cuando los compradores muestren interés
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Stack spacing={2}>
            {offers.map((offer, index) => (
              <Fade key={offer.id} in timeout={600 + (index * 100)}>
                <Card
                  sx={{
                    border: '1px solid #ede7f6',
                    borderRadius: 3,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                          sx={{ 
                            bgcolor: '#6a1b9a', 
                            width: 32, 
                            height: 32,
                            fontSize: '0.9rem'
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="subtitle1" fontWeight="600">
                          {`Comprador: ${buyerNames[offer.buyerId] ?? 'Desconocido'}`}
                        </Typography>
                      </Box>
                      
                      <Chip
                        label={getStatusText(offer.status)}
                        color={getStatusColor(offer.status) as any}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    <Stack spacing={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <MoneyIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          ${offer.price.toLocaleString()}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={1}>
                        <DateIcon sx={{ color: '#757575', fontSize: 18 }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(offer.createdAt || '').toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>

                      {offer.status === 'pending' && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Stack direction="row" spacing={2}>
                            <Button
                              variant="contained"
                              startIcon={actionLoading === offer.id ? <CircularProgress size={16} color="inherit" /> : <AcceptIcon />}
                              onClick={() => handleAcceptOffer(offer.id)}
                              disabled={actionLoading === offer.id}
                              sx={{
                                bgcolor: '#4caf50',
                                '&:hover': { bgcolor: '#45a049' },
                                flex: 1
                              }}
                            >
                              Aceptar
                            </Button>
                            
                            <Button
                              variant="outlined"
                              startIcon={actionLoading === offer.id ? <CircularProgress size={16} color="inherit" /> : <RejectIcon />}
                              onClick={() => handleRejectOffer(offer.id)}
                              disabled={actionLoading === offer.id}
                              color="error"
                              sx={{ 
                                flex: 1,
                                '&:hover': { bgcolor: '#ffebee' }
                              }}
                            >
                              Rechazar
                            </Button>
                          </Stack>
                        </>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#6a1b9a',
            '&:hover': { bgcolor: '#4a148c' },
            borderRadius: 2,
            px: 4
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}