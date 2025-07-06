import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Box, 
  Fade, 
  Skeleton,
  Alert,
  AlertTitle,
  Typography,
  Button,
  Paper,
  Stack,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  Email,
  Phone,
  Message
} from '@mui/icons-material';
import { UserResponseDto } from '../types/userTypes';
import { getUserById } from '../api/userServices';
import { getIdFromToken } from '../api/userServices';
import useAuth from '../hooks/useAuth';
import { useChat } from '../contexts/ChatContext';
import { getProductBySellerId } from '../api/productApi';
import { getReviewsByReviewee } from '../api/salesApi';
import { Product } from '../types/productTypes';
import { Review } from '../types/reviewTypes';
import UserStatsAndReviews from '../components/profile/UserStatsAndReviews';

export default function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setSelectedUser, setInputMessage } = useChat();
  
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
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

  const isOwnProfile = !!(user && userId && parseInt(userId) === getIdFromToken());

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setError('ID de usuario no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const userProfile = await getUserById(parseInt(userId));
        setProfile(userProfile);

        // Obtener productos publicados y vendidos
        const productos: Product[] = await getProductBySellerId(parseInt(userId));
        const vendidos = productos.filter(p => p.isSold).length;

        // Obtener reviews recibidas y calcular promedio
        const reviews: Review[] = await getReviewsByReviewee(parseInt(userId));
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
        setError('No se pudo cargar el perfil del usuario');
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleContactUser = () => {
    if (!profile || !user) return;
    
    setSelectedUser(profile.id);
    if (setInputMessage) {
      setInputMessage(`Hola ${profile.name}, me gustaría contactarte.`);
    }
    navigate('/chat');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Volver
            </Button>
          </Box>

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
            Perfil de Usuario
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
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Volver
          </Button>
        </Box>

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
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={handleGoBack}
            sx={{ borderRadius: 2, px: 3 }}
          >
            Volver
          </Button>
        </Box>

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
              opacity: 0.7,
              transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
            }
          }}
        >
          {/* Botón de volver */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
              sx={{
                borderRadius: 2,
                px: 3,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: 'primary.main',
                  color: 'white',
                },
              }}
            >
              Volver
            </Button>
          </Box>

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
            👤 Perfil de {profile.name}
          </Typography>

          {/* Información del usuario */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
              border: '1px solid',
              borderColor: 'divider',
              mb: 3
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'primary.main',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(106, 27, 154, 0.3)',
                }}
              >
                {getInitials(profile.name)}
              </Avatar>

              {/* Información básica */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom color="text.primary">
                  {profile.name}
                </Typography>
                
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Email color="primary" />
                    <Typography variant="body1" color="text.secondary">
                      {profile.email}
                    </Typography>
                  </Stack>
                  
                  {profile.phone && (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Phone color="primary" />
                      <Typography variant="body1" color="text.secondary">
                        {profile.phone}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>

              {/* Acciones */}
              {!isOwnProfile && user && (
                <Stack direction="row" spacing={2}>
                  <Tooltip title="Contactar usuario">
                    <IconButton
                      onClick={handleContactUser}
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                      }}
                    >
                      <Message />
                    </IconButton>
                  </Tooltip>
                </Stack>
              )}
            </Stack>
          </Paper>

          {/* Estadísticas y comentarios del usuario */}
          <UserStatsAndReviews
            stats={stats}
            reviews={reviews as any}
            reviewerNames={reviewerNames}
            isOwnProfile={isOwnProfile}
          />
        </Box>
      </Fade>
    </Container>
  );
} 