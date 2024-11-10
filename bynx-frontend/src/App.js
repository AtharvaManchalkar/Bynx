import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeDashboard from './pages/HomeDashboard';
import BinManagement from './pages/BinManagement';
import CollectionRoutes from './pages/CollectionRoutes';
import Reports from './pages/Reports';
import ComplaintsMaintenance from './pages/ComplaintsMaintenance';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/bin-management" element={<BinManagement />} />
          <Route path="/collection-routes" element={<CollectionRoutes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/complaints-maintenance" element={<ComplaintsMaintenance />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
