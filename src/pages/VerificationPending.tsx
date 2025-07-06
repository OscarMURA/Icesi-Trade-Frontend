import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Email,
  Refresh,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';

export default function VerificationPending() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const initialMessage = location.state?.message || '';
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>(initialMessage);
  const [emailInput, setEmailInput] = useState<string>(email);
  const [showResendForm, setShowResendForm] = useState(false);

  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setMessage('Por favor ingresa tu email.');
      return;
    }

    setLoading(true);
    try {
      await resendVerification(emailInput);
      setMessage('Email de verificación reenviado exitosamente. Revisa tu bandeja de entrada.');
      setShowResendForm(false);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error reenviando verificación';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
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
            <Stack spacing={3} alignItems="center">
              <CheckCircle sx={{ fontSize: 80, color: 'success.main' }} />
              
              <Box textAlign="center">
                <Typography variant="h4" color="success.main" fontWeight="bold" gutterBottom>
                  ¡Registro exitoso!
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Tu cuenta ha sido creada correctamente
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Hemos enviado un email de verificación a <strong>{email}</strong>. 
                  Por favor revisa tu bandeja de entrada y haz clic en el enlace de verificación.
                </Typography>
              </Box>

              {message && (
                <Alert 
                  severity={message.includes('exitosamente') ? 'success' : 'error'} 
                  sx={{ width: '100%' }}
                >
                  {message}
                </Alert>
              )}

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
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
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
              
              <Button
                variant="text"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/login')}
                sx={{ mt: 2 }}
              >
                Volver al login
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}
