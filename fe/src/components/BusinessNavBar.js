import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/BusinessNavbar.css';

const BusinessNavBar = () => {
  const category = localStorage.getItem('category'); // Get category from localStorage

  
  return (
    <nav className="business-navbar">
      <ul>
        <li>
          <NavLink to="/profile" activeclassname="active">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/financial" activeclassname="active">
            Financial
          </NavLink>
        </li>
        <li>
          <NavLink to="/dates" activeclassname="active">
            Dates
          </NavLink>
        </li>
        {/* Conditionally render the Services link based on the category */}
        {category === 'Hall' && (
          <li>
            <NavLink to="/services" activeclassname="active">
              Services
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default BusinessNavBar;
