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
  Box,        // Importado para un layout más flexible
  Divider,    // Importado para separación visual
} from '@mui/material';
import { 
  ChatBubbleOutline, 
  Send,       // Icono para "Enviar Oferta"
  VisibilityOutlined // Icono para "Ver Ofertas"
} from '@mui/icons-material';
import { useChat } from '../../contexts/ChatContext';
import { addNotification } from '../../api/notificationApi';

// Definimos el color principal para consistencia
const primaryActionColor = '#6a1b9a'; // Morado intenso
const primaryActionHoverColor = '#4a148c'; // Morado más oscuro para el hover

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
      navigate('/my-products');
    } catch (err: any) {
      alert("Error al eliminar el producto.");
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

  // --- El JSX es donde aplicamos todas las mejoras de estilo ---
  return (
    <Card
      sx={{
        bgcolor: '#fdfaff', // Un morado muy sutil, casi blanco
        borderRadius: 4,    // Bordes más redondeados
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Sombra más suave
        border: '1px solid #ede7f6' // Borde sutil del color del tema
      }}
    >
      {/* Usamos CardContent sin padding porque la Card ya lo tiene */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
        {!editing ? (
          <Stack spacing={2.5} sx={{ flexGrow: 1 }}>
            <ProductInfo
              product={product}
              onEdit={isOwner && !hideOffersAndEdit ? handleEdit : undefined}
              onDelete={isOwner ? handleDelete : undefined}
              onMarkAsSold={isOwner && !product.isSold ? handleMarkAsSold : undefined}
              onToggleFavorite={!isOwner && user ? handleToggleFavorite : undefined}
              isFavorite={isFavorite}
              showFavorite={!isOwner && !!user}
            />

            {/* Espacio para que las acciones se vayan al final si hay espacio */}
            <Box sx={{ flexGrow: 1 }} />

            {(!isOwner || isOwner) && !hideOffersAndEdit && <Divider />}

            {!isOwner && user && !hideOffersAndEdit && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Tu oferta"
                  size="small"
                  variant="outlined"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSendOffer}
                  sx={{ bgcolor: primaryActionColor, '&:hover': { bgcolor: primaryActionHoverColor } }}
                >
                  <Send />
                </Button>
              </Box>
            )}

            {isOwner && !hideOffersAndEdit && (
              <Button 
                variant="outlined" 
                onClick={() => setShowOffers(true)}
                startIcon={<VisibilityOutlined />}
                sx={{ color: primaryActionColor, borderColor: primaryActionColor }}
              >
                Ver ofertas recibidas
              </Button>
            )}

            {showOffers && (
              <ProductOffers
                productId={product.id}
                onClose={() => setShowOffers(false)}
              />
            )}

            {!product.isSold && user && !isOwner && (
              <Button
                variant="contained"
                startIcon={<ChatBubbleOutline />}
                onClick={handleChatClick}
                fullWidth
                sx={{ bgcolor: primaryActionColor, '&:hover': { bgcolor: primaryActionHoverColor } }}
              >
                Chatear con el vendedor
              </Button>
            )}
          </Stack>
        ) : (
          <ProductEditForm
            product={product}
            onCancel={handleCancel}
            onUpdate={handleUpdate}
          />
        )}
      </CardContent>
    </Card>
  );
}