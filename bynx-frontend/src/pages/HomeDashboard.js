import React, { useState, useEffect } from 'react';
import SummaryMetrics from '../components/SummaryMetrics';
import Announcements from '../components/Announcements';
import AddAnnouncement from '../components/AddAnnouncements';
import Footer from '../components/Footer';
import API from '../api/axios';
import './HomeDashboard.css';

const HomeDashboard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const userRole = localStorage.getItem('userRole');

  const fetchAnnouncements = async () => {
    try {
      const response = await API.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddButtonClick = () => {
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
  };

  return (
    <div className="home-dashboard">
      <Announcements announcements={announcements} />
      {userRole === 'Admin' && (
        <>
          <button className="add-announcement-button" onClick={handleAddButtonClick}>
            Add Announcement
          </button>
          {showAddForm && (
            <AddAnnouncement onAnnouncementAdded={fetchAnnouncements} onClose={handleCloseForm} />
          )}
        </>
      )}
      <div className="dashboard-content">
        <h1 className="dashboard-title">Waste Management Dashboard</h1>
        <SummaryMetrics />
      </div>
      <Footer />
    </div>
  );
};

export default HomeDashboard;