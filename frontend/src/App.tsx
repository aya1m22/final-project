import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/layout/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import AIAdvisor from './pages/AIAdvisor';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function AdminProtected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Routes>
                {/* Admin routes - no navbar/footer */}
                <Route path="/admin" element={<AdminProtected><AdminDashboard /></AdminProtected>} />
                <Route path="/admin/products" element={<AdminProtected><AdminProducts /></AdminProtected>} />
                <Route path="/admin/orders" element={<AdminProtected><AdminOrders /></AdminProtected>} />
                <Route path="/admin/users" element={<AdminProtected><AdminUsers /></AdminProtected>} />

                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes with navbar/footer */}
                <Route path="/*" element={
                  <>
                    <Navbar />
                    <CartDrawer />
                    <main>
                      <Routes>
                        <Route path="/" element={<Protected><Home /></Protected>} />
                        <Route path="/shop" element={<Protected><Shop /></Protected>} />
                        <Route path="/product/:id" element={<Protected><ProductDetail /></Protected>} />
                        <Route path="/ai-stylist" element={<Protected><AIAdvisor /></Protected>} />
                        <Route path="/profile" element={<Protected><Profile /></Protected>} />
                      </Routes>
                    </main>
                    <Footer />
                  </>
                } />
              </Routes>
            </div>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

