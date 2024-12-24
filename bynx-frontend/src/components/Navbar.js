import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const location = useLocation();

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

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className={isMenuOpen ? 'active' : ''}>
      <div className="navbar-title" onClick={toggleMenu}>
        BYNX
      </div>
      {isAuthPage ? (
        <button onClick={toggleTheme} className="theme-toggle-button">Toggle Theme</button>
      ) : (
        <>
          <ul>
            <li>
              <Link to="/home" onClick={closeMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/reports" onClick={closeMenu}>
                Reports
              </Link>
            </li>
            <li>
              <Link to="/complaints" onClick={closeMenu}>
                Complaints
              </Link>
            </li>
            {userRole !== 'User' && (
              <>
                <li>
                  <Link to="/maintenance" onClick={closeMenu}>
                    Maintenance
                  </Link>
                </li>
                <li>
                  <Link to="/tasks" onClick={closeMenu}>
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link to="/bin-management" onClick={closeMenu}>
                    Bin Management
                  </Link>
                </li>
                <li>
                  <Link to="/collection-routes" onClick={closeMenu}>
                    Collection Routes
                  </Link>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </ul>
          <button onClick={toggleTheme} className="theme-toggle-button">Toggle Theme</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;