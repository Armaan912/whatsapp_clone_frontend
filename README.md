# WhatsApp Web Clone - Frontend

A modern Vue.js 3 frontend application for the WhatsApp Web Clone messaging platform. Built with Vue 3 Composition API, Pinia state management, and Bootstrap 5 for a professional WhatsApp-inspired design.

## 🚀 Tech Stack

- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vue Router 4** - Client-side routing with navigation guards
- **Pinia** - State management for Vue 3
- **Bootstrap 5** - CSS framework for responsive design
- **FontAwesome** - Icon library for professional UI
- **Axios** - HTTP client for API communication
- **Vuelidate** - Form validation library
- **Socket.IO Client** - Real-time communication
- **Day.js** - Date manipulation and formatting
- **Vite** - Build tool and development server

## 📁 Project Structure

```
frontend/
├── public/
│   ├── vite.svg
│   └── default-avatar.svg
├── src/
│   ├── assets/                 # Static assets
│   ├── components/
│   │   ├── ChatList.vue        # Chat list component
│   │   ├── MessageInput.vue    # Message input component
│   │   ├── MessageWindow.vue   # Message display component
│   │   └── Navbar.vue          # Navigation header
│   ├── api/
│   │   └── axios.js            # Axios configuration
│   ├── router/
│   │   └── index.js            # Vue Router configuration
│   ├── views/
│   │   ├── Chat.vue            # Main chat page
│   │   ├── Login.vue           # Login page
│   │   ├── Profile.vue         # User profile page
│   │   └── Signup.vue          # Registration page
│   ├── App.vue                 # Root component
│   └── main.js                 # Application entry point
├── package.json                # Dependencies and scripts
├── vite.config.js             # Vite configuration
└── vercel.json                # Vercel deployment config
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_WS_URL=http://localhost:5000
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## 🎨 Features

### Core Features
- **User Authentication** - Login/register with JWT tokens
- **Real-time Messaging** - Instant message delivery with Socket.IO
- **Profile Management** - Edit profile with image upload
- **Conversation Management** - Create and manage chat conversations
- **Online Status** - Real-time user online/offline indicators
- **Responsive Design** - Mobile-first approach

### UI/UX Features
- **WhatsApp-Inspired Design** - Familiar messaging interface
- **Real-time Updates** - Dynamic content without page refresh
- **Image Upload** - Profile pictures and media sharing
- **Mobile Responsive** - Optimized for all screen sizes
- **Loading States** - Smooth user experience
- **Error Handling** - User-friendly error messages

## 🧩 Components

### Core Components

#### `ChatList.vue`
- List of conversations and users
- Real-time online status
- Unread message indicators

#### `MessageWindow.vue`
- Message display area
- Real-time message updates
- Typing indicators

#### `MessageInput.vue`
- Message composition
- File attachment support
- Send functionality

#### `Navbar.vue`
- Navigation header
- User profile menu
- Logout functionality

### Page Components

#### `Chat.vue`
- Main chat interface
- Conversation list and message area
- Real-time communication

#### `Profile.vue`
- User profile display
- Profile editing
- Image management

#### `Login.vue` & `Signup.vue`
- Authentication forms
- Form validation
- Error handling

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | - | Yes |
| `VITE_WS_URL` | WebSocket URL | - | Yes |

### Vite Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173
  }
})
```

## 🚀 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📱 Responsive Design

The application is built with a mobile-first approach:

- **Mobile (< 768px)**: Single column layout, collapsible navigation
- **Tablet (768px - 992px)**: Two-column layout with sidebar
- **Desktop (> 992px)**: Full layout with sidebar and chat area

## 🎯 State Management

### Pinia Store
```javascript
// Authentication and chat state management
const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  actions: {
    login(credentials),
    logout(),
    register(userData)
  }
})
```

## 🔐 Authentication Flow

1. **Login/Register**: User submits credentials
2. **Token Storage**: JWT token stored in localStorage
3. **Route Guards**: Protected routes check authentication
4. **API Calls**: Token included in Authorization header
5. **Real-time Connection**: Socket.IO connection with token

## 🎨 Styling

### Bootstrap 5 Integration
- Custom CSS variables for theming
- Responsive grid system
- Component styling
- Utility classes

### Custom Styles
- WhatsApp-inspired color scheme
- Professional typography
- Smooth animations
- Mobile-optimized components

## 📊 Performance

### Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Responsive images
- **Bundle Size**: Tree shaking and minification
- **Caching**: Browser caching strategies

## 🧪 Testing

```bash
# Run tests (if configured)
npm test

# Run with coverage
npm run test:coverage
```

## 🔧 Development Tools

### Vite DevTools
- Hot Module Replacement (HMR)
- Fast refresh
- Development server
- Build optimization

### Vue DevTools
- Component inspection
- State management debugging
- Performance profiling
- Timeline tracking

## 📦 Dependencies

### Production Dependencies
- `vue@^3.5.18` - Vue.js framework
- `vue-router@^4.5.1` - Client-side routing
- `pinia@^3.0.3` - State management
- `bootstrap@^5.3.7` - CSS framework
- `axios@^1.11.0` - HTTP client
- `socket.io-client@^4.8.1` - Real-time communication
- `@vuelidate/core@^2.0.3` - Form validation
- `dayjs@^1.11.13` - Date handling

### Development Dependencies
- `@vitejs/plugin-vue@^6.0.1` - Vue plugin for Vite
- `vite@^7.1.1` - Build tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with Vue.js 3 and Vite
- Styled with Bootstrap 5
- Icons from FontAwesome
- Real-time with Socket.IO
