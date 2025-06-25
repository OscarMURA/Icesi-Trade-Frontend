import { useState } from 'react';
import {
  Box,
  Modal,
  Backdrop,
  IconButton,
  Fade,
  Paper,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  Close,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';

interface ProductImageGalleryProps {
  imageUrl?: string;
  title: string;
  status: string;
  price: number;
}

export default function ProductImageGallery({
  imageUrl,
  title,
  status,
  price,
}: ProductImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
  const handleResetZoom = () => setZoom(1);
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const defaultImage = 'https://via.placeholder.com/600x400?text=Sin+Imagen';

  return (
    <>
      {/* Vista previa de la imagen */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          cursor: 'pointer',
          '&:hover .image-overlay': {
            opacity: 1,
          },
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <Box
          component="img"
          src={imageUrl || defaultImage}
          alt={title}
          sx={{
            width: '100%',
            height: 400,
            objectFit: 'cover',
            display: 'block',
          }}
        />
        
        {/* Overlay con información */}
        <Box
          className="image-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(106, 27, 154, 0.8) 0%, rgba(63, 81, 181, 0.8) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 3,
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Chip
              label={status}
              color={status === 'excellent' ? 'success' : status === 'good' ? 'warning' : 'error'}
              sx={{ color: 'white', fontWeight: 600 }}
            />
            <IconButton
              sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <ZoomIn />
            </IconButton>
          </Stack>
          
          <Box>
            <Typography variant="h5" color="white" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" color="white" fontWeight={700}>
              ${price.toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Modal para vista completa */}
      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setZoom(1);
          setIsFullscreen(false);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Fade in={isModalOpen}>
          <Paper
            sx={{
              position: 'relative',
              maxWidth: '95vw',
              maxHeight: '95vh',
              overflow: 'hidden',
              borderRadius: 3,
              bgcolor: 'background.paper',
              boxShadow: 24,
            }}
          >
            {/* Header del modal */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6" color="white" fontWeight={600}>
                {title}
              </Typography>
              
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                  sx={{ color: 'white' }}
                >
                  <ZoomOut />
                </IconButton>
                <IconButton
                  onClick={handleResetZoom}
                  sx={{ color: 'white' }}
                >
                  <ZoomIn />
                </IconButton>
                <IconButton
                  onClick={toggleFullscreen}
                  sx={{ color: 'white' }}
                >
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>
                <IconButton
                  onClick={() => {
                    setIsModalOpen(false);
                    setZoom(1);
                    setIsFullscreen(false);
                  }}
                  sx={{ color: 'white' }}
                >
                  <Close />
                </IconButton>
              </Stack>
            </Box>

            {/* Contenido de la imagen */}
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto',
                cursor: zoom > 1 ? 'grab' : 'default',
                '&:active': {
                  cursor: zoom > 1 ? 'grabbing' : 'default',
                },
              }}
            >
              <Box
                component="img"
                src={imageUrl || defaultImage}
                alt={title}
                sx={{
                  maxWidth: isFullscreen ? '100vw' : '90vw',
                  maxHeight: isFullscreen ? '100vh' : '80vh',
                  objectFit: 'contain',
                  transform: `scale(${zoom})`,
                  transition: 'transform 0.3s ease',
                  userSelect: 'none',
                }}
              />
            </Box>

            {/* Footer con información */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                p: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Chip
                    label={status}
                    color={status === 'excellent' ? 'success' : status === 'good' ? 'warning' : 'error'}
                    sx={{ color: 'white', fontWeight: 600 }}
                  />
                  <Typography variant="body2" color="white" sx={{ opacity: 0.8 }}>
                    Zoom: {Math.round(zoom * 100)}%
                  </Typography>
                </Stack>
                <Typography variant="h5" color="white" fontWeight={700}>
                  ${price.toLocaleString()}
                </Typography>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    </>
  );
} 