import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav className={isMenuOpen ? 'active' : ''}>
      <div className="navbar-title" onClick={toggleMenu}>
        BYNX
      </div>
      <ul>
        <li>
          <NavLink to="/home" exact="true" activeclassname="active" onClick={closeMenu}>
            Home
          </NavLink>
        </li>
        {userRole !== 'User' && (
          <>
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
          </>
        )}
        <li>
          <NavLink to="/reports" activeclassname="active" onClick={closeMenu}>
            Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/complaints" activeclassname="active" onClick={closeMenu}>
            Complaints
          </NavLink>
        </li>
        {userRole !== 'User' && (
          <>
            <li>
              <NavLink to="/maintenance" activeclassname="active" onClick={closeMenu}>
                Maintenance
              </NavLink>
            </li>
            <li>
              <NavLink to="/tasks" activeclassname="active" onClick={closeMenu}>
                Tasks
              </NavLink>
            </li>
          </>
        )}
        <li>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;