import React from "react";
import { Link } from "react-router-dom";
import '../styles/header.css'; // Import the CSS file
import '../styles/navbar.css'; // Import the CSS file

const Header = () => {
  const userId = localStorage.getItem("userId");

  return (
    <header className='header'>
      <nav className='navbar'>
        <ul>
          <li>
            <Link to='/' className='nav-link'>
              Home
            </Link>
          </li>
          <li>
            <Link to='/categories' className='nav-link'>
              Categories
            </Link>
          </li>
          {!userId && (
            <li>
              <Link to='/register' className='nav-link'>
                Register
              </Link>
            </li>
          )}
          {!userId && (
            <li>
              <Link to='/login' className='nav-link'>
                Login
              </Link>
            </li>
          )}
          {userId && (
            <li>
              <Link to='/profile' className='nav-link'>
                Profile
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
