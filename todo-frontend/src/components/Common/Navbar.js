import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

/**
 * Navigation bar component
 * Shows user info and logout functionality
 */
const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>📝 Todo App</h2>
        </div>
        
        <div className="navbar-user">
          <span className="user-greeting">
            Welcome, <strong>{user?.username}</strong>
          </span>
          <button 
            onClick={handleLogout}
            className="btn btn-secondary logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
