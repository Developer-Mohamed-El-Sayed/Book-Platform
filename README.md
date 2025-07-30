# Book Platform - Frontend

A modern, responsive book platform built with React, TypeScript, and Tailwind CSS. This application provides a complete reading experience with authentication, book management, PDF reading, and VIP subscriptions.

## ✨ Features

### 🎨 UI/UX

- **Light/Dark Mode**: Toggle between themes with persistent storage
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for delightful interactions
- **Modern UI**: Clean, professional design with consistent styling

### 🔐 Authentication

- **Email/Password Login**: Secure authentication system
- **Google OAuth**: One-click login with Google
- **Registration**: User account creation
- **Protected Routes**: Role-based access control
- **Token Management**: JWT-based authentication with automatic refresh

### 📚 Book Management

- **Book Listing**: Browse all available books
- **Book Details**: Comprehensive book information
- **VIP Badges**: Visual indicators for premium content
- **Search & Filter**: Find books easily
- **Reading Progress**: Track your reading journey

### 📖 PDF Reader

- **Real PDF Rendering**: Using react-pdf for actual PDF display
- **Page Navigation**: Easy page-by-page navigation
- **Zoom Controls**: Adjust zoom level for comfortable reading
- **Fullscreen Mode**: Immersive reading experience
- **Progress Tracking**: Automatic progress saving

### 💎 VIP Subscription

- **Stripe Integration**: Secure payment processing
- **Monthly/Yearly Plans**: Flexible subscription options
- **Portal Management**: Manage subscriptions through Stripe
- **Premium Content**: Access to VIP-only books

### 👨‍💻 Author Features

- **Add Books**: Upload new books with cover images and PDFs
- **Book Management**: Edit and delete your books
- **Author Dashboard**: Manage your published works

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd book-platform-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # API Configuration
   VITE_API_URL=http://localhost:3001/api

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

   # Google OAuth Configuration
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

   # Optional: Environment
   VITE_ENV=development
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### Frontend

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library

### Libraries

- **React Router DOM**: Client-side routing
- **React PDF**: PDF rendering and manipulation
- **Axios**: HTTP client for API calls
- **Stripe.js**: Payment processing
- **Lucide React**: Icon library

### State Management

- **React Context**: Global state management
- **Local Storage**: Persistent data storage

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (Navbar, Footer)
│   └── UI/             # Generic UI components
├── contexts/           # React Context providers
├── pages/              # Page components
├── services/           # API and external service integrations
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🔧 Configuration

### API Endpoints

The application expects the following API endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/google` - Google OAuth
- `GET /api/books` - Get all books
- `POST /api/books` - Create new book
- `GET /api/books/:id` - Get book details
- `GET /api/books/:id/pdf` - Get PDF URL
- `POST /api/stripe/checkout-session` - Create Stripe checkout
- `POST /api/stripe/portal-session` - Create Stripe portal

### Environment Variables

| Variable                      | Description            | Required |
| ----------------------------- | ---------------------- | -------- |
| `VITE_API_URL`                | Backend API base URL   | Yes      |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes      |
| `VITE_GOOGLE_CLIENT_ID`       | Google OAuth client ID | Yes      |

## 🎯 Features in Detail

### Authentication Flow

1. User enters credentials or clicks Google OAuth
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Automatic token refresh on API calls
5. Redirect to intended page after login

### Book Reading Experience

1. User selects a book from the library
2. System checks access permissions (free/VIP)
3. PDF loads with react-pdf
4. Reading progress automatically saved
5. Zoom and navigation controls available

### VIP Subscription Process

1. User clicks "Upgrade to VIP"
2. Stripe checkout session created
3. User redirected to Stripe payment page
4. Payment processed securely
5. User gains VIP access upon successful payment

## 🧪 Testing

### Manual Testing Checklist

- [ ] Light/Dark mode toggle works and persists
- [ ] Login/Register forms function correctly
- [ ] Google OAuth integration works
- [ ] Book listing displays correctly
- [ ] PDF reader loads and navigates
- [ ] VIP subscription flow works
- [ ] Protected routes block unauthorized access
- [ ] Responsive design works on mobile

### Demo Accounts

For testing purposes, you can use these demo accounts:

- **Regular User**: `user@example.com` (any password)
- **VIP User**: `vip@example.com` (any password)
- **Author**: `admin@bookplatform.com` (any password)

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This frontend application requires a compatible backend API to function properly. Make sure your backend implements all the required endpoints and follows the expected data formats.
