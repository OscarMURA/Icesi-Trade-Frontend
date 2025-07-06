import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginRequest } from '../api/authApi';
import { LogInDto } from '../types/authTypes';
import useAuth from '../hooks/useAuth';
import { PRODUCTS, REGISTER } from '../constants/routes';

import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress, 
  Alert,
  InputAdornment,
  IconButton,
  Paper,
  Fade,
  Stack,
} from '@mui/material';
import { 
  MailOutline, 
  LockOutlined, 
  Visibility, 
  VisibilityOff,
  LoginRounded,
  WavingHandRounded,
} from '@mui/icons-material';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LogInDto>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const location = useLocation();
  const from = location.state?.from?.pathname || PRODUCTS;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.email || !form.password) {
        throw new Error('Por favor complete todos los campos');
      }
      const response = await loginRequest(form);
      if (!response || !response.token) {
        throw new Error('No se recibió un token válido del servidor');
      }
      localStorage.setItem('username', response.name);
      localStorage.setItem('token', response.token);
      login(response);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Error al iniciar sesión.';
      
      // ✅ Manejo específico para cuentas no verificadas
      if (errorMessage.includes('verificada') || errorMessage.includes('habilitada')) {
        setError('Tu cuenta no está verificada. Revisa tu email y haz clic en el enlace de verificación.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed', // Cambiado a fixed para cubrir toda la pantalla
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8f4ff 0%, #e8eaf6 50%, #f3e5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        zIndex: 1000, // Asegurar que esté por encima de otros elementos
      }}
    >
      <Container component="main" maxWidth="xs">
        <Fade in timeout={600}>
          <Paper
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            elevation={0}
            sx={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid',
              borderColor: isHovered ? 'primary.main' : 'rgba(106, 27, 154, 0.1)',
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              boxShadow: isHovered 
                ? '0 20px 40px rgba(106, 27, 154, 0.15)' 
                : '0 8px 32px rgba(0, 0, 0, 0.08)',
              transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
                opacity: isHovered ? 1 : 0.7,
                transition: 'opacity 0.3s ease',
              }
            }}
          >
            {/* Encabezado con iconos */}
            <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(106, 27, 154, 0.3)',
                }}
              >
                <WavingHandRounded sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              
              <Box textAlign="center">
                <Typography 
                  component="h1" 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                  }}
                >
                  ¡Hola de nuevo!
                </Typography>
                <Typography 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }}
                >
                  Inicia sesión para continuar
                </Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={3}>
                {/* Campo Email */}
                <TextField
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      bgcolor: 'rgba(248, 244, 255, 0.5)',
                      '&:hover': {
                        bgcolor: 'rgba(248, 244, 255, 0.8)',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        boxShadow: '0 0 0 3px rgba(106, 27, 154, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutline sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Campo Password */}
                <TextField
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      bgcolor: 'rgba(248, 244, 255, 0.5)',
                      '&:hover': {
                        bgcolor: 'rgba(248, 244, 255, 0.8)',
                        '& fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        boxShadow: '0 0 0 3px rgba(106, 27, 154, 0.1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      fontWeight: 600,
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': {
                              color: 'primary.main',
                              bgcolor: 'rgba(106, 27, 154, 0.04)',
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                {/* Alert de error */}
                {error && (
                  <Fade in timeout={300}>
                    <Alert 
                      severity="error" 
                      sx={{ 
                        borderRadius: 2,
                        border: '1px solid rgba(244, 67, 54, 0.2)',
                        bgcolor: 'rgba(244, 67, 54, 0.04)',
                        '& .MuiAlert-message': {
                          fontWeight: 500,
                        }
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                {/* Botón de envío */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginRounded />}
                  sx={{ 
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                    boxShadow: '0 8px 24px rgba(106, 27, 154, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #4a148c 0%, #303f9f 100%)',
                      boxShadow: '0 12px 32px rgba(106, 27, 154, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                      color: 'white',
                    }
                  }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </Stack>
            </Box>

            {/* Footer decorativo */}
            <Box 
              sx={{ 
                mt: 4, 
                pt: 3, 
                borderTop: '1px solid rgba(106, 27, 154, 0.1)',
                textAlign: 'center' 
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                ¿No tienes cuenta?{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': {
                      color: 'primary.dark',
                    }
                  }}
                  onClick={() => navigate(REGISTER)}
                >
                  Regístrate aquí
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}