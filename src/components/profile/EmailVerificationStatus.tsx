import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Alert,
  CircularProgress,
  Stack,
  Chip
} from '@mui/material';
import { 
  Email,
  CheckCircle,
  Warning,
  Send
} from '@mui/icons-material';
import { getVerificationStatus, requestVerification } from '../../api/authApi';

export default function EmailVerificationStatus() {
  const [verificationStatus, setVerificationStatus] = useState<{
    email: string;
    verified: boolean;
    name: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = await getVerificationStatus();
      setVerificationStatus(status);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    try {
      setRequesting(true);
      setError(null);
      setSuccess(null);
      
      await requestVerification();
      setSuccess('Email de verificación enviado exitosamente. Revisa tu bandeja de entrada.');
      
      // Recargar el estado de verificación
      await loadVerificationStatus();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'divider',
          mb: 3
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography>Cargando estado de verificación...</Typography>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'error.light',
          mb: 3
        }}
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          onClick={loadVerificationStatus}
          startIcon={<Email />}
        >
          Reintentar
        </Button>
      </Paper>
    );
  }

  if (!verificationStatus) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        background: verificationStatus.verified 
          ? 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)'
          : 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
        border: '1px solid',
        borderColor: verificationStatus.verified ? 'success.light' : 'warning.light',
        mb: 3
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Email color={verificationStatus.verified ? 'success' : 'warning'} />
          <Typography variant="h6" fontWeight={600}>
            Estado de Verificación de Email
          </Typography>
          <Chip
            icon={verificationStatus.verified ? <CheckCircle /> : <Warning />}
            label={verificationStatus.verified ? 'Verificado' : 'No verificado'}
            color={verificationStatus.verified ? 'success' : 'warning'}
            variant="outlined"
          />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Email: {verificationStatus.email}
        </Typography>

        {verificationStatus.verified ? (
          <Alert severity="success" icon={<CheckCircle />}>
            Tu cuenta está verificada. Puedes usar todas las funcionalidades de Icesi Trade.
          </Alert>
        ) : (
          <Box>
            <Alert severity="warning" icon={<Warning />} sx={{ mb: 2 }}>
              Tu cuenta no está verificada. Verifica tu email para acceder a todas las funcionalidades.
            </Alert>
            
            <Button
              variant="contained"
              startIcon={requesting ? <CircularProgress size={20} /> : <Send />}
              onClick={handleRequestVerification}
              disabled={requesting}
              sx={{
                background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              {requesting ? 'Enviando...' : 'Solicitar verificación'}
            </Button>
          </Box>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}
      </Stack>
    </Paper>
  );
} 