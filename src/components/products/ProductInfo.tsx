import { Product } from '../../types/productTypes';
import { Button, Stack } from '@mui/material';

export default function ProductInfo({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <h3>{`$${product.price}`}</h3>

      {onEdit && onDelete && (
        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="outlined" onClick={onEdit}>Editar</Button>
          <Button variant="outlined" color="error" onClick={onDelete}>Eliminar</Button>
        </Stack>
      )}
    </div>
  );
}
