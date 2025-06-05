import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProduct, deleteProduct } from '../../api/productApi';
import { Product } from '../../types/productTypes';
import ProductInfo from './ProductInfo';
import ProductEditForm from './ProductEditForm';
import useAuth from '../../hooks/useAuth';
import { getIdFromToken } from '../../api/userServices';

export default function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  const isOwner = user && product.sellerId === getIdFromToken();

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
    } catch (err) {
      alert("Error al eliminar el producto.");
      console.error(err);
    }
  };

  return (
    <div>
      {!editing ? (
        <ProductInfo
          product={product}
          onEdit={isOwner ? handleEdit : undefined}
          onDelete={isOwner ? () => handleDelete() : undefined}
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