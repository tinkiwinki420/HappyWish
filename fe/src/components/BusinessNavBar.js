import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/BusinessNavbar.css";
import NotificationDropdown from "./NotificationDropdown"; // Import the NotificationDropdown component

const BusinessNavBar = () => {
  const category = localStorage.getItem("category"); // Get category from localStorage

  return (
    <nav className='business-navbar'>
      <ul>
        <li>
          <NavLink
            to='/profile'
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/financial'
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Financial
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/dates'
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dates
          </NavLink>
        </li>
        {category === "Hall" && (
          <li>
            <NavLink
              to='/services'
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Services
            </NavLink>
          </li>
        )}
        <li>
          <NotificationDropdown />
        </li>
      </ul>
    </nav>
  );
};

export default BusinessNavBar;
