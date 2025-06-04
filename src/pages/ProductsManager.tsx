import { useState, useEffect } from 'react';
import { getProducts } from '../api/productApi';
import ProductList from '../components/products/ProductList';
import { Product } from '../types/productTypes';

export default function ProductsManager() {
  const [listProducts, setListProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((products) => setListProducts(products));
  }, []);

  return (
    <div>
      <h1>Listado de productos</h1>
      <ProductList products={listProducts} />
    </div>
  );
}