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

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offerPrice, setOfferPrice] = useState('');
  const isOwner = user && product.sellerId === getIdFromToken();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const favorites = await getFavoriteProductsByUser(); 
        const found = favorites.some(fav => fav.productId === product.id);
        setIsFavorite(found);
      } catch (err) {
        console.error("Error al cargar favoritos", err);
      }
    };
    fetchFavorites();
  }, [product.id, user]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);

  const handleUpdate = async (updated: Product) => {
    try {
      await updateProduct(product.id, updated);
      alert("Producto actualizado exitosamente.");
      setEditing(false);
    } catch (err) {
      alert("Error al actualizar el producto.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!confirmDelete) return;

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
      alert("Producto marcado como vendido.");
      window.location.reload(); 
    } catch (err: any) {
      alert("Error al marcar como vendido.");
      console.error(err);
    }
  };

  const handleToggleFavorite = async () => {
    const favorite = {
      userId: getIdFromToken(),
      productId: product.id
    };

    try {
      await toggleFavoriteProduct(favorite);
      setIsFavorite(prev => !prev);
    } catch (err: any) {
      alert("Error al actualizar favorito.");
      console.error(err);
    }
  };

  const handleSendOffer = () => {
    if (!offerPrice || isNaN(Number(offerPrice))) {
      alert("Por favor ingresa un precio válido.");
      return;
    }
  
    const offer: SaleCreate = {
      buyerId: getIdFromToken(),
      productId: product.id,
      price: parseFloat(offerPrice),
      status: 'pending'
    };
  
    console.log("Oferta enviada:", offer);
  
    createSale(offer)
      .then(() => { 
        alert("Oferta enviada exitosamente.");
        setOfferPrice('');
      }
      )
      .catch((err: any) => {
        console.error("Error al enviar oferta:", err.response?.data || err.message);
        alert("Error al enviar oferta.");
      });
  };

  return (
    <div className="bg-white rounded shadow p-4">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      {!editing ? (
        <>
          <ProductInfo
            product={product}
            onEdit={isOwner ? handleEdit : undefined}
            onDelete={isOwner ? handleDelete : undefined}
            onMarkAsSold={isOwner && !product.isSold ? handleMarkAsSold : undefined}
            onToggleFavorite={!isOwner && user ? handleToggleFavorite : undefined}
            isFavorite={isFavorite}
            showFavorite={!isOwner && !!user}
          />
          {!isOwner && user && (
            <div className="mt-4">
              <h4 className="font-medium">Haz una oferta</h4>
              <input
                type="number"
                className="border px-2 py-1 mr-2 rounded"
                placeholder="Precio ofrecido"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
              <button onClick={handleSendOffer} className="bg-blue-500 text-white px-4 py-1 rounded">
                Enviar oferta
              </button>
            </div>
          )}
        </>
      ) : (
        <ProductEditForm
          product={product}
          onCancel={handleCancel}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
