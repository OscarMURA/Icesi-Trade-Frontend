# Componentes de Chat

Esta carpeta contiene todos los componentes modulares para el sistema de chat de la aplicación, con soporte completo para dispositivos móviles y desktop.

## 📁 Estructura de Componentes

### 🎯 Componentes Principales

#### `ChatLayout.tsx`

- **Propósito**: Contenedor principal del chat (solo desktop)
- **Props**: `children` - Componentes hijos
- **Responsabilidad**: Layout flexbox para organizar la interfaz

#### `ChatContainer.tsx` ⭐ **NUEVO**

- **Propósito**: Contenedor inteligente que maneja la responsividad
- **Props**: Todas las props necesarias para el chat
- **Responsabilidad**: Detectar dispositivo y mostrar la vista apropiada

#### `UserList.tsx`

- **Propósito**: Lista de usuarios/contactos disponibles
- **Props**:
  - `users` - Array de usuarios
  - `selectedUser` - Usuario seleccionado actualmente
  - `onUserSelect` - Callback para seleccionar usuario
  - `isMobile` - Indica si es vista móvil
- **Responsabilidad**: Mostrar y manejar la selección de usuarios

#### `ChatArea.tsx`

- **Propósito**: Área principal del chat (header + mensajes + input)
- **Props**:
  - `selectedUser` - Usuario con quien se está chateando
  - `messages` - Array de mensajes
  - `currentUserId` - ID del usuario actual
  - `message` - Mensaje actual en el input
  - `onMessageChange` - Callback para cambiar mensaje
  - `onSendMessage` - Callback para enviar mensaje
  - `isConnected` - Estado de conexión WebSocket
  - `isMobile` - Indica si es vista móvil
  - `onBack` - Callback para regresar a la lista (móvil)
- **Responsabilidad**: Orquestar los componentes del área de chat

### 📱 Componentes Responsive

#### `MobileChatHeader.tsx` ⭐ **NUEVO**

- **Propósito**: Header del chat en móvil con botón de regreso
- **Props**:
  - `selectedUser` - Usuario seleccionado
  - `onBack` - Callback para regresar a la lista
- **Responsabilidad**: Header con navegación tipo WhatsApp

#### `MobileUsersHeader.tsx` ⭐ **NUEVO**

- **Propósito**: Header para la lista de usuarios en móvil
- **Props**: Ninguna
- **Responsabilidad**: Título "Chats" para la vista móvil

### 📝 Componentes de Mensajes

#### `MessageList.tsx`

- **Propósito**: Contenedor de la lista de mensajes
- **Props**:
  - `messages` - Array de mensajes
  - `currentUserId` - ID del usuario actual
- **Responsabilidad**: Renderizar lista de mensajes con scroll automático

#### `MessageItem.tsx`

- **Propósito**: Componente individual de mensaje
- **Props**:
  - `message` - Objeto del mensaje
  - `currentUserId` - ID del usuario actual
- **Responsabilidad**: Renderizar un mensaje con estilo diferenciado

#### `MessageInput.tsx`

- **Propósito**: Formulario de envío de mensajes
- **Props**:
  - `message` - Texto del mensaje
  - `onMessageChange` - Callback para cambiar mensaje
  - `onSendMessage` - Callback para enviar mensaje
  - `isConnected` - Estado de conexión
- **Responsabilidad**: Input y botón de envío

### 🎨 Componentes de UI

#### `ChatHeader.tsx`

- **Propósito**: Header del chat con información del usuario (desktop)
- **Props**: `selectedUser` - Usuario seleccionado
- **Responsabilidad**: Mostrar título del chat

#### `EmptyChat.tsx`

- **Propósito**: Estado vacío cuando no hay usuario seleccionado
- **Props**: Ninguna
- **Responsabilidad**: Mensaje de instrucción

#### `ChatLoading.tsx`

- **Propósito**: Estado de carga
- **Props**: Ninguna
- **Responsabilidad**: Indicador de carga

#### `ChatError.tsx`

- **Propósito**: Estado de error con opción de reintentar
- **Props**:
  - `error` - Mensaje de error
  - `onRetry` - Callback para reintentar
- **Responsabilidad**: Mostrar errores y permitir reintentar

## 📱 Funcionalidades Responsive

### 🎯 **Flujo Móvil (Tipo WhatsApp)**

1. **Vista Inicial**: Lista de usuarios/contactos
2. **Selección de Usuario**: Navegación automática al chat
3. **Chat Individual**: Vista completa del chat con botón de regreso
4. **Navegación**: Botón de flecha para volver a la lista

### 🖥️ **Flujo Desktop**

1. **Vista Dividida**: Lista de usuarios + área de chat
2. **Selección**: Cambio de chat sin navegación
3. **Layout**: Sidebar + área principal

### 📐 **Breakpoints**

- **Móvil**: ≤ 768px
- **Desktop**: > 768px

## 🔄 Flujo de Datos

```
ChatPage (Estado principal)
├── ChatContainer (Detector de dispositivo)
│   ├── Desktop: ChatLayout
│   │   ├── UserList (Lista de usuarios)
│   │   └── ChatArea
│   │       ├── ChatHeader (Título del chat)
│   │       ├── MessageList (Lista de mensajes)
│   │       │   └── MessageItem (Mensaje individual)
│   │       ├── MessageInput (Formulario de envío)
│   │       └── EmptyChat (Estado vacío)
│   └── Móvil: Vista específica
│       ├── Vista Usuarios: UserList + MobileUsersHeader
│       └── Vista Chat: ChatArea + MobileChatHeader
├── ChatLoading (Estado de carga)
└── ChatError (Estado de error)
```

## 🎯 Beneficios de esta Arquitectura

1. **Responsive**: Experiencia optimizada para móvil y desktop
2. **Navegación Intuitiva**: Flujo tipo WhatsApp en móvil
3. **Reutilización**: Componentes modulares y reutilizables
4. **Mantenibilidad**: Responsabilidades claras y separadas
5. **Testabilidad**: Fácil hacer tests unitarios por componente
6. **Escalabilidad**: Fácil agregar nuevas funcionalidades
7. **Accesibilidad**: Soporte para navegación por teclado y touch

## 📦 Uso

### Uso Básico (Recomendado)

```tsx
import { ChatContainer } from "../components/chat";

// En tu componente principal
return (
  <ChatContainer
    users={users}
    selectedUser={selectedUser}
    messages={messages}
    currentUserId={currentUserId}
    message={message}
    onUserSelect={handleUserSelect}
    onMessageChange={setMessage}
    onSendMessage={handleSendMessage}
    isConnected={isConnected}
  />
);
```

### Uso Manual (Avanzado)

```tsx
import {
  ChatLayout,
  UserList,
  ChatArea,
  ChatError,
  ChatLoading,
} from "../components/chat";

// Para desktop
return (
  <ChatLayout>
    <UserList
      users={users}
      selectedUser={selectedUser}
      onUserSelect={handleUserSelect}
      isMobile={false}
    />
    <ChatArea
      selectedUser={selectedUser}
      messages={messages}
      currentUserId={currentUserId}
      message={message}
      onMessageChange={setMessage}
      onSendMessage={handleSendMessage}
      isConnected={isConnected}
      isMobile={false}
    />
  </ChatLayout>
);
```

## 🎨 Estilos CSS

El sistema incluye estilos CSS específicos para mejorar la experiencia responsive:

- **Touch Targets**: Tamaños mínimos para interacción táctil
- **Scroll Suave**: Animaciones fluidas en móvil
- **Headers Sticky**: Headers que se mantienen visibles
- **Estados Vacíos**: Diseños optimizados para móvil
- **Accesibilidad**: Soporte para navegación por teclado

## 🚀 Próximos Pasos Sugeridos

1. **Animaciones**: Transiciones suaves entre vistas
2. **Notificaciones Push**: Alertas en tiempo real
3. **Modo Oscuro**: Soporte para temas oscuros
4. **Gestos**: Swipe para navegación
5. **Offline**: Soporte para mensajes offline
6. **Archivos**: Envío de imágenes y documentos
