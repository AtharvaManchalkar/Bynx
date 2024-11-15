import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <nav className={isActive ? 'active' : ''}>
      <div className="navbar-title" onClick={handleToggle}>
        BYNX
      </div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/bin-management">Bin Management</Link></li>
        <li><Link to="/collection-routes">Collection Routes</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/complaints-maintenance">Complaints & Maintenance</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
