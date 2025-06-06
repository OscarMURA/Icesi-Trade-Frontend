import type { Product } from '../../types/productTypes';
import ProductCard from './ProductCard';

export default function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">
          No hay productos disponibles
        </h2>
        <p className="text-gray-500 mt-2">
          Sé el primero en publicar un producto
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
