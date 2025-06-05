import { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import  { Product } from '../types/productTypes';
import { getFavoriteProductsByUser } from '../api/favoriteApi';
import { getProductById } from '../api/productApi';

export default function MyFavoriteProducts() {
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const favorites = await getFavoriteProductsByUser();
        const productPromises = favorites.map(fav => getProductById(fav.productId));
        const products = await Promise.all(productPromises);
  
        setListProducts(products);
        setIsLoading(false); 
      } catch (err) {
        console.error("Error al cargar productos favoritos", err);
        setIsLoading(false); 
      }
    };
  
    fetchFavorites();
  }, []);
   
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Mis Favoritos
        </h1>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <ProductList products={listProducts} />
      )}
    </div>
  );
}