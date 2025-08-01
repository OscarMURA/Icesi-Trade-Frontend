import { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Fade, 
  Skeleton,
  Alert,
  AlertTitle,
  Typography
} from '@mui/material';
import { UserResponseDto } from '../types/userTypes';
import UserInfo from '../components/profile/UserInfo';
import UserEditForm from '../components/profile/UserEditForm';
import EmailVerificationStatus from '../components/profile/EmailVerificationStatus';
import { getUserById } from '../api/userServices';
import { getIdFromToken, getToken } from '../api/userServices';
import UserStatsAndReviews from '../components/profile/UserStatsAndReviews';
import { getProductBySellerId } from '../api/productApi';
import { getReviewsByReviewee } from '../api/salesApi';
import { Product } from '../types/productTypes';
import { Review } from '../types/reviewTypes';

export default function Profile() {
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    productos: 0,
    vendidos: 0,
    promedio: 0,
    totalReviews: 0,
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerNames, setReviewerNames] = useState<{ [id: number]: string }>({});

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleUpdate = (updatedUser: UserResponseDto) => {
    setProfile(updatedUser);
    setEditing(false);
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!getToken()) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        const userId = getIdFromToken();
        const userProfile = await getUserById(userId);
        setProfile(userProfile);
        // Obtener productos publicados y vendidos
        const productos: Product[] = await getProductBySellerId(userId);
        const vendidos = productos.filter(p => p.isSold).length;
        // Obtener reviews recibidas y calcular promedio
        const reviews: Review[] = await getReviewsByReviewee(userId);
        const promedio = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : 0;
        setReviews(reviews);
        // Obtener nombres de los reviewers únicos
        const uniqueReviewerIds = Array.from(new Set(reviews.map(r => r.reviewerId)));
        const namesDict: { [id: number]: string } = {};
        await Promise.all(uniqueReviewerIds.map(async (id) => {
          try {
            const user = await getUserById(id);
            namesDict[id] = user.name;
          } catch {
            namesDict[id] = `Usuario #${id}`;
          }
        }));
        setReviewerNames(namesDict);
        setStats({
          productos: productos.length,
          vendidos,
          promedio,
          totalReviews: reviews.length,
        });
      } catch (error) {
        console.error('Error al obtener el perfil:', error);
        setError(error instanceof Error ? error.message : 'Error desconocido');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Loading skeleton
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(106,27,154,0.03) 0%, rgba(63,81,181,0.03) 100%)',
            minHeight: '80vh',
            borderRadius: '24px',
            p: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
            }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2
            }}
          >
            Mi Perfil
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '16px' }} />
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '12px' }} />
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '12px' }} />
          </Box>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(244,67,54,0.15)',
              '& .MuiAlert-icon': {
                fontSize: '24px'
              }
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Error al cargar el perfil</AlertTitle>
            {error}
          </Alert>
        </Fade>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Alert 
            severity="warning"
            sx={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(255,152,0,0.15)'
            }}
          >
            <AlertTitle sx={{ fontWeight: 700 }}>Perfil no encontrado</AlertTitle>
            No se pudo cargar la información del perfil.
          </Alert>
        </Fade>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Fade in timeout={600}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, rgba(106,27,154,0.03) 0%, rgba(63,81,181,0.03) 100%)',
            minHeight: '80vh',
            borderRadius: '24px',
            p: { xs: 2, sm: 3 },
            position: 'relative',
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
              opacity: editing ? 1 : 0.7,
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            }
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {editing ? '✏️ Editando Perfil' : '👤 Mi Perfil'}
          </Typography>

          <Fade in={!editing} timeout={400} unmountOnExit>
            <Box>
              <UserInfo user={profile} onEdit={handleEdit} />
              <EmailVerificationStatus />
            </Box>
          </Fade>

          <Fade in={editing} timeout={400} unmountOnExit>
            <Box>
              <UserEditForm 
                user={profile} 
                onCancel={handleCancel} 
                onUpdate={handleUpdate} 
              />
            </Box>
          </Fade>
          {/* Estadísticas y comentarios del usuario */}
          <UserStatsAndReviews
            stats={stats}
            reviews={reviews}
            reviewerNames={reviewerNames}
            isOwnProfile={true}
          />
        </Box>
      </Fade>
    </Container>
  );
}