import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/BusinessNavbar.css';

const BusinessNavBar = () => {
  return (
    <nav className="business-navbar">
      <ul>
        <li>
          <NavLink to="/profile" className="nav-link" activeClassName="active">
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/financial" className="nav-link" activeClassName="active">
            Financial
          </NavLink>
        </li>
        <li>
          <NavLink to="/dates" className="nav-link" activeClassName="active">
            Dates
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className="nav-link" activeClassName="active">
            Services
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default BusinessNavBar;
