import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { getIdFromToken, getToken } from '../api/userServices';
import ProductCard from '../components/products/ProductCard';
import { Product } from '../types/productTypes';

export default function MyPurchases() {
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const buyerId = getIdFromToken();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`/api/sales/buyer/${buyerId}`,
          { headers: { Authorization: `Bearer ${getToken()}` } });
        const acceptedSales = response.data.filter((sale: any) => sale.status === 'accepted');
        const productIds = acceptedSales.map((sale: any) => sale.productId).filter(Boolean);
        const productRequests = productIds.map((id: number) =>
          axios.get(`/api/products/${id}`).then(res => res.data).catch(() => null)
        );
        const products = (await Promise.all(productRequests)).filter((p) => p && p.id);
        setPurchasedProducts(products);
      } catch (error) {
        console.error('Error al cargar compras:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPurchases();
  }, [buyerId]);

  return (
    <div>
      <h1>Mis compras</h1>
      {isLoading ? (
        <p>Cargando compras...</p>
      ) : purchasedProducts.length === 0 ? (
        <p>No tienes compras registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {purchasedProducts.map((product) => (
            <ProductCard key={product.id} product={product} hideOffersAndEdit />
          ))}
        </div>
      )}
    </div>
  );
} 