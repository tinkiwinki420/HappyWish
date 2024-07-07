import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/BusinessNavbar.css';
const BusinessNavBar = () => {
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
        <li>
          <NavLink to="/services" activeclassname="active">
            Services
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BusinessNavBar;
