import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from "../api/axios";
import './CollectionRoutes.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

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
    const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Bengaluru coordinates
    const [mapZoom, setMapZoom] = useState(13);
    const [routingControl, setRoutingControl] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchBins = async () => {
            try {
                const response = await API.get('/bins');
                setBins(response.data.data);
            } catch (error) {
                console.error('Error fetching bins:', error);
            }
        };
    
        fetchBins();
    }, []);

    const handleAssignBins = () => {
        const assignedRoutes = assignBinsToRoutes(bins);
        setRoutes(assignedRoutes);
        
        if (mapRef.current) {
            // Clear existing routes
            if (routingControl) {
                routingControl.forEach(control => control.remove());
            }
            
            // Create new road-based routes
            const newControls = assignedRoutes.map((route, index) => 
                createRoadRoute(
                    route, 
                    mapRef.current, 
                    index === 0 ? '#FF0000' : '#00FF00'
                )
            ).filter(Boolean);
            
            setRoutingControl(newControls);
        }
    };

    const assignBinsToRoutes = (bins) => {
        // Sort bins by fullness level
        const sortedBins = [...bins].sort((a, b) => b.current_level - a.current_level);
        
        // Create two routes - one for urgent collections (fuller bins) and one for less urgent
        const urgentRoute = sortedBins.filter(bin => bin.current_level > 70);
        const normalRoute = sortedBins.filter(bin => bin.current_level <= 70);
        
        return [urgentRoute, normalRoute];
    };

    const toggleShowTruck = () => setShowTruck(!showTruck);

    const truckIcon = new L.Icon({
        iconUrl: 'https://example.com/truck-icon.png',
        iconSize: [25, 25],
    });

    const MapComponent = () => {
        const map = useMap();
        
        useEffect(() => {
            if (map) {
                mapRef.current = map;
                map.invalidateSize();
            }
        }, [map]);
        
        return null;
    };

    const createRoadRoute = (route, map, color) => {
        const waypoints = route.map(bin => 
            L.latLng(bin.location.latitude, bin.location.longitude)
        );
        
        const control = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            lineOptions: {
                styles: [{ color: color, weight: 4, opacity: 0.7 }],
                zIndex: 1 // Set lower z-index for routes
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        });
    
        control.on('routesfound', () => {
            const routingContainer = document.querySelector('.leaflet-routing-container');
            if (routingContainer) {
                document.getElementById('routing-container').appendChild(routingContainer);
            }
        });
    
        return control.addTo(map);
    };

    return (
        <div className="collection-routes">
            <h1>Collection Routes</h1>

            <div className="main-content">
                <div className="map-and-routes">
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
                                {Array.isArray(bins) && bins.map((bin) => (
                                    <Marker 
                                        key={bin.bin_id} 
                                        position={[bin.location.latitude, bin.location.longitude]}
                                        zIndexOffset={1000} // Ensure markers stay on top
                                    >
                                        <Popup className="bin-popup">
                                            <div className="bin-info">
                                                <h4>Bin Details</h4>
                                                <p><strong>Bin ID:</strong> {bin.bin_id}</p>
                                                <p><strong>Status:</strong> {bin.status}</p>
                                                <p><strong>Capacity:</strong> {bin.capacity}L</p>
                                                <p><strong>Current Level:</strong> {bin.current_level}%</p>
                                                <div className="fill-level">
                                                    <div style={{
                                                        width: `${bin.current_level}%`,
                                                        backgroundColor: bin.current_level > 70 ? '#ff4444' : '#44aa44'
                                                    }}/>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        </div>
                    </div>
                    <div className="routing-section">
                        <h2>Route Details</h2>
                        <div id="routing-container" className="routing-container"></div>
                    </div>
                </div>

                <div className="control-panel">
                    <h2>Control Panel</h2>
                    <div className="legend">
                        <h3>Legend</h3>
                        <p style={{ color: "#FF0000" }}>Urgent Route (70% full)</p>
                        <p style={{ color: "#00FF00" }}>Normal Route (≤70% full)</p>
                    </div>
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