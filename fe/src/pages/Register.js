// src/pages/Register.js
import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationSelection = () => {
  return (
    <div className="register-selection">
      <h2>Register</h2>
      <p>Please choose the type of registration:</p>
      <div className="button-container">
        <Link to="/register-regular" className="btn">Register as Regular User</Link>
        <Link to="/register-business" className="btn">Register as Business User</Link>
      </div>
    </div>
  );
};

export default RegistrationSelection;
