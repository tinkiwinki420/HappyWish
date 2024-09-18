import React, { useState } from 'react';
import RegularUserRegister from '../components/RegularUserRegister';
import BusinessUserRegister from '../components/BusinessUserRegister';
import '../styles/register.css'; // Import the CSS

const RegistrationSelection = () => {
  const [isRegularUser, setIsRegularUser] = useState(true);

  return (
    <div className="register-page">
      <div className="slider-container">
        <div className="slider">
          <button
            className={`slider-button ${isRegularUser ? 'active' : ''}`}
            onClick={() => setIsRegularUser(true)}
          >
            Regular User
          </button>
          <button
            className={`slider-button ${!isRegularUser ? 'active' : ''}`}
            onClick={() => setIsRegularUser(false)}
          >
            Business User
          </button>
        </div>
      </div>
      <div className="form-wrapper">
        <div className={`form-container ${isRegularUser ? 'show' : 'hide'}`}>
          <RegularUserRegister />
        </div>
        <div className={`form-container ${!isRegularUser ? 'show' : 'hide'}`}>
          <BusinessUserRegister />
        </div>
      </div>
    </div>
  );
};

export default RegistrationSelection;
