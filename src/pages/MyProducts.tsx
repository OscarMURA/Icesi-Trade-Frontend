import { useState, useEffect } from 'react';
import { getProductBySellerId } from '../api/productApi';
import ProductList from '../components/products/ProductList';
import type { Product } from '../types/productTypes';
import { getIdFromToken } from '../api/userServices';

export default function MyProducts() {
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSales, setShowSales] = useState(false);

  const sellerId = getIdFromToken();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!sellerId) {
        console.error("Seller ID is undefined");
        return;
      }

      try {
        const products = await getProductBySellerId(sellerId);
        setListProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  const productosVendidos = listProducts.filter(p => p.isSold);
  const productosNoVendidos = listProducts.filter(p => !p.isSold);

  return (
    <div>
      <div>
        <h1>
          Productos disponibles
        </h1>
        <button onClick={() => setShowSales(!showSales)} style={{margin: '1rem 0', padding: '0.5rem 1.5rem', background: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer'}}>
          {showSales ? 'Ver mis productos en venta' : 'Ver mis ventas'}
        </button>
      </div>
      
      {isLoading ? (
        <p>Cargando productos...</p>
      ) : showSales ? (
        <ProductList products={productosVendidos} />
      ) : (
        <ProductList products={productosNoVendidos} />
      )}
    </div>
  );
}