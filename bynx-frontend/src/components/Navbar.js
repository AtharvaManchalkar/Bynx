import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className={isMenuOpen ? 'active' : ''}>
      <div className="navbar-title" onClick={toggleMenu}>
        BYNX
      </div>
      <ul>
        <li>
          <NavLink to="/" exact="true" activeclassname="active" onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/bin-management" activeclassname="active" onClick={closeMenu}>
            Bin Management
          </NavLink>
        </li>
        <li>
          <NavLink to="/collection-routes" activeclassname="active" onClick={closeMenu}>
            Collection Routes
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" activeclassname="active" onClick={closeMenu}>
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/complaints-maintenance" activeclassname="active" onClick={closeMenu}>
            Complaints & Maintenance
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" activeclassname="active" onClick={closeMenu}>
            Login
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" activeclassname="active" onClick={closeMenu}>
            Tasks
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;