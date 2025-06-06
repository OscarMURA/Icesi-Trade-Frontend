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
} from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';
import { useChat } from '../../contexts/ChatContext';


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
    const confirmDelete = window.confirm('¿Seguro que deseas eliminar este producto?');
    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);
      alert('Producto eliminado exitosamente.');
      navigate('/my-products');
    } catch (err) {
      alert('Error al eliminar el producto.');
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
    const favorite = {
      userId: getIdFromToken(),
      productId: product.id,
    };

    try {
      await toggleFavoriteProduct(favorite);
      setIsFavorite((prev) => !prev);
    } catch (err) {
      alert('Error al actualizar favorito.');
      console.error(err);
    }
  };

  const handleSendOffer = () => {
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

    createSale(offer)
      .then(() => {
        alert('Oferta enviada exitosamente.');
        setOfferPrice('');
      })
      .catch((err) => {
        console.error('Error al enviar oferta:', err);
        alert('Error al enviar oferta.');
      });
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
    <Card
      sx={{
        bgcolor: '#f8f0fb',
        borderRadius: 3,
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {!editing ? (
          <Stack spacing={2}>
            <ProductInfo
              product={product}
              onEdit={isOwner && !hideOffersAndEdit ? handleEdit : undefined}
              onDelete={isOwner ? handleDelete : undefined}
              onMarkAsSold={isOwner && !product.isSold ? handleMarkAsSold : undefined}
              onToggleFavorite={!isOwner && user ? handleToggleFavorite : undefined}
              isFavorite={isFavorite}
              showFavorite={!isOwner && !!user}
            />

            {!isOwner && user && !hideOffersAndEdit && (
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    type="number"
                    label="Precio ofrecido"
                    size="small"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                  />
                  <Button variant="contained" color="secondary" onClick={handleSendOffer}>
                    Enviar oferta
                  </Button>
                </Stack>
              </Stack>
            )}

            {isOwner && !hideOffersAndEdit && (
              <Button variant="outlined" onClick={() => setShowOffers(true)}>
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
                sx={{ bgcolor: '#6a1b9a', '&:hover': { bgcolor: '#4a148c' } }}
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