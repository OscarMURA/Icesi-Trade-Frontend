import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Skeleton, 
  Container,
  Fade,
  Paper,
  Stack,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  SearchOff,
  FilterList,
  GridView,
  ViewList,
  Sort,
  TuneRounded,
} from '@mui/icons-material';
import { useState } from 'react';

// Mock Product type for demonstration
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  status: string;
  location: string;
}

interface QueryResultsProps {
  results: Product[];
  isLoading: boolean;
  searchQuery?: string;
  activeFiltersCount?: number;
}

// Mock ProductCard component for demonstration
function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Fade in timeout={300}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        elevation={isHovered ? 8 : 2}
        sx={{
          height: '100%',
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          border: '1px solid',
          borderColor: isHovered ? 'primary.main' : 'divider',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f4ff 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #6a1b9a 0%, #3f51b5 100%)',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }
        }}
      >
        <Box
          sx={{
            height: 200,
            background: `url(${product.image}) center/cover, linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)`,
            position: 'relative',
          }}
        >
          <Chip
            label={product.status}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: product.status === 'NUEVO' ? 'success.main' : 
                      product.status === 'SEMINUEVO' ? 'warning.main' : 'info.main',
              color: 'white',
              fontWeight: 600,
            }}
          />
        </Box>
        <CardContent sx={{ p: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {product.category} • {product.location}
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ${product.price.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Fade>
  );
}

export default function QueryResults({ 
  results, 
  isLoading, 
  searchQuery = '',
  activeFiltersCount = 0 
}: QueryResultsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Loading skeleton
  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="text" width={150} height={24} />
        </Box>
        
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          {[...Array(isMobile ? 2 : isTablet ? 4 : 8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Card sx={{ borderRadius: 3 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="80%" height={28} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="text" width="40%" height={32} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  // Empty state
  if (results.length === 0) {
    return (
      <Container maxWidth="md">
        <Fade in timeout={500}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              p: { xs: 4, sm: 6, md: 8 },
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
              }}
            >
              <SearchOff sx={{ fontSize: { xs: 40, sm: 50, md: 60 }, color: 'text.secondary' }} />
            </Box>
            
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              No se encontraron productos
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, maxWidth: 400, mx: 'auto', lineHeight: 1.6 }}
            >
              {searchQuery 
                ? `No hay resultados para "${searchQuery}". Intenta con otros términos de búsqueda.`
                : 'Intenta ajustar los filtros o términos de búsqueda.'
              }
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              alignItems="center"
            >
              <Chip
                icon={<TuneRounded />}
                label="Prueba ajustar los filtros"
                variant="outlined"
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              />
              <Chip
                icon={<SearchOff />}
                label="Busca términos más generales"
                variant="outlined"
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              />
            </Stack>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // Results header
  const ResultsHeader = () => (
    <Box sx={{ mb: { xs: 3, sm: 4 } }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={2}
      >
        <Box>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6a1b9a 0%, #3f51b5 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5,
            }}
          >
            {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
            {searchQuery && (
              <Chip
                label={`"${searchQuery}"`}
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            )}
            {activeFiltersCount > 0 && (
              <Chip
                icon={<FilterList />}
                label={`${activeFiltersCount} ${activeFiltersCount === 1 ? 'filtro' : 'filtros'}`}
                size="small"
                variant="outlined"
                sx={{ borderColor: 'primary.main', color: 'primary.main' }}
              />
            )}
          </Stack>
        </Box>

        {!isMobile && (
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => setViewMode('grid')}
              sx={{
                color: viewMode === 'grid' ? 'primary.main' : 'text.secondary',
                bgcolor: viewMode === 'grid' ? 'primary.light' : 'transparent',
              }}
            >
              <GridView />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              sx={{
                color: viewMode === 'list' ? 'primary.main' : 'text.secondary',
                bgcolor: viewMode === 'list' ? 'primary.light' : 'transparent',
              }}
            >
              <ViewList />
            </IconButton>
            <Divider orientation="vertical" flexItem />
            <IconButton sx={{ color: 'text.secondary' }}>
              <Sort />
            </IconButton>
          </Stack>
        )}
      </Stack>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
      <ResultsHeader />
      
      <Grid 
        container 
        spacing={{ xs: 2, sm: 3, md: 4 }}
        sx={{
          '& .MuiGrid-item': {
            display: 'flex',
          }
        }}
      >
        {results.map((product, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={viewMode === 'list' ? 12 : 4} 
            lg={viewMode === 'list' ? 12 : 3} 
            key={product.id}
          >
            <Fade in timeout={300 + (index * 50)}>
              <Box sx={{ width: '100%' }}>
                <ProductCard product={product} />
              </Box>
            </Fade>
          </Grid>
        ))}
      </Grid>
      
      {/* Load more button placeholder */}
      {results.length > 12 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8f4ff 0%, #ffffff 100%)',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Mostrando {Math.min(results.length, 12)} de {results.length} productos
            </Typography>
          </Paper>
        </Box>
      )}
    </Container>
  );
}