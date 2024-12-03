import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { Cpu, Target, MessageSquare, Star } from 'react-feather';
import image from '../assets/math.png'; // Import the math.png image

const Home = () => {
  return (
    <div className="home-container">
      {/* Inline CSS */}
      <style>
        {`
          .home-container {
            min-height: 100vh;
            background: linear-gradient(to bottom, rgba(248, 247, 255, 0.9), rgba(248, 247, 255, 0.9)),
                        url('${image}') center center / cover no-repeat; /* Full page background */
            font-family: Arial, sans-serif;
          }

          .hero-section {
            padding: 100px 20px 60px; /* Adjust for more spacing */
            text-align: center;
          }

          .hero-title {
            font-size: 40px;
            font-weight: bold;
            color: #1A1F2C;
            margin-bottom: 24px;
          }

          .hero-title .highlight {
            color: #FFA500; /* Orange */
          }

          .hero-description {
            font-size: 20px;
            color: #4A5568;
            margin-bottom: 32px;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }

          .hero-buttons {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
          }

          .button {
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
            border-radius: 4px;
            text-decoration: none;
            text-align: center;
            cursor: pointer;
          }

          .primary-button {
            background-color: #FFA500; /* Orange */
            color: #FFFFFF;
            transition: background-color 0.3s;
          }

          .primary-button:hover {
            background-color: rgba(255, 165, 0, 0.9);
          }

          .secondary-button {
            background-color: transparent;
            border: 2px solid #FFA500; /* Orange */
            color: #FFA500;
            transition: background-color 0.3s, color 0.3s;
          }

          .secondary-button:hover {
            background-color: rgba(255, 165, 0, 0.1);
            color: #FF8C00; /* Slightly darker orange */
          }

          .features-section {
            padding: 60px 20px;
            background-color: #FFFFFF; /* White background */
            position: relative;
          }

          .section-title {
            font-size: 28px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 48px;
            color: #1A1F2C;
          }

          .features-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 32px;
            justify-items: center;
          }

          @media (min-width: 768px) {
            .features-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (min-width: 1024px) {
            .features-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `}
      </style>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div>
          <h1 className="hero-title">
            Master Math with AI-Powered
            <span className="highlight"> Guidance</span>
          </h1>
          <p className="hero-description">
            Experience personalized math learning with real-time AI support.
            Get instant feedback, step-by-step explanations, and adaptive practice problems.
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="button primary-button">
              Get Started
            </Link>
            <Link to="/register" className="button secondary-button">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section (White Background) */}
      <section className="features-section">
        <h2 className="section-title">Why Choose MathWiz?</h2>
        <div className="features-grid">
          <Feature
            icon={Cpu}
            title="AI-Powered Learning"
            
          />
          <Feature
            icon={MessageSquare}
            title="Interactive Support"
            
          />
          <Feature
            icon={Target}
            title="Personalized Practice"
            
          />
          <Feature
            icon={Star}
            title="Instant Feedback"
            
          />
        </div>
      </section>
    </div>
  );
};

const Feature = ({ icon: Icon, title, description }) => {
  return (
    <div className="feature">
      <div className="feature-icon">
        <Icon className="icon-style" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
};

export default Home;
