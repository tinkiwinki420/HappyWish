// src/pages/Register.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/styles.css'; // Import styles

const RegistrationSelection = () => {
  return (
    <div className="profile-container">
      <h1>Select Registration Type</h1>
      <Link to="/register-regular">
        <button>Regular User Registration</button>
      </Link>
      <Link to="/register-business">
        <button>Business User Registration</button>
      </Link>
    </div>
  );
};

export default RegistrationSelection;
