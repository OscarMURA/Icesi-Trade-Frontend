import { useState } from 'react';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Stack, 
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
  LinearProgress,
  Fade,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { UserResponseDto } from '../../types/userTypes';
import { updateUser } from '../../api/userServices';

export default function UserEditForm({
  user,
  onCancel,
  onUpdate,
}: {
  user: UserResponseDto;
  onCancel: () => void;
  onUpdate: (updatedUser: UserResponseDto) => void;
}) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    password: '', 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError(null); // Limpiar errores al escribir
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!form.email.trim()) {
      setError('El correo electrónico es obligatorio');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('El correo electrónico no es válido');
      return false;
    }
    if (form.phone && !/^\+?[\d\s]+$/.test(form.phone)) {
      setError('El número de teléfono no es válido');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token de autenticación');

      const dataToSend = {
        id: user.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        password: form.password.trim() === '' ? null : form.password.trim(),
      };

      const updated = await updateUser(user.id, dataToSend, token);
      setSuccess(true);
      
      // Esperar un momento para mostrar el éxito antes de cerrar
      setTimeout(() => {
        onUpdate({ ...updated, password: '' });
      }, 1000);
      
    } catch (err) {
      console.error('Error actualizando usuario', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return; // Prevenir cancelar durante la carga
    onCancel();
  };

  return (
    <Fade in timeout={500}>
      <Card
        sx={{
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 24px rgba(106,27,154,0.12)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
            opacity: 1,
          }
        }}
      >
        {loading && (
          <LinearProgress 
            sx={{ 
              position: 'absolute',
              top: 4,
              left: 0,
              right: 0,
              height: '3px',
              borderRadius: '2px',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
              }
            }} 
          />
        )}

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Header */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 1
              }}
            >
              <EditIcon sx={{ color: '#6a1b9a' }} />
              Editar Información
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500
              }}
            >
              Actualiza tu información personal
            </Typography>
          </Box>

          <Divider 
            sx={{ 
              mb: 3, 
              background: 'linear-gradient(90deg, transparent 0%, rgba(106,27,154,0.2) 50%, transparent 100%)'
            }} 
          />

          {/* Alertas */}
          {error && (
            <Fade in timeout={300}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    fontSize: '20px'
                  }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Error</AlertTitle>
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in timeout={300}>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    fontSize: '20px'
                  }
                }}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>¡Éxito!</AlertTitle>
                Perfil actualizado correctamente
              </Alert>
            </Fade>
          )}

          {/* Formulario */}
          <Stack spacing={3}>
            <TextField
              name="name"
              label="Nombre completo"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#6a1b9a' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                    }
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                      borderWidth: '2px',
                      boxShadow: '0 0 0 3px rgba(106,27,154,0.1)'
                    }
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6a1b9a',
                  fontWeight: 600
                }
              }}
            />

            <TextField
              name="email"
              label="Correo electrónico"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#6a1b9a' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                    }
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                      borderWidth: '2px',
                      boxShadow: '0 0 0 3px rgba(106,27,154,0.1)'
                    }
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6a1b9a',
                  fontWeight: 600
                }
              }}
            />

            <TextField
              name="phone"
              label="Número de teléfono"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#6a1b9a' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                    }
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                      borderWidth: '2px',
                      boxShadow: '0 0 0 3px rgba(106,27,154,0.1)'
                    }
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6a1b9a',
                  fontWeight: 600
                }
              }}
            />

            <TextField
              name="password"
              label="Nueva contraseña (opcional)"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#6a1b9a' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      disabled={loading}
                      sx={{ 
                        color: '#6a1b9a',
                        '&:hover': {
                          backgroundColor: 'rgba(106,27,154,0.1)'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Deja en blanco para mantener la contraseña actual"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                    }
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#6a1b9a',
                      borderWidth: '2px',
                      boxShadow: '0 0 0 3px rgba(106,27,154,0.1)'
                    }
                  }
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6a1b9a',
                  fontWeight: 600
                },
                '& .MuiFormHelperText-root': {
                  color: 'text.secondary',
                  fontSize: '0.75rem'
                }
              }}
            />
          </Stack>

          {/* Botones de acción */}
          <Box sx={{ mt: 4 }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading || success}
                startIcon={<SaveIcon />}
                sx={{
                  background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                  borderRadius: '16px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  minWidth: '140px',
                  boxShadow: '0 4px 12px rgba(106,27,154,0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(106,27,154,0.4)',
                    background: 'linear-gradient(135deg, #7b1fa2 0%, #3949ab 100%)',
                  },
                  '&:disabled': {
                    background: 'rgba(106,27,154,0.3)',
                    transform: 'none',
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? 'Guardando...' : success ? '¡Guardado!' : 'Guardar Cambios'}
              </Button>

              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
                startIcon={<CancelIcon />}
                sx={{
                  borderRadius: '16px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  minWidth: '140px',
                  borderColor: '#757575',
                  color: '#757575',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    borderColor: '#f44336',
                    color: '#f44336',
                    backgroundColor: 'rgba(244,67,54,0.04)',
                    transform: 'translateY(-1px)',
                  },
                  '&:disabled': {
                    borderColor: 'rgba(117,117,117,0.3)',
                    color: 'rgba(117,117,117,0.3)'
                  }
                }}
              >
                Cancelar
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}