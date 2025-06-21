import { useState, useEffect } from 'react';
import ProductList from '../components/products/ProductList';
import { Product } from '../types/productTypes';
import { getFavoriteProductsByUser } from '../api/favoriteApi';
import { getProductById } from '../api/productApi';
import { Box, Typography, Skeleton, Grid } from '@mui/material';

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
      } catch (err) {
        console.error("Error al cargar productos favoritos", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchFavorites();
  }, []);
   
  return (
    <Box maxWidth="lg" mx="auto" px={2} py={4}>
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
        sx={{
          background: 'linear-gradient(to right, #3b82f6, #1e40af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Mis Favoritos
      </Typography>
      
      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
              <Skeleton width="80%" sx={{ mt: 1 }} />
              <Skeleton width="60%" />
            </Grid>
          ))}
        </Grid>
      ) : listProducts.length > 0 ? (
        <ProductList products={listProducts} />
      ) : (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            backgroundColor: '#f8fafc',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No tienes productos favoritos aún
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explora los productos disponibles y agrega tus favoritos
          </Typography>
        </Box>
      )}
    </Box>
  );
}