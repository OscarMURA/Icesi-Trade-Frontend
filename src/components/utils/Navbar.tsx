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

  const renderNavItems = () => (
    <>
      <Button
        component={Link}
        to="/g1/losbandalos/Icesi-Trade/search"
        variant="outlined"
        startIcon={<Search size={18} />}
        sx={{ borderRadius: '999px' }}
      >
        Buscar
      </Button>

      <Button
        component={Link}
        to="/g1/losbandalos/Icesi-Trade/create-product"
        variant="contained"
        startIcon={<PackagePlus size={18} />}
        sx={{ backgroundColor: '#1e40af', borderRadius: '999px' }}
      >
        Crear
      </Button>

      <Button
        component={Link}
        to="/g1/losbandalos/Icesi-Trade/my-sales"
        variant="outlined"
        startIcon={<ShoppingBag size={18} />}
        sx={{ borderRadius: '999px' }}
      >
        Mis ventas
      </Button>

      <Button
        component={Link}
        to="/g1/losbandalos/Icesi-Trade/my-purchases"
        variant="outlined"
        startIcon={<ShoppingBag size={18} />}
        sx={{ borderRadius: '999px' }}
      >
        Mis compras
      </Button>

      <Button
        component={Link}
        to="/g1/losbandalos/Icesi-Trade/my-favorites"
        variant="outlined"
        startIcon={<Heart size={18} />}
        sx={{ borderRadius: '999px' }}
      >
        Favoritos
      </Button>

      {getRolesFromToken()?.includes('ROLE_ADMIN') && (
        <Button
          component={Link}
          to="/g1/losbandalos/Icesi-Trade/admin-panel"
          variant="contained"
          sx={{
            backgroundColor: '#f59e0b',
            borderRadius: '999px',
            fontWeight: 600,
            color: 'white',
            '&:hover': { backgroundColor: '#d97706' },
          }}
        >
          Admin
        </Button>
      )}
    </>
  );

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <List>
          <ListItem>
            <ListItemIcon>
              <Search size={20} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  to="/g1/losbandalos/Icesi-Trade/search"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Buscar
                </Link>
              }
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <PackagePlus size={20} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Link
                  to="/g1/losbandalos/Icesi-Trade/create-product"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Crear
                </Link>
              }
            />
          </ListItem>
          {getRolesFromToken()?.includes('ROLE_ADMIN') && (
            <ListItem>
              <ListItemText
                primary={
                  <Link
                    to="/g1/losbandalos/Icesi-Trade/admin-panel"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ textDecoration: 'none', color: '#f59e0b', fontWeight: 600 }}
                  >
                    Admin
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
    <AppBar position="sticky" sx={{ backgroundColor: '#fefefe', borderBottom: '1px solid #e0e0e0', boxShadow: 0 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Logo */}
        <Box display="flex" alignItems="center" gap={1}>
          <Flower2 size={22} color="rgb(15, 37, 97)" />
          <Typography
            variant="h6"
            component={Link}
            to="/g1/losbandalos/Icesi-Trade"
            sx={{
              textDecoration: 'none',
              background: 'linear-gradient(to right,rgb(15, 37, 97), #1e40af)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontWeight: 700,
            }}
          >
            Icesi Trade
          </Typography>
        </Box>

        {/* Usuario no autenticado */}
        {!user && (
          <Box display="flex" gap={1}>
            <Button
              component={Link}
              to="/g1/losbandalos/Icesi-Trade/login"
              variant="outlined"
              sx={{ borderRadius: '999px' }}
            >
              Iniciar sesión
            </Button>
            <Button
              component={Link}
              to="/g1/losbandalos/Icesi-Trade/register"
              variant="contained"
              sx={{ backgroundColor: '#1e40af', borderRadius: '999px' }}
            >
              Registrarse
            </Button>
          </Box>
        )}

        {/* Usuario autenticado */}
        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            {/* Botones de navegación */}
            {!isMobile && renderNavItems()}

            {/* Notificaciones y Chat siempre visibles */}
            <IconButton
              component={Link}
              to="/g1/losbandalos/Icesi-Trade/notifications"
              sx={{ position: 'relative' }}
            >
              <Badge
                color="error"
                variant="dot"
                overlap="circular"
                sx={{ '& .MuiBadge-badge': { top: 4, right: 4 } }}
              >
                <Bell className="text-gray-600" />
              </Badge>
            </IconButton>

            <IconButton component={Link} to="/g1/losbandalos/Icesi-Trade/chat">
              <MessageSquare className="text-gray-600" />
            </IconButton>

            {/* Avatar y menú de usuario */}
            <IconButton onClick={handleMenuOpen}>
              <Badge
                color="error"
                variant="dot"
                overlap="circular"
                sx={{ '& .MuiBadge-badge': { top: 4, right: 4 } }}
              >
                <Avatar sx={{ bgcolor: '#cfe8fc', color: '#1e40af' }}>
                  {getInitials(user.name)}
                </Avatar>
              </Badge>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <MenuItem
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/profile"
                onClick={handleMenuClose}
              >
                <User fontSize={16} style={{ marginRight: 8 }} />
                Perfil
              </MenuItem>
              <MenuItem
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/my-products"
                onClick={handleMenuClose}
              >
                <ShoppingBag fontSize={16} style={{ marginRight: 8 }} />
                Mis productos
              </MenuItem>
              <MenuItem
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/my-sales"
                onClick={handleMenuClose}
              >
                <ShoppingBag fontSize={16} style={{ marginRight: 8 }} />
                Mis ventas
              </MenuItem>
              <MenuItem
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/my-purchases"
                onClick={handleMenuClose}
              >
                <ShoppingBag fontSize={16} style={{ marginRight: 8 }} />
                Mis compras
              </MenuItem>
              <MenuItem
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/my-favorites"
                onClick={handleMenuClose}
              >
                <Heart fontSize={16} style={{ marginRight: 8 }} />
                Mis favoritos
              </MenuItem>
              <MenuItem
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/search"
                onClick={handleMenuClose}
              >
                <Search fontSize={16} style={{ marginRight: 8 }} />
                Buscar
              </MenuItem>
              <MenuItem
                component={Link}
                to="/g1/losbandalos/Icesi-Trade/create-product"
                onClick={handleMenuClose}
              >
                <PackagePlus fontSize={16} style={{ marginRight: 8 }} />
                Crear
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogOut fontSize={16} style={{ marginRight: 8 }} />
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
      {renderMobileMenu()}
    </AppBar>
  );
}
