# Componentes de Productos

Este directorio contiene todos los componentes relacionados con la visualización y gestión de productos en la aplicación Icesi Trade.

## Componentes Disponibles

### ProductCard

Componente principal para mostrar un producto en formato de tarjeta. Incluye:

- Imagen del producto
- Información básica (título, precio, estado)
- Botones de acción (favoritos, chat, ofertas)
- Funcionalidad de edición para propietarios

### ProductList

Componente para mostrar una lista de productos con filtros y paginación.

### ProductEditForm

Formulario para crear y editar productos.

### ProductInfo

Componente para mostrar información básica de un producto.

### ProductOffers

Componente para gestionar ofertas de un producto.

### ProductImageGallery

**NUEVO** - Componente para mostrar la imagen del producto con funcionalidades avanzadas:

- Vista previa con overlay informativo
- Modal de vista completa con zoom
- Controles de zoom in/out
- Modo pantalla completa
- Información del producto en el modal

### ProductDetailsInfo

**NUEVO** - Componente para mostrar información detallada del producto:

- Título y precio prominentes
- Estado del producto con chips de colores
- Descripción completa
- Información del producto (ubicación, categoría, fechas)
- Información del vendedor
- Botones de acción (hacer oferta, contactar vendedor)
- Funcionalidad de favoritos
- Compartir producto

### ProductOfferModal

**NUEVO** - Modal para hacer ofertas a productos:

- Formulario de oferta con validación
- Cálculo automático de descuento
- Validación de precio (debe ser menor al original)
- Notificación automática al vendedor
- Feedback visual de éxito/error

## Página de Detalles del Producto

La página `ProductDetail` (`/products/:id`) integra todos estos componentes para mostrar una vista completa del producto:

### Características:

- **Layout responsivo**: Dos columnas en desktop, una columna en móvil
- **Galería de imágenes**: Con zoom y vista completa
- **Información detallada**: Todos los datos del producto organizados
- **Acciones del usuario**: Ofertas, chat, favoritos
- **Navegación**: Breadcrumbs y botón de volver
- **Estados de carga**: Skeletons y manejo de errores
- **Boton flotante**: Para actualizar la página

### Funcionalidades:

1. **Vista de imagen completa**: Click en la imagen para abrir modal con zoom
2. **Hacer oferta**: Modal con formulario y validaciones
3. **Contactar vendedor**: Redirige al chat con mensaje predefinido
4. **Agregar a favoritos**: Toggle con estado persistente
5. **Compartir producto**: Usa Web Share API o copia URL
6. **Navegación**: Breadcrumbs y botón de volver
7. **Responsive**: Adapta layout según tamaño de pantalla

## Uso

```tsx
import { ProductDetail } from "../pages/ProductDetail";

// La página se accede via URL: /products/:id
// Ejemplo: /products/123
```

## Dependencias

- Material-UI v7.1.1
- React Router DOM
- Axios para API calls
- Contextos de autenticación y chat

## Notas Técnicas

- Los componentes usan flexbox en lugar de Grid para compatibilidad con Material-UI v7
- Manejo de errores robusto con estados de carga
- Animaciones con Fade para mejor UX
- Diseño con gradientes y efectos visuales modernos
- Responsive design con breakpoints de Material-UI
