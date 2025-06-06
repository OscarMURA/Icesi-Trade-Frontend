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
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
            {/* Botón de búsqueda */}
            <Button
              component={Link}
              to="/g1/losbandalos/Icesi-Trade/search"
              variant="outlined"
              startIcon={<Search size={18} />}
              sx={{ borderRadius: '999px' }}
            >
              Buscar
            </Button>

            {/* Botón de crear productos */}
            <Button
              component={Link}
              to="/g1/losbandalos/Icesi-Trade/create-product"
              variant="contained"
              startIcon={<PackagePlus size={18} />}
              sx={{ backgroundColor: '#1e40af', borderRadius: '999px' }}
            >
              Crear
            </Button>

            {/* Botón de mis ventas */}
            <Button
              component={Link}
              to="/g1/losbandalos/Icesi-Trade/my-sales"
              variant="outlined"
              startIcon={<ShoppingBag size={18} />}
              sx={{ borderRadius: '999px' }}
            >
              Mis ventas
            </Button>

            {/* Botón de mis compras */}
            <Button
              component={Link}
              to="/g1/losbandalos/Icesi-Trade/my-purchases"
              variant="outlined"
              startIcon={<ShoppingBag size={18} />}
              sx={{ borderRadius: '999px' }}
            >
              Mis compras
            </Button>

            {/* Notificaciones (campanita) */}
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

            {/* Chat */}
            <IconButton component={Link} to="/g1/losbandalos/Icesi-Trade/chat">
              <MessageSquare className="text-gray-600" />
            </IconButton>

            {/* Menú de usuario */}
            <IconButton onClick={handleMenuOpen}>
              <Avatar sx={{ bgcolor: '#cfe8fc', color: '#1e40af' }}>
                {getInitials(user.name)}
              </Avatar>
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
    </AppBar>
  );
}