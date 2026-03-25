import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';

import CustomerDashboard from './views/customer/CustomerDashboard';
import ProductCatalog from './views/customer/ProductCatalog';
import ProductDetails from './views/customer/ProductDetails';
import Cart from './views/customer/Cart';
import Checkout from './views/customer/Checkout';
import MyOrders from './views/customer/MyOrders';
import Wishlist from './views/customer/Wishlist';

import ArtisanDashboard from './views/artisan/ArtisanDashboard';
import ProductsManagement from './views/artisan/ProductsManagement';
import UploadQR from './views/artisan/UploadQR';
import ArtisanProfile from './views/artisan/ArtisanProfile';

import AdminDashboard from './views/admin/AdminDashboard';
import AdminUsers from './views/admin/AdminUsers';
import AdminArtisans from './views/admin/AdminArtisans';

const MockDashboardHome = () => (
   <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[60vh] text-center">
       <div className="text-5xl mb-4">🚧</div>
       <h2 className="text-2xl font-bold text-gray-800">Coming Soon</h2>
       <p className="text-gray-500 mt-2 max-w-sm">This section is currently under development. Please check back later.</p>
   </div>
);

function App() {
  const { userInfo } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={
              userInfo?.role === 'admin' ? <AdminDashboard /> : 
              userInfo?.role === 'artisan' ? <ArtisanDashboard /> : 
              <ProductCatalog />
          } />
          
          <Route path="customer" element={<CustomerDashboard />} />
          <Route path="products" element={
              userInfo?.role === 'artisan' || userInfo?.role === 'admin' ? <ProductsManagement /> : <ProductCatalog />
          } />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="qrcode" element={<UploadQR />} />
          <Route path="artisan-profile" element={<ArtisanProfile />} />
          
          <Route path="users" element={
              userInfo?.role === 'admin' ? <AdminUsers /> : <MockDashboardHome />
          } />
          <Route path="artisans" element={
              userInfo?.role === 'admin' ? <AdminArtisans /> : <MockDashboardHome />
          } />
          <Route path="wishlist" element={<Wishlist />} />
          
          <Route path="*" element={<MockDashboardHome />} />
      </Route>
    </Routes>
  )
}

export default App;
