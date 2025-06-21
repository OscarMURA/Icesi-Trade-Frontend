import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Switch,
  Button,
  Paper,
  Chip,
  IconButton,
  Avatar,
  Fade,
  Badge,
  FormControlLabel,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  Notifications,
  NotificationsActive,
  CheckCircle,
  Schedule,
  MarkEmailRead,
  FilterList,
  Refresh,
  NotificationsNone,
} from '@mui/icons-material';
import { Notification } from '../types/notificationTypes';
import { getNotifications, markNotificationAsRead } from '../api/notificationApi';
import { getIdFromToken } from '../api/userServices';

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRead, setShowRead] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      const data: Notification[] = await getNotifications();
      const myId = getIdFromToken();
      const onlyMine = data.filter(n => n.userId === myId);
      const sorted = onlyMine.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sorted);
      setError('');
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las notificaciones');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch {
      setError('Error al marcar como leída');
    }
  };

  const handleRefresh = () => {
    fetchNotifications(true);
  };

  const filteredNotifications = notifications.filter((notif) => notif.read === showRead);
  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;

  const getNotificationIcon = (typeId: number) => {
    // Aquí puedes personalizar íconos según el tipo de notificación
    switch (typeId) {
      case 1: return <NotificationsActive />;
      case 2: return <Schedule />;
      default: return <Notifications />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - notifDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)} h`;
    return `Hace ${Math.floor(diffInMinutes / 1440)} días`;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
          <Skeleton variant="rectangular" height={80} />
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <Notifications />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Notificaciones
            </Typography>
          </Box>
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ 
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <Refresh sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} />
          </IconButton>
        </Box>

        {/* Estadísticas */}
        <Stack direction="row" spacing={2}>
          <Chip
            icon={<NotificationsActive />}
            label={`${unreadCount} sin leer`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          <Chip
            icon={<CheckCircle />}
            label={`${readCount} leídas`}
            sx={{
              bgcolor: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        </Stack>
      </Paper>

      {/* Filtros */}
      <Card sx={{ mb: 3, borderRadius: 3 }} elevation={1}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FilterList sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Filtrar notificaciones
              </Typography>
            </Box>
            
            <FormControlLabel
              control={
                <Switch
                  checked={showRead}
                  onChange={() => setShowRead((prev) => !prev)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {showRead ? <CheckCircle /> : <NotificationsActive />}
                  <Typography sx={{ fontWeight: 500 }}>
                    {showRead ? 'Mostrar leídas' : 'Mostrar sin leer'}
                  </Typography>
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Lista de notificaciones */}
      <Stack spacing={2}>
        {filteredNotifications.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              bgcolor: 'grey.50',
            }}
          >
            <NotificationsNone 
              sx={{ 
                fontSize: 80, 
                color: 'grey.400',
                mb: 2
              }} 
            />
            <Typography variant="h6" sx={{ color: 'grey.600', mb: 1 }}>
              No hay notificaciones {showRead ? 'leídas' : 'sin leer'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {showRead 
                ? 'Las notificaciones que marques como leídas aparecerán aquí'
                : 'Te notificaremos cuando tengas nuevas actualizaciones'
              }
            </Typography>
          </Paper>
        ) : (
          filteredNotifications.map((notif, index) => (
            <Fade in key={notif.id} timeout={300 + index * 100}>
              <Card
                elevation={notif.read ? 1 : 3}
                sx={{
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme => theme.shadows[4],
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: notif.read ? 'grey.300' : 'primary.main',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    {/* Ícono de la notificación */}
                    <Avatar
                      sx={{
                        bgcolor: notif.read ? 'grey.100' : 'primary.light',
                        color: notif.read ? 'grey.600' : 'primary.main',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getNotificationIcon(notif.typeId)}
                    </Avatar>

                    {/* Contenido */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: notif.read ? 400 : 600,
                            color: notif.read ? 'text.secondary' : 'text.primary',
                            pr: 2,
                          }}
                        >
                          {notif.message}
                        </Typography>
                        
                        {!notif.read && (
                          <Badge
                            badgeContent=""
                            color="primary"
                            variant="dot"
                            sx={{
                              '& .MuiBadge-dot': {
                                width: 12,
                                height: 12,
                              }
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          <Schedule sx={{ fontSize: 14 }} />
                          {formatTimeAgo(notif.createdAt)}
                        </Typography>

                        {!notif.read && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<MarkEmailRead />}
                            onClick={() => handleMarkAsRead(notif.id!)}
                            sx={{
                              borderRadius: 2,
                              textTransform: 'none',
                              fontWeight: 500,
                              fontSize: '0.75rem',
                            }}
                          >
                            Marcar leída
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))
        )}
      </Stack>

      {/* Mostrar más información si hay muchas notificaciones */}
      {filteredNotifications.length > 0 && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Mostrando {filteredNotifications.length} de {notifications.length} notificaciones
          </Typography>
        </Box>
      )}
    </Box>
  );
}