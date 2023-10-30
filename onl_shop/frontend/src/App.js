import React from 'react';
import './css/App.css'
import './css/footer.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import LoginPage from './components/LoginPage';
import Register from './components/Register';
import ShopCenter from './components/ShopCenter'
import Navbar from './components/base/NavBar';
import SaleDetail from './components/details/SaleDetail'
import { ProfileDetail } from './components/details/ProfileDetail'
import { TransactionDetail } from './components/details/TransactionDetail';
import { HomePage } from './components/base/HomePage';
import Footer from './components/base/Footer';
import { NewSale } from './components/NewSale';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop_center" element={<ShopCenter />} />
          <Route path='/sale_detail/:id' element={<SaleDetail />} />
          <Route path='/new_sale' element={<NewSale />} />
          <Route path='/profile/:id' element={<ProfileDetail />} />
          <Route path='/transaction/:id' element={<TransactionDetail />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;