// components/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Home = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <h1 className="logo">Intelligent Tutor</h1>
        <ul className="nav-links">
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>

      <header className="hero">
        <h2>Welcome to the Intelligent Tutor System</h2>
        <p>Empowering your learning journey with adaptive AI-driven solutions.</p>
        <div className="cta-buttons">
          <Link to="/login" className="btn">
            Get Started
          </Link>
          <Link to="/register" className="btn secondary">
            Sign Up
          </Link>
        </div>
      </header>
    </div>
  );
};

export default Home;