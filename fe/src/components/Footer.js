import React from 'react';
import '../styles/Layout.css'; // Import the CSS file


const Footer = () => {
  return (
    <footer className="footer">
      <div>&copy; 2024 Happy Wish. All rights reserved.</div>
      <button className="contact-button-footer" onClick={() => window.location.href = 'mailto:estiphanianchris@gmail.com'}>
        Contact Us
      </button>
    </footer>
  );
};

export default Footer;
