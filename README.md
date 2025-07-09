# IcesiTrade - E-commerce Platform

A modern, full-stack e-commerce platform built with React, TypeScript, and Spring Boot. This application provides a comprehensive marketplace for buying and selling products with real-time communication features.

## 🚀 Features

### 🔐 Authentication & User Management

- **User Registration & Login**: Secure authentication system with JWT tokens
- **Email Verification**: Email verification system for new user accounts
- **Role-based Access Control**: Different user roles (USER, ADMIN) with specific permissions
- **Profile Management**: Complete user profile management with avatar support
- **Admin Panel**: Comprehensive admin interface for user and role management

### 🛍️ Product Management

- **Product Creation**: Advanced product creation with multiple image uploads (up to 3 images, 1MB each)
- **Product Categories**: Organized product categorization system
- **Product Status**: Product condition tracking (New, Semi-new, Used)
- **Product Search**: Advanced search functionality with filters
- **Product Details**: Detailed product view with image galleries and seller information
- **My Products**: Seller dashboard for managing their product listings
- **Product Offers**: Offer system for product negotiations

### 💬 Real-time Communication

- **Live Chat System**: Real-time messaging using WebSocket connections
- **Chat History**: Persistent chat conversations between users
- **User-to-User Messaging**: Direct communication between buyers and sellers
- **Message Notifications**: Real-time notification system for new messages

### 🛒 Shopping Experience

- **Product Browsing**: Browse products with advanced filtering options
- **Favorite Products**: Save products to favorites list
- **Purchase Tracking**: Complete purchase history and tracking
- **Product Reviews**: Review system for purchased products
- **My Purchases**: Buyer dashboard for tracking purchases and leaving reviews

### 📊 Analytics & Statistics

- **Seller Analytics**: Sales statistics and product performance metrics
- **Purchase Analytics**: Buyer spending and purchase history
- **Product Performance**: Track product views, offers, and sales
- **User Activity**: Monitor user engagement and activity

### 🔔 Notification System

- **Real-time Notifications**: Instant notifications for various events
- **Notification Management**: Mark notifications as read/unread
- **Notification Filters**: Filter notifications by status
- **Email Notifications**: Email-based notification system

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first responsive design
- **Material-UI Components**: Modern UI components from Material-UI
- **Dark/Light Theme**: Theme customization options
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Loading States**: Comprehensive loading states and skeletons
- **Error Handling**: User-friendly error messages and recovery

### 🔧 Technical Features

- **TypeScript**: Full TypeScript implementation for type safety
- **React Router**: Client-side routing with protected routes
- **State Management**: Context API for global state management
- **API Integration**: RESTful API integration with axios
- **WebSocket Integration**: Real-time features with STOMP over WebSocket
- **Image Upload**: Azure Blob Storage integration for image management
- **Form Validation**: Comprehensive form validation and error handling

## 🛠️ Tech Stack

### Frontend

- **React 19**: Latest React with hooks and modern patterns
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Material-UI**: Modern UI component library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication
- **STOMP.js**: WebSocket client for real-time features
- **Framer Motion**: Animation library
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools

- **ESLint**: Code linting and formatting
- **Husky**: Git hooks for code quality
- **TypeScript ESLint**: TypeScript-specific linting rules

## 📁 Project Structure

```
src/
├── api/                 # API service modules
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat system components
│   ├── products/       # Product-related components
│   ├── profile/        # User profile components
│   ├── queries/        # Search and filter components
│   ├── ui/             # Base UI components
│   └── utils/          # Utility components
├── contexts/           # React contexts for state management
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── routes/             # Routing configuration
├── services/           # External services (WebSocket, etc.)
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Live Demo

🌐 **Live Application**: [https://icesi.tech/](https://icesi.tech/)

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/OscarMURA/Icesi-Trade-Frontend
   cd proyecto-front-losbandalos
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_BASE_URL=http://localhost:8080
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📱 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## 🔐 Environment Variables

| Variable        | Description          | Default                 |
| --------------- | -------------------- | ----------------------- |
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:8080` |

## 🌟 Key Features in Detail

### Authentication System

- JWT-based authentication
- Email verification workflow
- Role-based authorization
- Protected routes implementation
- Session management

### Product Management

- Multi-image upload with validation
- Category-based organization
- Product status tracking
- Advanced search and filtering
- Offer and negotiation system

### Real-time Chat

- WebSocket-based messaging
- Real-time message delivery
- Chat history persistence
- User online/offline status
- Message notifications

### Admin Features

- User management dashboard
- Role assignment and management
- System statistics and analytics
- Content moderation tools

### User Experience

- Responsive mobile-first design
- Progressive loading states
- Error boundary implementation
- Accessibility features
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**IcesiTrade** - Building the future of e-commerce, one transaction at a time.
