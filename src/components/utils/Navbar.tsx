import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Fade,
} from '@mui/material';
import {
  Bell,
  Flower2,
  LogOut,
  MessageSquare,
  ShoppingBag,
  User,
  Search,
  PackagePlus,
  Heart,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getRolesFromToken } from '../../api/userServices';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/g1/losbandalos/Icesi-Trade/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navButtonStyles = {
    borderRadius: '24px',
    textTransform: 'none',
    fontWeight: 500,
    px: 3,
    py: 1,
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
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
      transform: 'translateY(-4px)',
      transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    },
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(106, 27, 154, 0.15)',
      '&::before': {
        transform: 'translateY(0)',
      },
    },
  };

  const gradientButtonStyles = {
    ...navButtonStyles,
    background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
    color: 'white',
    border: 'none',
    '&:hover': {
      ...navButtonStyles['&:hover'],
      background: 'linear-gradient(135deg, #5a1589 0%, #354aa0 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 28px rgba(106, 27, 154, 0.25)',
    },
  };

  const adminButtonStyles = {
    ...navButtonStyles,
    background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
    color: 'white',
    border: 'none',
    fontWeight: 600,
    '&:hover': {
      ...navButtonStyles['&:hover'],
      background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
    },
  };

  const renderNavItems = () => (
    <Fade in timeout={300}>
      <Box display="flex" alignItems="center" gap={1.5}>
        <Button
          component={Link}
          to="/g1/losbandalos/Icesi-Trade/search"
          variant="outlined"
          startIcon={<Search size={18} />}
          sx={{
            ...navButtonStyles,
            borderColor: '#6a1b9a',
            color: '#6a1b9a',
            '&:hover': {
              ...navButtonStyles['&:hover'],
              borderColor: '#6a1b9a',
              backgroundColor: 'rgba(106, 27, 154, 0.04)',
            },
          }}
        >
           Buscar
        </Button>

        <Button
          component={Link}
          to="/g1/losbandalos/Icesi-Trade/create-product"
          variant="contained"
          startIcon={<PackagePlus size={18} />}
          sx={gradientButtonStyles}
        >
           Crear
        </Button>

        <Button
          component={Link}
          to="/g1/losbandalos/Icesi-Trade/my-products"
          variant="outlined"
          startIcon={<ShoppingBag size={18} />}
          sx={{
            ...navButtonStyles,
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              ...navButtonStyles['&:hover'],
              borderColor: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
           Mis productos
        </Button>

        <Button
          component={Link}
          to="/g1/losbandalos/Icesi-Trade/my-purchases"
          variant="outlined"
          startIcon={<ShoppingBag size={18} />}
          sx={{
            ...navButtonStyles,
            borderColor: '#4caf50',
            color: '#4caf50',
            '&:hover': {
              ...navButtonStyles['&:hover'],
              borderColor: '#4caf50',
              backgroundColor: 'rgba(76, 175, 80, 0.04)',
            },
          }}
        >
           Mis compras
        </Button>

        <Button
          component={Link}
          to="/g1/losbandalos/Icesi-Trade/my-favorites"
          variant="outlined"
          startIcon={<Heart size={18} />}
          sx={{
            ...navButtonStyles,
            borderColor: '#f44336',
            color: '#f44336',
            '&:hover': {
              ...navButtonStyles['&:hover'],
              borderColor: '#f44336',
              backgroundColor: 'rgba(244, 67, 54, 0.04)',
            },
          }}
        >
           Favoritos
        </Button>

        {getRolesFromToken()?.includes('ROLE_ADMIN') && (
          <Button
            component={Link}
            to="/g1/losbandalos/Icesi-Trade/admin-panel"
            variant="contained"
            sx={adminButtonStyles}
          >
            ⚡ Admin
          </Button>
        )}
      </Box>
    </Fade>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      PaperProps={{
        sx: {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(106, 27, 154, 0.1)',
        },
      }}
    >
      <Box sx={{ width: 280, pt: 3 }}>
        <Box
          sx={{
            px: 3,
            pb: 2,
            borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
            }}
          >
            📱 Menú
          </Typography>
        </Box>
        <List sx={{ px: 1 }}>
          {[
            { icon: Search, text: ' Buscar', path: '/search' },
            { icon: PackagePlus, text: ' Crear', path: '/create-product' },
            { icon: ShoppingBag, text: ' Mis productos', path: '/my-products' },
            { icon: ShoppingBag, text: ' Mis compras', path: '/my-purchases' },
            { icon: Heart, text: ' Favoritos', path: '/my-favorites' },
          ].map((item, index) => (
            <ListItem
              key={index}
              sx={{
                borderRadius: '16px',
                mb: 1,
                mx: 1,
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  backgroundColor: 'rgba(106, 27, 154, 0.04)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <item.icon size={20} color="#6a1b9a" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Link
                    to={`/g1/losbandalos/Icesi-Trade${item.path}`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textDecoration: 'none',
                      color: '#2c2c2c',
                      fontWeight: 500,
                    }}
                  >
                    {item.text}
                  </Link>
                }
              />
            </ListItem>
          ))}
          {getRolesFromToken()?.includes('ROLE_ADMIN') && (
            <ListItem
              sx={{
                borderRadius: '16px',
                mb: 1,
                mx: 1,
                background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemText
                primary={
                  <Link
                    to="/g1/losbandalos/Icesi-Trade/admin-panel"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      textDecoration: 'none',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    ⚡ Admin
                  </Link>
                }
              />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(106, 27, 154, 0.1)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1 }}>
        {/* Logo */}
        <Fade in timeout={300}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                p: 1,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  transform: 'scale(1.05) rotate(5deg)',
                },
              }}
            >
              <Flower2 size={24} color="white" />
            </Box>
            <Typography
              variant="h5"
              component={Link}
              to="/g1/losbandalos/Icesi-Trade"
              sx={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              Icesi Trade
            </Typography>
          </Box>
        </Fade>

        {/* Usuario no autenticado */}
        {!user && (
          <Fade in timeout={400}>
            <Box display="flex" gap={1.5}>
              <Button
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/login"
                variant="outlined"
                sx={{
                  ...navButtonStyles,
                  borderColor: '#6a1b9a',
                  color: '#6a1b9a',
                  '&:hover': {
                    ...navButtonStyles['&:hover'],
                    borderColor: '#6a1b9a',
                    backgroundColor: 'rgba(106, 27, 154, 0.04)',
                  },
                }}
              >
                Iniciar sesión
              </Button>
              <Button
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/register"
                variant="contained"
                sx={gradientButtonStyles}
              >
                Registrarse
              </Button>
            </Box>
          </Fade>
        )}

        {/* Usuario autenticado */}
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            {/* Botones de navegación desktop */}
            {!isMobile && renderNavItems()}

            {/* Notificaciones y Chat */}
            <Box display="flex" gap={1}>
              <IconButton
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/notifications"
                sx={{
                  borderRadius: '16px',
                  p: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Badge
                  color="error"
                  variant="dot"
                  overlap="circular"
                  sx={{
                    '& .MuiBadge-badge': {
                      animation: 'pulse 2s infinite',
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)', opacity: 1 },
                        '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                        '100%': { transform: 'scale(1)', opacity: 1 },
                      },
                    },
                  }}
                >
                  <Bell size={20} color="#1976d2" />
                </Badge>
              </IconButton>

              {/* Botón de admin solo en mobile y si es admin */}
              {isMobile && getRolesFromToken()?.includes('ROLE_ADMIN') && (
                <IconButton
                  component={Link}
                  to="/g1/losbandalos/Icesi-Trade/admin-panel"
                  sx={{
                    borderRadius: '16px',
                    p: 1.5,
                    background: 'rgba(255, 193, 7, 0.08)',
                    '&:hover': {
                      background: 'rgba(255, 193, 7, 0.18)',
                      transform: 'scale(1.1)',
                    },
                  }}
                  title="Admin"
                >
                  <Flower2 size={20} color="#ff9800" />
                </IconButton>
              )}

              <IconButton
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/chat"
                sx={{
                  borderRadius: '16px',
                  p: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    backgroundColor: 'rgba(76, 175, 80, 0.04)',
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <MessageSquare size={20} color="#4caf50" />
              </IconButton>
            </Box>

            {/* Avatar y menú de usuario */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              <Badge
                color="success"
                variant="dot"
                overlap="circular"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#4caf50',
                    animation: 'pulse 2s infinite',
                  },
                }}
              >
                <Avatar
                  sx={{
                    background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                    color: 'white',
                    fontWeight: 600,
                    width: 40,
                    height: 40,
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(106, 27, 154, 0.1)',
                  boxShadow: '0 12px 28px rgba(106, 27, 154, 0.15)',
                  minWidth: 200,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
                    borderRadius: '20px 20px 0 0',
                  },
                },
              }}
            >
              {[
                { icon: User, text: 'Perfil', path: '/profile' },
                { icon: ShoppingBag, text: 'Mis productos', path: '/my-products' },
                { icon: ShoppingBag, text: 'Mis compras', path: '/my-purchases' },
                { icon: Heart, text: 'Mis favoritos', path: '/my-favorites' },
                { icon: Search, text: 'Buscar', path: '/search' },
                { icon: PackagePlus, text: 'Crear', path: '/create-product' },
              ].map((item, index) => (
                <MenuItem
                  key={index}
                  component={Link}
                  to={`/g1/losbandalos/Icesi-Trade${item.path}`}
                  onClick={handleMenuClose}
                  sx={{
                    borderRadius: '12px',
                    mx: 1,
                    my: 0.5,
                    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                    '&:hover': {
                      backgroundColor: 'rgba(106, 27, 154, 0.04)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <item.icon size={16} color="#6a1b9a" style={{ marginRight: 12 }} />
                  <Typography variant="body2" fontWeight={500}>
                    {item.text}
                  </Typography>
                </MenuItem>
              ))}
              {/* Opción de Admin solo si es admin */}
              {getRolesFromToken()?.includes('ROLE_ADMIN') && (
                <MenuItem
                  component={Link}
                  to="/g1/losbandalos/Icesi-Trade/admin-panel"
                  onClick={handleMenuClose}
                  sx={{
                    borderRadius: '12px',
                    mx: 1,
                    my: 0.5,
                    background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <Flower2 size={16} color="#fff" style={{ marginRight: 12 }} />
                  <Typography variant="body2" fontWeight={600}>
                    Admin
                  </Typography>
                </MenuItem>
              )}
              <MenuItem
                onClick={handleLogout}
                sx={{
                  borderRadius: '12px',
                  mx: 1,
                  my: 0.5,
                  mt: 1,
                  borderTop: '1px solid rgba(244, 67, 54, 0.1)',
                  color: '#f44336',
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    backgroundColor: 'rgba(244, 67, 54, 0.04)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <LogOut size={16} style={{ marginRight: 12 }} />
                <Typography variant="body2" fontWeight={500}>
                  Cerrar sesión
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      {renderMobileMenu()}
    </AppBar>
  );
}