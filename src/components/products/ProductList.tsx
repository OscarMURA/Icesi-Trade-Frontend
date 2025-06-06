import { useState } from 'react';
import type { Product } from '../../types/productTypes';
import ProductCard from './ProductCard';
import {
  Grid,
  Pagination,
  Box,
  Typography,
} from '@mui/material';

const ITEMS_PER_PAGE = 12;

export default function ProductList({ products }: { products: Product[] }) {
  const [page, setPage] = useState(1);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedProducts = products.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (products.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="text.secondary">
          No hay productos disponibles
        </Typography>
        <Typography color="text.disabled" mt={1}>
          Sé el primero en publicar un producto
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" px={2}>
      <Grid
        container
        spacing={3}
        alignItems="stretch"
        justifyContent="center"
      >
        {paginatedProducts.map((product) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={product.id}
            display="flex"
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(products.length / ITEMS_PER_PAGE)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
    </Box>
  );
}