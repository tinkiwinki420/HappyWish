import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/BusinessNavbar.css';
const BusinessNavBar = () => {
  return (
    <nav className="business-navbar">
      <ul>
        <li>
          <NavLink to="/profile" activeClassName="active">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/financial" activeClassName="active">
            Financial
          </NavLink>
        </li>
        <li>
          <NavLink to="/dates" activeClassName="active">
            Dates
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" activeClassName="active">
            Services
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BusinessNavBar;
