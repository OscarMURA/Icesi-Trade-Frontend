import { useState, useEffect } from 'react';
import { getAvailableProducts } from '../api/productApi';
import ProductList from '../components/products/ProductList';
import type { Product } from '../types/productTypes';
import { Box, Typography, Skeleton, Alert } from '@mui/material';
import useAuth from '../hooks/useAuth';

export default function ProductsManager() {
  const { isAuthenticated } = useAuth();
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getAvailableProducts();
        setListProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box maxWidth="lg" mx="auto" px={2} py={4}>
            {/* Header con información */}
            <Box mb={4} textAlign="center">
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #6a1b9a, #9c27b0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Productos Disponibles
              </Typography>

            </Box>

      {isAuthenticated && (
        <Alert 
          severity="info" 
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Se muestran automáticamente solo los productos disponibles (no vendidos) y que no son tuyos.
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {[...Array(12)].map((_, i) => (
            <Box key={i}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
              <Skeleton width="80%" sx={{ mt: 1 }} />
              <Skeleton width="60%" />
            </Box>
          ))}
        </Box>
      ) : (
        <ProductList products={listProducts} />
      )}
    </Box>
  );
}