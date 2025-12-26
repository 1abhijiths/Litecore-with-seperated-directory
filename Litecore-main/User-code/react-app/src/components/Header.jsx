import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setToken } from '../api';

const Header = ({ showNav = true }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="brand">LiteCore Shop</div>
      {showNav && (
        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/account">Account</Link>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>Logout</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
