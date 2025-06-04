import { Product } from '../../types/productTypes';
import ProductCard from './ProductCard';

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}