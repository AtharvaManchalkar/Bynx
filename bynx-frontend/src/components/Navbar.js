import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav>
      <div className="navbar-title">BYNX</div>
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
