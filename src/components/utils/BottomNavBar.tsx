import { Box, Paper, IconButton, Typography, Fade } from '@mui/material';
import { ShoppingBag, Heart, PackagePlus, Search, ShoppingCart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import { useState, useEffect } from 'react';

export default function BottomNavBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Auto-hide en scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setVisible(false);
        } else {
          setVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  if (!isMobile) return null;

  // Definir rutas con emojis y labels
  const items = [
    {
      to: '/g1/losbandalos/Icesi-Trade/my-products',
      icon: <ShoppingBag size={22} />,
      active: location.pathname.includes('/my-products'),
      color: '#1976d2',
    },
    {
      to: '/g1/losbandalos/Icesi-Trade/my-favorites',
      icon: <Heart size={22} />,
      active: location.pathname.includes('/my-favorites'),
      color: '#f44336',
    },
    {
      to: '/g1/losbandalos/Icesi-Trade/create-product',
      icon: <PackagePlus size={28} />,
      center: true,
      active: location.pathname.includes('/create-product'),
      color: '#6a1b9a',
    },
    {
      to: '/g1/losbandalos/Icesi-Trade/search',
      icon: <Search size={22} />,

      active: location.pathname.includes('/search'),
      color: '#2196f3',
    },
    {
      to: '/g1/losbandalos/Icesi-Trade/my-purchases',
      icon: <ShoppingCart size={22} />,
      active: location.pathname.includes('/my-purchases'),
      color: '#4caf50',
    },
  ];

  return (
    <Fade in={visible} timeout={300}>
      <Paper
        elevation={0}
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1201,
          borderRadius: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(106, 27, 154, 0.1)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          py: 1,
          px: 2,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 50%, #1976d2 100%)',
          },
          // Sombra suave hacia arriba
          boxShadow: '0 -8px 32px rgba(106, 27, 154, 0.08)',
        }}
      >
        {items.map((item, idx) => (
          <Box 
            key={idx} 
            sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            {/* Indicador activo */}
            {item.active && !item.center && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -8,
                  width: '32px',
                  height: '3px',
                  background: `linear-gradient(90deg, ${item.color}, ${item.color}88)`,
                  borderRadius: '0 0 8px 8px',
                  animation: 'slideDown 0.3s ease-out',
                  '@keyframes slideDown': {
                    '0%': { transform: 'translateY(-6px)', opacity: 0 },
                    '100%': { transform: 'translateY(0)', opacity: 1 },
                  },
                }}
              />
            )}

            <IconButton
              component={Link}
              to={item.to}
              sx={{
                position: 'relative',
                background: item.center
                  ? 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)'
                  : item.active
                  ? `${item.color}12`
                  : 'transparent',
                color: item.center 
                  ? 'white' 
                  : item.active 
                  ? item.color 
                  : '#757575',
                width: item.center ? 64 : 48,
                height: item.center ? 64 : 48,
                borderRadius: item.center ? '20px' : '16px',
                mt: item.center ? -4 : 0,
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                overflow: 'hidden',
                
                // Pseudo-elemento para glassmorphism en botón central
                ...(item.center && {
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(106, 27, 154, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    pointerEvents: 'none',
                  },
                }),

                '&:hover': {
                  transform: item.center 
                    ? 'scale(1.1) translateY(-2px)' 
                    : 'scale(1.05) translateY(-1px)',
                  background: item.center
                    ? 'linear-gradient(135deg, #5a1589 0%, #354aa0 100%)'
                    : `${item.color}18`,
                  color: item.center ? 'white' : item.color,
                  boxShadow: item.center 
                    ? '0 12px 40px rgba(106, 27, 154, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    : `0 4px 16px ${item.color}20`,
                },

                '&:active': {
                  transform: item.center 
                    ? 'scale(1.05) translateY(0px)' 
                    : 'scale(0.98)',
                },
              }}
            >
              {/* Emoji decorativo para botón central */}
              {item.center && (
                <Typography
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    fontSize: '12px',
                    animation: 'bounce 2s infinite',
                    '@keyframes bounce': {
                      '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                      '40%': { transform: 'translateY(-4px)' },
                      '60%': { transform: 'translateY(-2px)' },
                    },
                  }}
                >
                  {item.emoji}
                </Typography>
              )}
              {item.icon}
            </IconButton>

            {/* Label con animación */}
            <Typography
              variant="caption"
              sx={{
                color: item.active ? item.color : '#757575',
                fontWeight: item.active ? 600 : 400,
                fontSize: '11px',
                mt: 0.5,
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                transform: item.active ? 'scale(1.05)' : 'scale(1)',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              {item.label}
            </Typography>

            {/* Dot indicator para item activo */}
            {item.active && !item.center && (
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  mt: 0.5,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '50%': { transform: 'scale(1.2)', opacity: 0.7 },
                    '100%': { transform: 'scale(1)', opacity: 1 },
                  },
                }}
              />
            )}

            {/* Ripple effect en tap */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: item.center ? 64 : 48,
                height: item.center ? 64 : 48,
                borderRadius: item.center ? '20px' : '16px',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 'inherit',
                  background: item.color,
                  opacity: 0,
                  transform: 'scale(0.8)',
                  transition: 'all 0.2s ease-out',
                },
                '&:active::after': {
                  opacity: 0.1,
                  transform: 'scale(1)',
                },
              }}
            />
          </Box>
        ))}

        {/* Floating background blur effect */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(180deg, transparent 0%, rgba(248, 244, 255, 0.4) 100%)',
            pointerEvents: 'none',
            zIndex: -1,
          }}
        />
      </Paper>
    </Fade>
  );
}