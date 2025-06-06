import { useEffect, useState } from 'react';
import axios from '../api/axiosConfig';
import { getIdFromToken, getToken } from '../api/userServices';
import ProductCard from '../components/products/ProductCard';
import { Product } from '../types/productTypes';
import { Box, Typography, Button } from '@mui/material';
import ReviewDialog from '../components/ReviewDialog';
import { Review } from '../types/reviewTypes';

export default function MyPurchases() {
  const [purchasedProducts, setPurchasedProducts] = useState<Product[]>([]);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<number>>(new Set());
  const [openDialogs, setOpenDialogs] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  const buyerId = getIdFromToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await axios.get(`/api/sales/buyer/${buyerId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const acceptedSales = salesRes.data.filter((sale: any) => sale.status === 'accepted');
        const productIds = acceptedSales.map((sale: any) => sale.productId).filter(Boolean);

        const productRequests = productIds.map((id: number) =>
          axios.get(`/api/products/${id}`).then((res) => res.data).catch(() => null)
        );

        const products = (await Promise.all(productRequests)).filter((p) => p && p.id);
        setPurchasedProducts(products);

        const reviewsRes = await axios.get(`/api/reviews?reviewerId=${buyerId}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        const reviewedIds = new Set<number>(
          reviewsRes.data.map((review: Review) => review.productId)
        );
        setReviewedProductIds(reviewedIds);
      } catch (error) {
        console.error('Error al cargar compras o reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [buyerId]);

  const handleOpen = (productId: number) => {
    setOpenDialogs((prev) => ({ ...prev, [productId]: true }));
  };

  const handleClose = (productId: number) => {
    setOpenDialogs((prev) => ({ ...prev, [productId]: false }));
  };

  return (
    <Box px={4} py={6}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Mis compras
      </Typography>

      {isLoading ? (
        <Typography>Cargando compras...</Typography>
      ) : purchasedProducts.length === 0 ? (
        <Typography>No tienes compras registradas.</Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {purchasedProducts.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} hideOffersAndEdit />

              {/* Solo mostrar el botón si NO ha calificado */}
              {!reviewedProductIds.has(product.id) && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    onClick={() => handleOpen(product.id)}
                    fullWidth
                  >
                    Calificar
                  </Button>
                  <ReviewDialog
                    open={openDialogs[product.id] || false}
                    onClose={() => handleClose(product.id)}
                    productId={product.id}
                    revieweeId={product.sellerId}
                  />
                </Box>
              )}
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}