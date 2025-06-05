import { useState, useEffect } from 'react';
import { searchProducts, ProductFilters } from '../api/productApi';
import { getCategories } from '../api/categoryApi';
import QueryForm from '../components/queries/QueryForm';
import FilterForm, { FilterOptions } from '../components/queries/FilterForm';
import ProductList from '../components/products/ProductList';
import { Product } from '../types/productTypes';

export default function ProductSearch() {
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };

    const loadInitialProducts = async () => {
      setIsLoading(true);
      try {
        const results = await searchProducts({});
        setSearchResults(results);
      } catch (error) {
        console.error('Error al cargar productos iniciales:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
    loadInitialProducts();
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    await performSearch(query, activeFilters);
  };

  const handleFilter = async (filters: FilterOptions) => {
    setActiveFilters(filters);
    await performSearch(searchQuery, filters);
  };

  const performSearch = async (query: string, filters: FilterOptions) => {
    setIsLoading(true);
    try {
      const searchFilters: ProductFilters = {
        ...filters,
        search: query
      };
      const results = await searchProducts(searchFilters);
      setSearchResults(results);
    } catch (error) {
      console.error('Error al buscar productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Búsqueda de Productos
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <FilterForm onFilter={handleFilter} categories={categories} />
        </div>
        
        <div className="lg:col-span-3">
          <div className="mb-6">
            <QueryForm onSearch={handleSearch} />
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductList products={searchResults} />
          )}
        </div>
      </div>
    </div>
  );
} 