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
    const sampleBins = [
        { bin_id: 1, location: "12.9716, 77.5946", status: "Full", capacity: 100, current_level: 90 },     // Majestic
        { bin_id: 2, location: "12.9767, 77.5713", status: "Half", capacity: 100, current_level: 50 },     // Malleshwaram
        { bin_id: 3, location: "12.9783, 77.6408", status: "Full", capacity: 100, current_level: 85 },     // Indiranagar
        { bin_id: 4, location: "12.9254, 77.5468", status: "Empty", capacity: 100, current_level: 10 },    // Banashankari
        { bin_id: 5, location: "13.0298, 77.5441", status: "Full", capacity: 100, current_level: 95 },     // Hebbal
        { bin_id: 6, location: "12.9299, 77.6848", status: "Half", capacity: 100, current_level: 60 },     // HSR Layout
        { bin_id: 7, location: "12.9352, 77.6245", status: "Full", capacity: 100, current_level: 80 },     // Koramangala
        { bin_id: 8, location: "12.9789, 77.6055", status: "Empty", capacity: 100, current_level: 15 }     // MG Road
    ];

    const createRoadRoute = (route, map, color) => {
        const waypoints = route.map(bin => 
            L.latLng(bin.location.split(',').map(Number))
        );
        
        return L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            lineOptions: {
                styles: [{ color: color, weight: 4, opacity: 0.7 }]
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false
        }).addTo(map);
    };
    
    useEffect(() => {
        const fetchBins = async () => {
            try {
                const response = await API.get('/bins');
                setBins(response.data);
            } catch (error) {
                console.log('Using sample data instead');
                setBins(sampleBins);
                
                // Center map on Bengaluru
                const center = [12.9716, 77.5946]; // Centered around Majestic, Bengaluru
                setMapCenter(center);
                setMapZoom(12);
            }
        };
    
        fetchBins();
    }, []);

    const handleAssignBins = () => {
        const assignedRoutes = assignBinsToRoutes(bins);
        setRoutes(assignedRoutes);
        
        const map = mapRef.current;
        if (map) {
            // Clear existing routes
            if (routingControl) {
                routingControl.forEach(control => control.remove());
            }
            
            // Create new road-based routes
            const newControls = assignedRoutes.map((route, index) => 
                createRoadRoute(route, map, index === 0 ? '#FF0000' : '#00FF00')
            );
            
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
            mapRef.current = map;
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
                                <Polyline 
                                    key={index} 
                                    positions={route.map(bin => bin.location.split(',').map(Number))} 
                                    color={index === 0 ? '#FF0000' : '#00FF00'} 
                                    weight={4}
                                    opacity={0.8}
                                />
                            ))}
                        </MapContainer>
                    </div>
                    <div className="legend">
                    <h3>Legend</h3>
                    <p style={{ color: "#FF0000" }}>Urgent Route (70% full)</p>
                    <p style={{ color: "#00FF00" }}>Normal Route (≤70% full)</p>
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