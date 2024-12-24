import React, { useState } from 'react';
import API from "../api/axios";
import './AddAnnouncements.css';

const AddAnnouncement = ({ onAnnouncementAdded, onClose }) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/announcements', { title, details, image_url: imageUrl });
      if (response.data) {
        onAnnouncementAdded();
        setTitle('');
        setDetails('');
        setImageUrl('');
        onClose();
      } else {
        alert('Failed to add announcement');
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Add Announcement</h2>
        <form onSubmit={handleAddAnnouncement} className="add-announcement">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="details">Details</label>
            <textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="imageUrl">Image URL (optional)</label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
          <button type="submit">Add Announcement</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddAnnouncement;