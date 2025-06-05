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
    <div className="bg-white shadow rounded p-4">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}

      <h2 className="text-xl font-semibold">{product.title}</h2>
      <p className="text-gray-700">{product.description}</p>
      <h3 className="text-blue-700 font-bold text-lg">${product.price}</h3>

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
