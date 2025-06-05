import { Product } from '../../types/productTypes';
import ProductCard from '../products/ProductCard';

interface QueryResultsProps {
  results: Product[];
  isLoading: boolean;
}

export default function QueryResults({ results, isLoading }: QueryResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">
          No se encontraron productos
        </h2>
        <p className="text-gray-500 mt-2">
          Intenta con otros términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {results.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 