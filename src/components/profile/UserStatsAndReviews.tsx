import { Box, Paper, Typography, Stack } from '@mui/material';
import { ShoppingBag, Star, TrendingUp, Person } from '@mui/icons-material';
import Rating from '@mui/material/Rating';
import Alert from '@mui/material/Alert';
import React from 'react';
import { Review } from '../../types/reviewTypes';

interface Stats {
  productos: number;
  vendidos: number;
  promedio: number;
  totalReviews: number;
}

interface UserStatsAndReviewsProps {
  stats: Stats;
  reviews: Review[];
  reviewerNames: { [id: number]: string };
  isOwnProfile?: boolean;
}

const UserStatsAndReviews: React.FC<UserStatsAndReviewsProps> = ({ stats, reviews, reviewerNames, isOwnProfile }) => (
  <>
    {/* Estadísticas del usuario */}
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%)',
        border: '1px solid #4caf5020',
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
        {isOwnProfile ? '📊 Mis estadísticas' : '📊 Estadísticas del Usuario'}
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 2 }}>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <ShoppingBag color="primary" />
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {stats.productos}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Productos publicados
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Star color="primary" />
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {stats.promedio.toFixed(2)}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Calificación promedio ({stats.totalReviews} reseñas)
          </Typography>
        </Box>
        <Box sx={{ flex: 1, textAlign: 'center' }}>
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <TrendingUp color="primary" />
            <Typography variant="h6" fontWeight={600} color="primary.main">
              {stats.vendidos}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Ventas realizadas
          </Typography>
        </Box>
      </Stack>
    </Paper>

    {/* Comentarios recibidos */}
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
        border: '1px solid',
        borderColor: 'divider',
        mt: 3
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom color="text.primary">
        📝 {isOwnProfile ? 'Mis comentarios recibidos' : 'Comentarios recibidos'}
      </Typography>
      {reviews.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {isOwnProfile
            ? 'Aún no has recibido comentarios.'
            : 'Este usuario aún no ha recibido comentarios.'}
        </Typography>
      ) : (
        <Stack spacing={3} sx={{ mt: 2 }}>
          {reviews.map((review, index) => (
            <Paper key={review.id || index} elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Rating value={review.rating} readOnly precision={0.5} />
                <Typography variant="body1" color="text.primary" sx={{ flex: 1 }}>
                  {review.comment || <span style={{ color: '#888' }}>[Sin comentario]</span>}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Reseñado por {reviewerNames[review.reviewerId] || `Usuario #${review.reviewerId}`}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Paper>

    {/* Alerta si es el propio perfil */}
    {isOwnProfile && (
      <Alert 
        severity="info" 
        sx={{ borderRadius: 2, mt: 3 }}
        icon={<Person />}
      >
        Este es tu propio perfil. Puedes editarlo desde la sección "Mi Perfil".
      </Alert>
    )}
  </>
);

export default UserStatsAndReviews; 