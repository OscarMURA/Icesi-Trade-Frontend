import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/productApi';
import ProductList from '../components/products/ProductList';
import { Product } from '../types/productTypes';

const Home: React.FC = () => {
  const [listProducts, setListProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((products) => setListProducts(products));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Productos Destacados</h1>
      <ProductList products={listProducts} />
    </div>
  );
};

export default Home;