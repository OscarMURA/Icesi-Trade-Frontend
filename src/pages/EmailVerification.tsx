import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resendVerification } from '../api/authApi';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert,
  Paper,
  Fade,
  Stack,
  TextField,
} from '@mui/material';
import { 
  CheckCircle,
  Error,
  Email,
  Refresh,
  ArrowBack,
} from '@mui/icons-material';

export default function EmailVerification() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [showResendForm, setShowResendForm] = useState(false);
  const hasAttemptedVerification = useRef(false);

  useEffect(() => {
    if (token && !hasAttemptedVerification.current) {
      hasAttemptedVerification.current = true;
      verifyEmailToken(token);
    } else if (!token) {
      setStatus('error');
      setMessage('No se proporcionó un token de verificación válido.');
    }
  }, [token]);

  const verifyEmailToken = async (token: string) => {
    setLoading(true);
    console.log('Se verifica el token ', token);
    try {
      setStatus('success');
      setMessage('¡Email verificado exitosamente! Ya puedes iniciar sesión.');
    } catch (error: any) {
      console.error('Error verificando email:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error verificando email';
      
      if (errorMessage.includes('expirado')) {
        setStatus('expired');
        setMessage('El enlace de verificación ha expirado. Solicita uno nuevo.');
      } else if (errorMessage.includes('utilizado')) {
        setStatus('error');
        setMessage('Este enlace ya ha sido utilizado.');
      } else {
        setStatus('error');
        setMessage(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Por favor ingresa tu email.');
      return;
    }

    setLoading(true);
    try {
      await resendVerification(email);
      setMessage('Email de verificación reenviado exitosamente. Revisa tu bandeja de entrada.');
      setShowResendForm(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error reenviando verificación';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" color="text.secondary">
              Verificando tu email...
            </Typography>
          </Stack>
        );

      case 'success':
        return (
          <Stack spacing={3} alignItems="center">
            <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
            <Typography variant="h5" color="success.main" fontWeight="bold">
              ¡Verificación exitosa!
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              Tu cuenta ha sido verificada. Ya puedes iniciar sesión y usar todas las funcionalidades de Icesi Trade.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Ir al login
            </Button>
          </Stack>
        );

      case 'error':
      case 'expired':
        return (
          <Stack spacing={3} alignItems="center">
            <Error sx={{ fontSize: 80, color: 'error.main' }} />
            <Typography variant="h5" color="error.main" fontWeight="bold">
              Error de verificación
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center">
              {message}
            </Typography>
            
            {token && (
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  hasAttemptedVerification.current = false;
                  setStatus('verifying');
                  setMessage('');
                }}
                sx={{ borderRadius: 3, py: 1.5 }}
              >
                Intentar verificar de nuevo
              </Button>
            )}
            
            {status === 'expired' && (
              <Box sx={{ width: '100%', maxWidth: 400 }}>
                {!showResendForm ? (
                  <Button
                    variant="outlined"
                    startIcon={<Refresh />}
                    onClick={() => setShowResendForm(true)}
                    fullWidth
                    sx={{ borderRadius: 3, py: 1.5 }}
                  >
                    Reenviar verificación
                  </Button>
                ) : (
                  <Box component="form" onSubmit={handleResendVerification}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        sx={{ borderRadius: 3 }}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <Email />}
                        sx={{
                          background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                          borderRadius: 3,
                          py: 1.5,
                          fontWeight: 600,
                        }}
                      >
                        {loading ? 'Enviando...' : 'Reenviar verificación'}
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
            
            <Button
              variant="text"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              Volver al login
            </Button>
          </Stack>
        );

      default:
        return null;
    }
  };

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
      <Container component="main" maxWidth="sm">
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(106, 27, 154, 0.1)',
              borderRadius: 4,
              p: { xs: 3, sm: 4 },
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
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
            {message && (
              <Alert 
                severity={status === 'success' ? 'success' : 'error'} 
                sx={{ mb: 3 }}
              >
                {message}
              </Alert>
            )}
            
            {renderContent()}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}