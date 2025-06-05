import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProduct, deleteProduct, markProductAsSold } from '../../api/productApi';
import { toggleFavoriteProduct, getFavoriteProductsByUser } from '../../api/favoriteApi';
import { Product } from '../../types/productTypes';
import ProductInfo from './ProductInfo';
import ProductEditForm from './ProductEditForm';
import useAuth from '../../hooks/useAuth';
import { getIdFromToken } from '../../api/userServices';

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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
    } catch (err : any) {
      alert("Error al eliminar el producto.");
      console.error(err);
    }
  };

  const handleMarkAsSold = async () => {
    try {
      await markProductAsSold(product.id);
      alert("Producto marcado como vendido.");
      window.location.reload(); // o actualiza el estado local
    } catch (err : any) {
      alert("Error al marcar como vendido.");
      console.error(err);
    }
  };

  const handleToggleFavorite = async () => {
    const favorite = {
      userId: getIdFromToken(),
      productId: product.id
    };
  
    console.log("Enviando favorite:", favorite);
  
    try {
      await toggleFavoriteProduct(favorite);
      setIsFavorite(prev => !prev);
    } catch (err: any) {
      console.error("Error al actualizar favorito:", err.response?.data || err.message);
      alert("Error al actualizar favorito.");
    }
  };  

  return (
    <div>
      {!editing ? (
        <ProductInfo
          product={product}
          onEdit={isOwner ? handleEdit : undefined}
          onDelete={isOwner ? handleDelete : undefined}
          onMarkAsSold={isOwner && !product.isSold ? handleMarkAsSold : undefined}
          onToggleFavorite={!isOwner && user ? handleToggleFavorite : undefined}
          isFavorite={isFavorite}
          showFavorite={!isOwner && !!user}
        />
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