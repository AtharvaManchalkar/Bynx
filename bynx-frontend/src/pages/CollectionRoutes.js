import React, { useState } from 'react';
import './CollectionRoutes.css';

const CollectionRoutes = () => {
    const [showTruck, setShowTruck] = useState(false);

    const handleRefreshRoutes = () => {
        alert('Refreshing routes...');
        // Placeholder for actual refresh functionality
    };

    const handleAssignBins = () => {
        alert('Assigning bins to trucks...');
        // Placeholder for actual bin assignment functionality
    };

    const toggleShowTruck = () => setShowTruck(!showTruck);

    return (
        <div className="collection-routes">
            <h1>Collection Routes</h1>

            <div className="main-content">
                <div className="map-section">
                    <h2>Map</h2>
                    <div className="map-placeholder">
                        <p>Map feature is yet to be implemented.</p>
                    </div>
                    <div className="legend">
                        <h3>Legend</h3>
                        <p style={{ color: "blue" }}>Truck1</p>
                        <p style={{ color: "green" }}>Truck2</p>
                        {/* Additional legend items as needed */}
                    </div>
                </div>

                <div className="control-panel">
                    <h2>Control Panel</h2>
                    <button onClick={handleRefreshRoutes} className="control-button">Refresh Routes</button>
                    <button onClick={handleAssignBins} className="control-button">Assign Bins to Trucks</button>
                    <div className="toggle">
                        <label>
                            Show Truck on Map:
                            <input type="checkbox" checked={showTruck} onChange={toggleShowTruck} />
                            <span className="toggle-label">{showTruck ? 'On' : 'Off'}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionRoutes;
