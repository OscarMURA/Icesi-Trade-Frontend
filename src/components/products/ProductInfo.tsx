// ProductInfo.tsx
import { Product } from '../../types/productTypes';
import { Button, Stack, IconButton, Typography, Box, Chip, CardMedia } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const defaultImage =
  'https://i.pinimg.com/originals/ea/5f/c9/ea5fc9680cec81756dcd5f12d63dc3f5.jpg';

export default function ProductInfo({
  product,
  onEdit,
  onDelete,
  onToggleFavorite,
  isFavorite,
  showFavorite,
}: {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkAsSold?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
  showFavorite?: boolean;
}) {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CardMedia
        component="img"
        image={product.imageUrl || defaultImage}
        alt={product.title}
        sx={{ height: 200, width: '100%', objectFit: 'cover', borderRadius: 2, mb: 2 }}
      />

      <Box px={1} flexGrow={1}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
          {product.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.description}
        </Typography>
        <Typography variant="h6" color="primary">${product.price}</Typography>

        <Chip
          label={product.status}
          color="info"
          size="small"
          sx={{ mt: 1, mb: 2 }}
        />

        {showFavorite && onToggleFavorite && (
          <IconButton onClick={onToggleFavorite} color="primary">
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}
      </Box>

      <Box px={1} pb={2}>
        <Stack direction="row" spacing={2}>
          {onEdit && <Button variant="outlined" fullWidth onClick={onEdit}>Editar</Button>}
          {onDelete && <Button variant="outlined" fullWidth color="error" onClick={onDelete}>Eliminar</Button>}
        </Stack>
      </Box>
    </Box>
  );
}