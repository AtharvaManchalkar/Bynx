import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from "../api/axios";
import './CollectionRoutes.css';
import truckIconUrl from '../components/truck.png';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const binIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25,41],
    iconAnchor: [12,41]
});

const truckIcon = new L.Icon({
    iconUrl: truckIconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});




const CollectionRoutes = () => {
    const [collectionData, setCollectionData] = useState({ bins: [], vehicles: [] });
    const [routes, setRoutes] = useState([]);
    const [showVehicles, setShowVehicles] = useState(true);
    const [mapCenter] = useState([12.9716, 77.5946]); // Bengaluru coordinates
    const [mapZoom] = useState(13);
    const [routingControl, setRoutingControl] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchCollectionData = async () => {
            try {
                const response = await API.get('/collection');
                setCollectionData(response.data);
            } catch (error) {
                console.error('Error fetching collection data:', error);
            }
        };
        fetchCollectionData();
    }, []);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    };

    const assignOptimizedRoutes = () => {
        const routes = collectionData.vehicles.map(vehicle => ({
            vehicleId: vehicle.vehicle_id,
            position: [vehicle.latitude, vehicle.longitude],
            bins: []
        }));

        const priorityBins = [...collectionData.bins].sort((a, b) => b.current_level - a.current_level);

        priorityBins.forEach(bin => {
            let nearestVehicle = routes.reduce((nearest, route) => {
                const distance = calculateDistance(
                    bin.latitude,
                    bin.longitude,
                    route.position[0],
                    route.position[1]
                );
                return (!nearest || distance < nearest.distance) 
                    ? { route, distance }
                    : nearest;
            }, null);

            if (nearestVehicle) {
                nearestVehicle.route.bins.push(bin);
            }
        });

        setRoutes(routes);
        displayRoutes(routes);
    };

    const createRoadRoute = (waypoints, map, color) => {
        // Remove any existing routing containers
        const existingContainer = document.querySelector('.leaflet-routing-container');
        if (existingContainer) {
            existingContainer.remove();
        }
    
        const control = L.Routing.control({
            waypoints: waypoints,
            routeWhileDragging: false,
            lineOptions: {
                styles: [{ color: color, weight: 4, opacity: 0.7 }]
            },
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            show: false // Hide default container
        }).addTo(map);
    
        // Move routing instructions to our custom container
        control.on('routesfound', function(e) {
            const container = document.getElementById('routing-container');
            const instructions = control.getContainer();
            container.appendChild(instructions);
        });
    
        return control;
    };
    
    

    const displayRoutes = (optimizedRoutes) => {
        if (routingControl) {
            routingControl.forEach(control => control.remove());
        }

        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080'];
        const newControls = optimizedRoutes.map((route, index) => {
            const waypoints = [
                L.latLng(route.position[0], route.position[1]),
                ...route.bins.map(bin => L.latLng(bin.latitude, bin.longitude))
            ];
            return createRoadRoute(waypoints, mapRef.current, colors[index % colors.length]);
        });

        setRoutingControl(newControls);
    };

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
                                {collectionData.bins.map((bin) => (
                                    <Marker 
                                        key={bin.bin_id} 
                                        position={[bin.latitude, bin.longitude]}
                                        icon={binIcon}
                                        zIndexOffset={1000}
                                    >
                                        <Popup className="bin-popup">
                                            <div className="bin-info">
                                                <h4>Bin Details</h4>
                                                <p><strong>Bin ID:</strong> {bin.bin_id}</p>
                                                <p><strong>Status:</strong> {bin.status}</p>
                                                <p><strong>Current Level:</strong> {bin.current_level}%</p>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                                {showVehicles && collectionData.vehicles.map((vehicle) => (
                                    <Marker 
                                        key={vehicle.vehicle_id}
                                        position={[vehicle.latitude, vehicle.longitude]}
                                        icon={truckIcon}
                                        zIndexOffset={2000} // Ensures trucks appear above bin markers
                                    >
                                        <Popup className="vehicle-popup">
                                            <div className="vehicle-info">
                                                <h4>Vehicle {vehicle.vehicle_number}</h4>
                                                <p><strong>Capacity:</strong> {vehicle.capacity}</p>
                                                <p><strong>Last Maintenance:</strong> {new Date(vehicle.last_maintenance).toLocaleDateString()}</p>
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
                        {routes.map((route, index) => (
                            <p key={route.vehicleId}>
                                Vehicle {route.vehicleId}: {route.bins.length} bins assigned
                            </p>
                        ))}
                    </div>
                    <button onClick={assignOptimizedRoutes} className="control-button">
                        Generate Optimized Routes
                    </button>
                    <div className="toggle">
                        <label>
                            Show Vehicles:
                            <input 
                                type="checkbox" 
                                checked={showVehicles} 
                                onChange={() => setShowVehicles(!showVehicles)} 
                            />
                            <span className="toggle-label">{showVehicles ? 'On' : 'Off'}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollectionRoutes;
