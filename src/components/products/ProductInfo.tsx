import { Product } from '../../types/productTypes';
import { Button, Stack, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

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
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>{`$${product.price}`}</h3>
      <div className="mb-2">
        <span className="font-semibold text-gray-700">Estado: </span>
        <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
          {product.status}
        </span>
      </div>
      <Stack direction="row" spacing={2} mt={2}>
        {onEdit && <Button variant="outlined" onClick={onEdit}>Editar</Button>}
        {onDelete && <Button variant="outlined" color="error" onClick={onDelete}>Eliminar</Button>}
        {showFavorite && onToggleFavorite && (
          <IconButton onClick={onToggleFavorite} color="primary">
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}
      </Stack>
    </div>
  );
}