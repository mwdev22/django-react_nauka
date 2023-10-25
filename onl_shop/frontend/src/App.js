import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import LoginPage from './Components/LoginPage';
import Register from './Components/Register';
import HomePage from './components/base/HomePage'
import Navbar from './components/base/NavBar';
import SaleDetail from './components/details/SaleDetail'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path='/sale_detail/:id' element={<SaleDetail />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;