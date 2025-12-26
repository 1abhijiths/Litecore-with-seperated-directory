import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Account from './pages/Account';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/products" element={<ProtectedRoute element={<Products />} />} />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
