import { useState } from 'react';
import type { Product } from '../../types/productTypes';
import ProductCard from './ProductCard';
import {
  Grid,
  Pagination,
  Box,
  Typography,
  Container,
  Fade,
  Skeleton,
} from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';

const ITEMS_PER_PAGE = 12;

export default function ProductList({ 
  products, 
  loading = false 
}: { 
  products: Product[];
  loading?: boolean;
}) {
  const [page, setPage] = useState(1);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // Scroll suave hacia arriba cuando cambie de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Box sx={{ bgcolor: 'white', borderRadius: 4, p: 2 }}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
                <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
                <Skeleton variant="text" height={28} width="60%" />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // Estado vacío
  if (products.length === 0) {
    return (
      <Container maxWidth="sm">
        <Fade in timeout={600}>
          <Box 
            textAlign="center" 
            py={8}
            sx={{
              bgcolor: 'white',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid #ede7f6',
              px: 4
            }}
          >
            <ShoppingBag 
              sx={{ 
                fontSize: 80, 
                color: '#bdbdbd', 
                mb: 2 
              }} 
            />
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              No hay productos disponibles
            </Typography>
            <Typography 
              color="text.disabled" 
              variant="body1"
            >
              Sé el primero en publicar un producto increíble
            </Typography>
          </Box>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
 
      {/* Grid de productos con altura uniforme */}
      <Fade in timeout={800}>
        <Grid
          container
          spacing={3}
          sx={{
            '& .MuiGrid-item': {
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          {paginatedProducts.map((product, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={product.id}
            >
              <Fade in timeout={600 + (index * 100)}>
                <Box 
                  sx={{ 
                    height: '100%',
                    minHeight: 500, // Altura mínima uniforme
                    maxHeight: 600, // Altura máxima para evitar tarjetas muy altas
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <ProductCard product={product} />
                </Box>
              </Fade>
            </Grid>
          ))}
        </Grid>
      </Fade>

      {/* Paginación */}
      {Math.ceil(products.length / ITEMS_PER_PAGE) > 1 && (
        <Box 
          mt={6} 
          display="flex" 
          justifyContent="center"
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            p: 3,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            border: '1px solid #ede7f6'
          }}
        >
          <Pagination
            count={Math.ceil(products.length / ITEMS_PER_PAGE)}
            page={page}
            onChange={handleChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 500,
                '&.Mui-selected': {
                  bgcolor: '#6a1b9a',
                  '&:hover': {
                    bgcolor: '#4a148c'
                  }
                }
              }
            }}
          />
        </Box>
      )}

      {/* Información de página actual */}
      <Box mt={2} textAlign="center">
        <Typography variant="body2" color="text.secondary">
          Página {page} de {Math.ceil(products.length / ITEMS_PER_PAGE)} • 
          Mostrando {paginatedProducts.length} de {products.length} productos
        </Typography>
      </Box>
    </Container>
  );
}