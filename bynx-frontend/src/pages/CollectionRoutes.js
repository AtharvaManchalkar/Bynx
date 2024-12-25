import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from "../api/axios";
import './CollectionRoutes.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25,41],
    iconAnchor: [12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CollectionRoutes = () => {
    const [bins, setBins] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [showTruck, setShowTruck] = useState(false);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
    const [mapZoom, setMapZoom] = useState(13);

    useEffect(() => {
        const fetchBins = async () => {
            try {
                const response = await API.get('/bins');
                setBins(response.data);
                
                // Calculate center and bounds when bins are loaded
                if (response.data.length > 0) {
                    const locations = response.data.map(bin => 
                        bin.location.split(',').map(Number)
                    );
                    
                    // Calculate average center
                    const center = locations.reduce((acc, curr) => 
                        [acc[0] + curr[0]/locations.length, acc[1] + curr[1]/locations.length], 
                        [0, 0]
                    );
                    
                    setMapCenter(center);
                }
            } catch (error) {
                console.error('Error fetching bins:', error);
            }
        };

        fetchBins();
    }, []);

    const handleAssignBins = () => {
        // Placeholder for actual bin assignment functionality
        const assignedRoutes = assignBinsToRoutes(bins);
        setRoutes(assignedRoutes);
    };

    const assignBinsToRoutes = (bins) => {
        // Placeholder for bin assignment logic
        // This function should return an array of routes, each route being an array of bin locations
        return [
            bins.slice(0, Math.ceil(bins.length / 2)),
            bins.slice(Math.ceil(bins.length / 2))
        ];
    };

    const toggleShowTruck = () => setShowTruck(!showTruck);

    const truckIcon = new L.Icon({
        iconUrl: 'https://example.com/truck-icon.png',
        iconSize: [25, 25],
    });

    const MapComponent = () => {
        const map = useMap();
        useEffect(() => {
            map.invalidateSize();
        }, [map]);
        return null;
    };

    return (
        <div className="collection-routes">
            <h1>Collection Routes</h1>

            <div className="main-content">
                <div className="map-section">
                    <h2>Map</h2>
                    <div className="map-container">
                    <MapContainer 
                    center={mapCenter} 
                    zoom={mapZoom} 
                    style={{ height: "100%", width: "100%" }}
                        >
                            <MapComponent />
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {bins.map((bin) => (
                                <Marker 
                                    key={bin.bin_id} 
                                    position={bin.location.split(',').map(Number)}
                                >
                                    <Popup>
                                        <div>
                                            <strong>Bin ID:</strong> {bin.bin_id}<br/>
                                            <strong>Status:</strong> {bin.status}<br/>
                                            <strong>Capacity:</strong> {bin.capacity}<br/>
                                            <strong>Current Level:</strong> {bin.current_level}
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                            {showTruck && routes.map((route, index) => (
                                <Polyline key={index} positions={route.map(bin => bin.location.split(',').map(Number))} color={index % 2 === 0 ? 'blue' : 'green'} />
                            ))}
                        </MapContainer>
                    </div>
                    <div className="legend">
                        <h3>Legend</h3>
                        <p style={{ color: "blue" }}>Route 1</p>
                        <p style={{ color: "green" }}>Route 2</p>
                    </div>
                </div>

                <div className="control-panel">
                    <h2>Control Panel</h2>
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