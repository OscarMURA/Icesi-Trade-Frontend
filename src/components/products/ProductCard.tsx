import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavoriteProductsByUser, toggleFavoriteProduct } from '../../api/favoriteApi';
import { deleteProduct, markProductAsSold, updateProduct } from '../../api/productApi';
import { createSale } from '../../api/salesApi';
import { getIdFromToken } from '../../api/userServices';
import useAuth from '../../hooks/useAuth';
import { Product } from '../../types/productTypes';
import ProductEditForm from './ProductEditForm';
import ProductInfo from './ProductInfo';
import { SaleCreate } from '../../types/saleTypes';
import ProductOffers from './ProductOffers';
import {
  Button,
  Card,
  CardContent,
  TextField,
  Stack,
  Box,
  Typography,
  Fade,
  Paper,
} from '@mui/material';
import { 
  ChatBubbleOutline, 
  Send,
  VisibilityOutlined,
} from '@mui/icons-material';
import { useChat } from '../../contexts/ChatContext';
import { addNotification } from '../../api/notificationApi';

export default function ProductCard({
  product,
  hideOffersAndEdit,
}: {
  product: Product;
  hideOffersAndEdit?: boolean;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedUser, setInputMessage } = useChat();

  const [editing, setEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const [showOffers, setShowOffers] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOwner = user && product.sellerId === getIdFromToken();

  // --- Toda la lógica funcional se mantiene intacta ---
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const favorites = await getFavoriteProductsByUser();
        const found = favorites.some((fav) => fav.productId === product.id);
        setIsFavorite(found);
      } catch (err) {
        console.error('Error al cargar favoritos', err);
      }
    };
    fetchFavorites();
  }, [product.id, user]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleUpdate = async (updated: Product) => {
    try {
      await updateProduct(product.id, updated);
      alert('Producto actualizado exitosamente.');
      setEditing(false);
    } catch (err) {
      alert('Error al actualizar el producto.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await deleteProduct(product.id);
      alert("Producto eliminado exitosamente.");
      window.location.reload();
    } catch (err: any) {
      if (err.response?.status === 500) {
        alert("No se pudo eliminar el producto. Puede que tenga ventas asociadas o un error interno del servidor.");
      } else {
        alert("Error al eliminar el producto.");
      }
      console.error(err);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await markProductAsSold(product.id);
      alert('Producto marcado como vendido.');
      window.location.reload();
    } catch (err) {
      alert('Error al marcar como vendido.');
      console.error(err);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavoriteProduct({ userId: getIdFromToken(), productId: product.id });
      setIsFavorite((prev) => !prev);
    } catch (err) {
      alert('Error al actualizar favorito.');
      console.error(err);
    }
  };

  const handleSendOffer = async () => {
    if (!offerPrice || isNaN(Number(offerPrice))) {
      alert('Por favor ingresa un precio válido.');
      return;
    }
    const offer: SaleCreate = {
      buyerId: getIdFromToken(),
      productId: product.id,
      price: parseFloat(offerPrice),
      status: 'pending',
    };
    try {
      await createSale(offer);
      alert("Oferta enviada exitosamente.");
      setOfferPrice('');
      await addNotification({
        createdAt: new Date().toISOString(),
        typeId: 3,
        read: false,
        userId: product.sellerId,
        message: `Has recibido una nueva oferta para tu producto: ${product.title}`,
      });
    } catch (err: any) {
      console.error("Error al enviar oferta:", err.response?.data || err.message);
      alert("Error al enviar oferta.");
    }
  };

  const handleChatClick = () => {
    if (isOwner) return;
    setSelectedUser(product.sellerId);
    if (setInputMessage) {
      setInputMessage(`Buenas, ¿cómo estás? Me interesa este producto: ${product.title}`);
    }
    navigate('/g1/losbandalos/Icesi-Trade/chat');
  };

  return (
    <Fade in timeout={300}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: isHovered ? 'primary.main' : 'divider',
          boxShadow: isHovered 
            ? '0 12px 28px rgba(106, 27, 154, 0.15)' 
            : '0 4px 12px rgba(0,0,0,0.08)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }
        }}
      >
        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: 0,
          '&:last-child': { pb: 0 }
        }}>
          {!editing ? (
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <ProductInfo
                product={product}
                onEdit={isOwner && !hideOffersAndEdit ? handleEdit : undefined}
                onDelete={isOwner ? handleDelete : undefined}
                onMarkAsSold={isOwner && !product.isSold ? handleMarkAsSold : undefined}
                onToggleFavorite={!isOwner && user ? handleToggleFavorite : undefined}
                isFavorite={isFavorite}
                showFavorite={!isOwner && !!user}
              />

              {/* Sección de acciones con fondo diferenciado */}
              {(!isOwner || isOwner) && !hideOffersAndEdit && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    bgcolor: 'rgba(106, 27, 154, 0.02)',
                    p: 2.5,
                    mt: 'auto'
                  }}
                >
                  <Stack spacing={2}>
                    {/* Enviar oferta */}
                    {!isOwner && user && !hideOffersAndEdit && (
                      <Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          💰 Haz tu oferta
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="stretch">
                          <TextField
                            fullWidth
                            type="number"
                            placeholder="Ej: 50000"
                            size="small"
                            variant="outlined"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                            }}
                            InputProps={{
                              startAdornment: (
                                <Box component="span" sx={{ color: 'text.secondary', mr: 1 }}>
                                  $
                                </Box>
                              ),
                            }}
                          />
                          <Button 
                            variant="contained" 
                            onClick={handleSendOffer}
                            size="small"
                            sx={{ 
                              minWidth: 48,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                              boxShadow: '0 4px 12px rgba(106, 27, 154, 0.3)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 100%)',
                                boxShadow: '0 6px 16px rgba(106, 27, 154, 0.4)',
                              }
                            }}
                          >
                            <Send fontSize="small" />
                          </Button>
                        </Stack>
                      </Box>
                    )}

                    {/* Ver ofertas (para el propietario) */}
                    {isOwner && !hideOffersAndEdit && (
                      <Button 
                        variant="outlined" 
                        onClick={() => setShowOffers(true)}
                        startIcon={<VisibilityOutlined />}
                        fullWidth
                        sx={{ 
                          borderRadius: 2,
                          borderColor: 'primary.main',
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderColor: 'primary.main',
                          }
                        }}
                      >
                        Ver ofertas recibidas
                      </Button>
                    )}

                    {/* Botón de chat */}
                    {!product.isSold && user && !isOwner && (
                      <Button
                        variant="contained"
                        startIcon={<ChatBubbleOutline />}
                        onClick={handleChatClick}
                        fullWidth
                        size="large"
                        sx={{ 
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
                          boxShadow: '0 4px 12px rgba(63, 81, 181, 0.3)',
                          py: 1.5,
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #303f9f 0%, #3949ab 100%)',
                            boxShadow: '0 6px 16px rgba(63, 81, 181, 0.4)',
                          }
                        }}
                      >
                        Chatear con vendedor
                      </Button>
                    )}
                  </Stack>
                </Paper>
              )}

              {/* Modal de ofertas */}
              {showOffers && (
                <ProductOffers
                  productId={product.id}
                  onClose={() => setShowOffers(false)}
                />
              )}
            </Box>
          ) : (
            <Box sx={{ p: 2.5 }}>
              <ProductEditForm
                product={product}
                onCancel={handleCancel}
                onUpdate={handleUpdate}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
}