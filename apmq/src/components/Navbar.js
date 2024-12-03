import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'react-feather';
import logo from '../assets/mathwizlogo.png';

const Navbar = () => {
  const navigate = useNavigate();

  // Check login status and retrieve username from localStorage
  const isLoggedIn = !!localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    // Clear localStorage and redirect to login
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <style>
        {`
          .navbar {
            position: fixed;
            top: 0;
            width: 100%;
            background-color: #FFFFFF;
            border-bottom: 1px solid #E5E7EB;
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 16px;
          }

          .navbar-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 64px;
            width: 100%;
            max-width: 1200px;
          }

          .navbar-logo {
            display: flex;
            align-items: center;
            text-decoration: none;
          }

          .navbar-logo img {
            height: 32px;
            width: auto;
          }

          .navbar-logo span {
            margin-left: 8px;
            font-size: 20px;
            font-weight: bold;
            color: #FFA500; /* Orange */
          }

          .navbar-links {
            display: none;
          }

          .navbar-links a {
            margin-left: 16px;
            color: #4A5568;
            text-decoration: none;
            font-weight: normal;
          }

          .navbar-links a:hover {
            color: #FFA500; /* Orange */
          }

          .navbar-buttons {
            display: flex;
            align-items: center;
            margin-left: 16px;
          }

          .navbar-button {
            padding: 8px 16px;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            cursor: pointer;
            margin-left: 8px;
          }

          .navbar-button.primary {
            background-color: #FFA500; /* Orange */
            color: #FFFFFF;
            border: none;
          }

          .navbar-button.primary:hover {
            background-color: rgba(255, 165, 0, 0.9);
          }

          .navbar-button.secondary {
            background-color: transparent;
            color: #FFA500; /* Orange */
            border: 2px solid #FFA500;
          }

          .navbar-button.secondary:hover {
            background-color: rgba(255, 165, 0, 0.1);
          }

          .navbar-menu-button {
            display: block;
            background: none;
            border: none;
            padding: 8px;
            border-radius: 4px;
            color: #4A5568;
            cursor: pointer;
          }

          .navbar-menu-button:hover {
            color: #FFA500; /* Orange */
            background-color: #F3F4F6;
          }

          .icon-style {
            width: 24px;
            height: 24px;
            color: #4A5568;
          }

          .dropdown {
            position: relative;
          }

          .dropdown-menu {
            display: none;
            position: absolute;
            right: 0;
            top: 40px;
            background-color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            z-index: 1000;
            white-space: nowrap;
          }

          .dropdown:hover .dropdown-menu,
          .dropdown:focus-within .dropdown-menu {
            display: block;
          }

          .dropdown-item {
            padding: 8px 16px;
            color: #4A5568;
            text-decoration: none;
            display: block;
          }

          .dropdown-item:hover {
            background-color: #F3F4F6;
            color: #FFA500; /* Orange */
          }

          @media (min-width: 768px) {
            .navbar-links {
              display: flex;
              align-items: center;
            }

            .navbar-menu-button {
              display: none;
            }
          }
        `}
      </style>

      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="MathWiz Logo" />
          <span>MathWiz</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/main">Practice</Link>

          <div className="navbar-buttons">
            {isLoggedIn ? (
              <div className="dropdown">
                <button className="navbar-button secondary">
                  <i className="fas fa-user-circle"></i> {username}
                </button>
                <div className="dropdown-menu">
                  <Link to="/account" className="dropdown-item">Account</Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="navbar-button secondary">
                  Log In
                </Link>
                <Link to="/register" className="navbar-button primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="navbar-menu-button">
          <Menu className="icon-style" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
