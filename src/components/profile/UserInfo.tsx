import { 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Box,
  Avatar,
  Divider,
  Fade
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon, 
  Person as PersonIcon,
  Verified as VerifiedIcon
} from '@mui/icons-material';
import { UserResponseDto } from '../../types/userTypes';

export default function UserInfo({
  user,
  onEdit,
}: {
  user: UserResponseDto;
  onEdit: () => void;
}) {
  // Función para obtener las iniciales del nombre
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const InfoRow = ({ 
    icon, 
    label, 
    value, 
    verified = false 
  }: { 
    icon: React.ReactNode; 
    label: string; 
    value: string; 
    verified?: boolean;
  }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        py: 2,
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          backgroundColor: 'rgba(106,27,154,0.04)',
          transform: 'scale(1.01)',
        }
      }}
    >
      <Box 
        sx={{ 
          color: '#6a1b9a', 
          display: 'flex', 
          alignItems: 'center',
          minWidth: '24px'
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 500,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            {value}
          </Typography>
          {verified && (
            <VerifiedIcon 
              sx={{ 
                fontSize: '16px', 
                color: '#4caf50' 
              }} 
            />
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Fade in timeout={500}>
      <Card
        sx={{
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&:hover': {
            boxShadow: '0 12px 28px rgba(106,27,154,0.15)',
            transform: 'translateY(-4px)',
            '&::before': {
              opacity: 1,
            }
          },
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
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header con avatar y título */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              mb: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 16px rgba(106,27,154,0.3)',
                }}
              >
                {getInitials(user.name)}
              </Avatar>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2,
                    mb: 0.5
                  }}
                >
                  Información Personal
                </Typography>
                
              </Box>
            </Box>
          </Box>

          <Divider 
            sx={{ 
              mb: 3, 
              background: 'linear-gradient(90deg, transparent 0%, rgba(106,27,154,0.2) 50%, transparent 100%)'
            }} 
          />

          {/* Información del usuario */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InfoRow
              icon={<PersonIcon />}
              label="Nombre completo"
              value={user.name}
              verified={true}
            />

            <InfoRow
              icon={<EmailIcon />}
              label="Correo electrónico"
              value={user.email}
              verified={true}
            />

            <InfoRow
              icon={<PhoneIcon />}
              label="Número de teléfono"
              value={user.phone || 'No registrado'}
              verified={!!user.phone}
            />
          </Box>

          {/* Botón de edición principal */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={onEdit}
              startIcon={<EditIcon />}
              sx={{
                background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                borderRadius: '16px',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(106,27,154,0.3)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(106,27,154,0.4)',
                  background: 'linear-gradient(135deg, #7b1fa2 0%, #3949ab 100%)',
                }
              }}
            >
              Editar Perfil
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}