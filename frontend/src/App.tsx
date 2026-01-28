import { Layout } from 'antd';
import Navbar from './components/common/Navbar';
import CustomerSidebar from './components/common/CustomerSidebar';
import AdminSidebar from './components/common/AdminSidebar';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProductGrid from './components/products/ProductGrid';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSettings from './pages/admin/AdminSettings';
import AdminBanners from './pages/admin/AdminBanners';
import AdminBrands from './pages/admin/AdminBrands';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { StoreProvider, useStore } from './context/StoreContext';

const { Footer } = Layout;

// Wrapper to conditionally render layout padding for sticky footer or hero
const AppContent = () => {
  const location = useLocation();
  const { getSetting } = useStore();
  const storeName = getSetting('store_name') || 'Al Sadawi SHOP';

  const isAdminRoute = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');
  const isAuthRoute = ['/login', '/register', '/checkout'].includes(location.pathname);

  // Routes where we want the full sidebar experience
  const isShopRoute = !isAdminRoute && !isAuthRoute;

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {isAdminRoute && <AdminSidebar />}
      {isShopRoute && <CustomerSidebar />}

      <Layout style={{ background: 'transparent' }}>
        {!isAdminRoute && <Navbar />} {/* Admin might have its own header or none */}

        <div style={{ flex: 1, position: 'relative' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<div style={{ padding: '24px' }}><ProductGrid /></div>} />
            <Route path="/products/:id" element={<div style={{ padding: '24px' }}><ProductDetail /></div>} />

            {/* Added Sidebar Functionality Routes */}
            <Route path="/category/:category" element={<div style={{ padding: '24px' }}><ProductGrid /></div>} />
            <Route path="/new-arrivals" element={<div style={{ padding: '24px' }}><ProductGrid /></div>} />
            <Route path="/best-sellers" element={<div style={{ padding: '24px' }}><ProductGrid /></div>} />
            <Route path="/discounts" element={<div style={{ padding: '24px' }}><ProductGrid /></div>} />

            <Route path="/login" element={<div style={{ padding: '50px' }}><Login /></div>} />
            <Route path="/register" element={<div style={{ padding: '50px' }}><Register /></div>} />
            <Route path="/cart" element={<div style={{ padding: '24px' }}><Cart /></div>} />
            <Route path="/checkout" element={<div style={{ padding: '24px' }}><Checkout /></div>} />

            {/* Admin Routes */}
            <Route path="/admin/products" element={<div style={{ padding: '24px' }}><AdminProducts /></div>} />
            <Route path="/admin/products/add" element={<div style={{ padding: '24px' }}><AdminProductForm /></div>} />
            <Route path="/admin/products/edit/:id" element={<div style={{ padding: '24px' }}><AdminProductForm /></div>} />
            <Route path="/admin/orders" element={<div style={{ padding: '24px' }}><AdminOrders /></div>} />
            <Route path="/admin/users" element={<div style={{ padding: '24px' }}><AdminUsers /></div>} />
            <Route path="/admin/categories" element={<div style={{ padding: '24px' }}><AdminCategories /></div>} />
            <Route path="/admin/settings" element={<div style={{ padding: '24px' }}><AdminSettings /></div>} />
            <Route path="/admin/banners" element={<div style={{ padding: '24px' }}><AdminBanners /></div>} />
            <Route path="/admin/brands" element={<div style={{ padding: '24px' }}><AdminBrands /></div>} />

            <Route path="/dashboard" element={<div style={{ padding: '24px' }}><Dashboard /></div>} />
          </Routes>
        </div>

        <Footer style={{
          textAlign: 'center',
          background: 'var(--bg-deep)',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border)',
          padding: '60px 0'
        }}>
          <div className="premium-gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '15px' }}>{storeName}</div>
          <div style={{ fontSize: '12px', letterSpacing: '2px' }}>EXCELLENCE IN EVERY THREAD</div>
          <div style={{ borderTop: '1px solid var(--border)', width: '200px', margin: '30px auto' }} />
          <div style={{ fontSize: '11px', opacity: 0.6 }}>©{new Date().getFullYear()} {storeName}. All Rights Reserved.</div>
        </Footer>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <UserPreferencesProvider>
            <Router>
              <AppContent />
            </Router>
          </UserPreferencesProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
