import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRequest, loginRequest } from '../api/authApi';
import { RegisterDto } from '../types/authTypes';
import useAuth from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

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
  PersonOutline, 
  MailOutline, 
  PhoneOutlined, 
  LockOutlined, 
  Visibility, 
  VisibilityOff,
  PersonAddRounded,
  AutoAwesomeRounded,
} from '@mui/icons-material';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<RegisterDto>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validaciones
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Por favor complete todos los campos obligatorios');
      setLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await registerRequest(form);
      const response = await loginRequest({
        email: form.email,
        password: form.password,
      });
      if (!response || !response.token) {
        throw new Error('No se recibió un token válido del servidor');
      }
      localStorage.setItem('username', response.name);
      localStorage.setItem('token', response.token);
      login(response);
      navigate(ROUTES.PROFILE);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Error inesperado al registrar la cuenta.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calcular progreso del formulario
  const getFormProgress = () => {
    const fields = [form.name, form.email, form.password, form.confirmPassword];
    const filledFields = fields.filter(field => field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const progress = getFormProgress();

  return (
    <Box
      sx={{
        position: 'fixed',
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
        zIndex: 1000,
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
              p: { xs: 2, sm: 3 },
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
            <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(106, 27, 154, 0.3)',
                }}
              >
                <AutoAwesomeRounded sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              
              <Box textAlign="center">
                <Typography 
                  component="h1" 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    mb: 1,
                  }}
                >
                  ¡Únete a nosotros!
                </Typography>
                <Typography 
                  color="text.secondary" 
                  sx={{ 
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  Crea tu cuenta y comienza tu aventura
                </Typography>
              </Box>

              {/* Barra de progreso */}
              <Box sx={{ width: '100%', mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Completado
                  </Typography>
                  <Typography variant="body2" color="primary.main" fontWeight={700}>
                    {progress}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    height: 6,
                    bgcolor: 'rgba(106, 27, 154, 0.1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${progress}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
                      borderRadius: 3,
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Box>
              </Box>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2}>
                {/* Campo Nombre */}
                <TextField
                  size="small"
                  fullWidth
                  id="name"
                  label="Nombre completo"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  required
                  value={form.name}
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
                        <PersonOutline sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Campo Email */}
                <TextField
                  size="small"
                  fullWidth
                  id="email"
                  label="Correo Electrónico"
                  name="email"
                  autoComplete="email"
                  required
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

                {/* Campo Teléfono */}
                <TextField
                  size="small"
                  fullWidth
                  id="phone"
                  label="Teléfono (Opcional)"
                  name="phone"
                  autoComplete="tel"
                  value={form.phone}
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
                        <PhoneOutlined sx={{ color: 'primary.main' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Campo Contraseña */}
                <TextField
                  size="small"
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  required
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

                {/* Campo Confirmar Contraseña */}
                <TextField
                  size="small"
                  fullWidth
                  name="confirmPassword"
                  label="Confirmar Contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={form.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  error={form.password !== form.confirmPassword && form.confirmPassword.length > 0}
                  helperText={form.password !== form.confirmPassword && form.confirmPassword.length > 0 ? "Las contraseñas no coinciden" : ""}
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
                      '&.Mui-error': {
                        '&:hover fieldset': {
                          borderColor: 'error.main',
                        },
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
                        <LockOutlined sx={{ 
                          color: form.password !== form.confirmPassword && form.confirmPassword.length > 0 
                            ? 'error.main' 
                            : 'primary.main' 
                        }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  disabled={loading || progress < 80}
                  size="medium"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddRounded />}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    background: progress >= 80 
                      ? 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)'
                      : 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                    boxShadow: progress >= 80 
                      ? '0 8px 24px rgba(106, 27, 154, 0.3)'
                      : '0 4px 12px rgba(158, 158, 158, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: progress >= 80 
                        ? 'linear-gradient(135deg, #4a148c 0%, #303f9f 100%)'
                        : 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                      boxShadow: progress >= 80 
                        ? '0 12px 32px rgba(106, 27, 154, 0.4)'
                        : '0 4px 12px rgba(158, 158, 158, 0.2)',
                      transform: progress >= 80 ? 'translateY(-2px)' : 'none',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
                      color: 'white',
                    }
                  }}
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </Stack>
            </Box>

            {/* Footer decorativo */}
            <Box 
              sx={{ 
                mt: 2.5, 
                pt: 2, 
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
                ¿Ya tienes cuenta?{' '}
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
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Inicia sesión aquí
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}