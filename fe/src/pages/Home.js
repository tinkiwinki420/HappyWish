import React from 'react';
import '../styles/Home.css';


const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>Welcome to Happy Wish!</h1>
        <h1>Book your dream wedding with us!</h1>
        <button className="cta-button">Start Planning Your Dream Wedding</button>
      </section>
      
      <section className="process-section">
        <div className="process-steps">
          <div className="process-step">
            <img className="process-image1" />
            <h3>Step 1: Sign up!</h3>
            <p>We start with a detailed sign up to set up your account.</p>
          </div>
          <div className="process-step">
            <img className="process-image2" />
            <h3>Step 2: Choose Your Happy Wish Date</h3>
            <p>Choose your preferred date for your dream wedding according to our availability.</p>
          </div>
          <div className="process-step">
            <img className="process-image3" />
            <h3>Step 3: Personalize Your Wedding!</h3>
            <p>Choose your dream wedding packages, customize your dream wedding, and add-ons to make your wedding more special.</p>
          </div>
        </div>
      </section>

       <section className="services-section">
      <div className="service-item">
        <h3>Venue Options</h3>
        <p>Choose from our curated selection of beautiful venues to match your wedding theme.</p>
      </div>
      <div className="service-item">
        <h3>Floral Arrangements</h3>
        <p>Stunning floral arrangements to complement your wedding style.</p>
      </div>
      <div className="service-item">
        <h3>Entertainment Packages</h3>
        <p>Keep your guests entertained with top-notch entertainment options.</p>
      </div>
    </section>
    </div>
  );
};

export default Home;
