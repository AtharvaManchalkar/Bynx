// src/pages/HomeDashboard.js
import React from 'react';
// import Navbar from '../components/Navbar';
import SummaryMetrics from '../components/SummaryMetrics';
import './HomeDashboard.css';  // Ensure this file exists for any specific styling

const HomeDashboard = () => {
  return (
  
    <div className="home-dashboard">
       {/* <Navbar /> */}
       <div className="dashboard-content">
         <h1 className="dashboard-title">Waste Management Dashboard</h1>

         <SummaryMetrics />


        <div className="action-buttons">
          <button onClick={() => window.location.href = '/bin-management'}>Go to Bin Management</button>
          <button onClick={() => window.location.href = '/collection-routes'}>Go to Collection Routes</button>
        </div>     
        
         <div className="recent-alerts">
           <h2>Recent Alerts</h2>
           <p>Bin #32 at Location X has exceeded 90% capacity.</p>
           <p>Truck #5 needs maintenance.</p>
         </div>
         
       </div>
     </div>
  );
};

export default HomeDashboard;
