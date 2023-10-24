import "./Admin.css";
import React from 'react';
import { FaUserCircle, FaBars } from 'react-icons/fa'; // Import the Font Awesome icons

const Navbar = ({ CName, isSidebarVisible, toggleSidebar }) => {
  return (
    <div className="navbar">
      <div>
        <span className="menu-icon" onClick={toggleSidebar}>
            <FaBars />
        </span>
        <span className="name">{CName}</span>
      </div>
      <div>
        <FaUserCircle className="profile-icon" /> {/* Add the profile icon */}
      </div>
    </div>
  );
};

export default Navbar;
