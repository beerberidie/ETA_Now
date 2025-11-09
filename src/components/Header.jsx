import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ user, onLogout }) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="container">
        <h1>ETA Now</h1>
        <nav className="nav">
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/settings" 
            className={location.pathname === '/settings' ? 'active' : ''}
          >
            Settings
          </Link>
          <span>Welcome, {user.name}!</span>
          <button 
            onClick={onLogout}
            className="btn btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
