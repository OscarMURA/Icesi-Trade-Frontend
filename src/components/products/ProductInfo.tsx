import { Product } from '../../types/productTypes';
import { Button, Stack, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ProductInfo({
  product,
  onEdit,
  onDelete,
  onMarkAsSold,
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
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>{`$${product.price}`}</h3>

      <Stack direction="row" spacing={2} mt={2}>
        {onEdit && <Button variant="outlined" onClick={onEdit}>Editar</Button>}
        {onDelete && <Button variant="outlined" color="error" onClick={onDelete}>Eliminar</Button>}
        {onMarkAsSold && !product.isSold && (
          <Button variant="contained" color="success" onClick={onMarkAsSold}>Marcar como vendido</Button>
        )}
        {showFavorite && onToggleFavorite && (
          <IconButton onClick={onToggleFavorite} color="primary">
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}
      </Stack>
    </div>
  );
}