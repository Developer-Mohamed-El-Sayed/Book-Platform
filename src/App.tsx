import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BookProvider } from './contexts/BookContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import BookReader from './pages/BookReader';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import VipSubscription from './pages/VipSubscription';
import AddBook from './pages/AddBook';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAuth?: boolean; requireAuthor?: boolean }> = ({ 
  children, 
  requireAuth = false, 
  requireAuthor = false 
}) => {
  const { user } = useAuth();

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAuthor && (!user || !user.isAuthor)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/read/:id" element={
            <ProtectedRoute requireAuth>
              <BookReader />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute requireAuth>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/vip" element={
            <ProtectedRoute requireAuth>
              <VipSubscription />
            </ProtectedRoute>
          } />
          <Route path="/add-book" element={
            <ProtectedRoute requireAuth requireAuthor>
              <AddBook />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookProvider>
          <Router>
            <AppContent />
          </Router>
        </BookProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;