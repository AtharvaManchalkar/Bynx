import React, { useState, useEffect } from 'react';
import './Announcements.css';

const Announcements = ({ announcements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {announcements.map((announcement, index) => (
          <div className="carousel-item" key={index}>
            <div className="announcement-content">
              <div className="announcement-text">
                <h3>{announcement.title}</h3>
                <p>{announcement.details}</p>
              </div>
              {announcement.image_url && (
                <div className="announcement-image">
                  <img src={announcement.image_url} alt={announcement.title} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-dots">
        {announcements.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Announcements;