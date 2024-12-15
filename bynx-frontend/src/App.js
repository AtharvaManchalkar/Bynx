import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeDashboard from './pages/HomeDashboard';
import BinManagement from './pages/BinManagement';
import CollectionRoutes from './pages/CollectionRoutes';
import Reports from './pages/Reports';
import ComplaintsMaintenance from './pages/ComplaintsMaintenance';
import Login from './pages/Login'; // Add login page if authentication is required
import NotFound from './pages/NotFound'; // Add a 404 page for undefined routes

const App = () => {
  return (
    <Router>
      <div>
        {/* Navbar remains visible across all routes */}
        <Navbar />

        {/* Define application routes */}
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/bin-management" element={<BinManagement />} />
          <Route path="/collection-routes" element={<CollectionRoutes />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/complaints-maintenance" element={<ComplaintsMaintenance />} />
          <Route path="/login" element={<Login />} />
          
          {/* Fallback route for undefined paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
