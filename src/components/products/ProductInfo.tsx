import { Product } from '../../types/productTypes';
import { 
  Button, 
  Stack, 
  IconButton, 
  Typography, 
  Box, 
  Chip, 
  CardMedia,
  Paper,
  Tooltip,
} from '@mui/material';
import { 
  FavoriteRounded,
  FavoriteBorderRounded,
  EditRounded,
  DeleteRounded,
  CheckCircleRounded,
  LocalOfferRounded,

} from '@mui/icons-material';

const defaultImage =
  'https://i.pinimg.com/originals/ea/5f/c9/ea5fc9680cec81756dcd5f12d63dc3f5.jpg';

// Función para obtener el color del estado
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'nuevo':
      return { color: '#4caf50', bg: '#e8f5e8' };
    case 'seminuevo':
      return { color: '#ff9800', bg: '#fff3e0' };
    case 'usado':
      return { color: '#2196f3', bg: '#e3f2fd' };
    default:
      return { color: '#757575', bg: '#f5f5f5' };
  }
};

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
  const statusColors = getStatusColor(product.status);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Imagen del producto con overlay de estado */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        <CardMedia
          component="img"
          image={product.imageUrl || defaultImage}
          alt={product.title}
          sx={{ 
            height: 200, // Tamaño fijo predeterminado
            width: '100%', 
            objectFit: 'cover',
            borderRadius: 0,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.02)',
            }
          }}
        />
        
        {/* Badge de estado sobre la imagen */}
        <Chip
          label={product.status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: statusColors.bg,
            color: statusColors.color,
            fontWeight: 600,
            fontSize: '0.75rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            border: `1px solid ${statusColors.color}20`,
          }}
        />

        {/* Corazón de favorito */}
        {showFavorite && onToggleFavorite && (
          <Tooltip title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}>
            <IconButton
              onClick={onToggleFavorite}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 1)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isFavorite ? (
                <FavoriteRounded sx={{ color: '#e91e63' }} />
              ) : (
                <FavoriteBorderRounded sx={{ color: '#757575' }} />
              )}
            </IconButton>
          </Tooltip>
        )}

        {/* Indicador de producto vendido */}
        {product.isSold && (
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'rgba(76, 175, 80, 0.95)',
              color: 'white',
              py: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <CheckCircleRounded fontSize="small" />
            <Typography variant="body2" fontWeight={600}>
              VENDIDO
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Información del producto */}
      <Box sx={{ px: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Título */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            color: '#2c2c2c',
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.title}
        </Typography>

        {/* Descripción */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            mb: 2,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
          }}
        >
          {product.description}
        </Typography>

        {/* Precio destacado */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 2,
          }}
        >
          <LocalOfferRounded sx={{ color: 'primary.main', fontSize: '1.2rem' }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ${product.price?.toLocaleString()}
          </Typography>
        </Box>

        {/* Botones de acción del propietario */}
        {(onEdit || onDelete || onMarkAsSold) && (
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Stack direction="row" spacing={1} justifyContent="stretch">
              {onEdit && (
                <Tooltip title="Editar producto">
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={onEdit}
                    startIcon={<EditRounded />}
                    sx={{ 
                      flex: 1,
                      borderRadius: 2,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'primary.main',
                        color: 'white',
                      }
                    }}
                  >
                    Editar
                  </Button>
                </Tooltip>
              )}
              
              {onMarkAsSold && (
                <Tooltip title="Marcar como vendido">
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={onMarkAsSold}
                    startIcon={<CheckCircleRounded />}
                    sx={{ 
                      flex: 1,
                      borderRadius: 2,
                      borderColor: '#4caf50',
                      color: '#4caf50',
                      '&:hover': {
                        bgcolor: '#4caf50',
                        color: 'white',
                      }
                    }}
                  >
                    Vendido
                  </Button>
                </Tooltip>
              )}
              
              {onDelete && (
                <Tooltip title="Eliminar producto">
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={onDelete}
                    startIcon={<DeleteRounded />}
                    sx={{ 
                      flex: 1,
                      borderRadius: 2,
                      borderColor: '#f44336',
                      color: '#f44336',
                      '&:hover': {
                        bgcolor: '#f44336',
                        color: 'white',
                      }
                    }}
                  >
                    Eliminar
                  </Button>
                </Tooltip>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}