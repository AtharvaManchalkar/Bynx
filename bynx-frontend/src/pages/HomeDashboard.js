// src/pages/HomeDashboard.js
import React from 'react';
import SummaryMetrics from '../components/SummaryMetrics';
import './HomeDashboard.css';

const HomeDashboard = () => {
  return (
  
    <div className="home-dashboard">
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
