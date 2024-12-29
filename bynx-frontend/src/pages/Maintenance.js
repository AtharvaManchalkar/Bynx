import React, { useState, useEffect } from 'react';
import API from "../api/axios";
import './Maintenance.css';

const MaintenanceCard = ({ record, handleMarkAsCompleted, userRole }) => {
    const formatDate = (date) => new Date(date).toLocaleString('en-GB');
    
    return (
        <div className="maintenance-card">
            <div className="maintenance-header">
                <span className="maintenance-id">#{record.maintenance_id}</span>
                <span className={`maintenance-status status-${record.status?.toLowerCase()}`}>
                    {record.status || 'Pending'}
                </span>
            </div>
            <div className="maintenance-body">
                <p className="maintenance-details">{record.details}</p>
                <div className="maintenance-meta">
                    <div>Cost: ${record.cost}</div>
                    <div>Vehicle: {record.vehicle_number || record.vehicle_id}</div>
                    <div>Date: {record.maintenance_date ? formatDate(record.maintenance_date) : 'Pending'}</div>
                </div>
            </div>
            {userRole === 'Admin' && record.status !== 'Completed' && (
                <div className="maintenance-footer">
                    <button 
                        className="resolve-button"
                        onClick={() => handleMarkAsCompleted(record.maintenance_id)}
                    >
                        Mark as Completed
                    </button>
                </div>
            )}
        </div>
    );
};

const Maintenance = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [isMaintenanceFormVisible, setMaintenanceFormVisible] = useState(false);
    const [newMaintenance, setNewMaintenance] = useState({
        details: '',
        cost: '',
        vehicle_id: '',
        status: 'Pending'
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        fetchMaintenanceRecords();
    }, []);

    const fetchMaintenanceRecords = async () => {
        try {
            const response = await API.get("/maintenance");
            setMaintenanceRecords(response.data || []);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching maintenance records:", error);
            setError('Failed to fetch maintenance records');
            setIsLoading(false);
        }
    };

    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const maintenanceData = {
                details: newMaintenance.details,
                cost: parseFloat(newMaintenance.cost),
                vehicle_id: parseInt(newMaintenance.vehicle_id),
                status: 'Pending'
            };

            const response = await API.post("/maintenance", maintenanceData);
            if (response.data) {
                await fetchMaintenanceRecords();
                setNewMaintenance({
                    details: '',
                    cost: '',
                    vehicle_id: '',
                    status: 'Pending'
                });
                setMaintenanceFormVisible(false);
            }
        } catch (error) {
            setError('Failed to add maintenance record: ' + (error.response?.data?.detail || error.message));
            setTimeout(() => setError(null), 3000);
        }
    };

    const handleMarkAsCompleted = async (recordId) => {
        try {
            const response = await API.put(`/maintenance/${recordId}`, {
                status: 'Completed',
                maintenance_date: new Date().toISOString()
            });

            if (response.data) {
                await fetchMaintenanceRecords();
            }
        } catch (error) {
            setError('Failed to mark as completed: ' + (error.response?.data?.detail || error.message));
            setTimeout(() => setError(null), 3000);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="maintenance">
            <h1>Maintenance Page</h1>

            {userRole === 'Worker' && (
                <>
                    <button className="add-button" onClick={() => setMaintenanceFormVisible(!isMaintenanceFormVisible)}>
                        + Add Maintenance Request
                    </button>

                    {isMaintenanceFormVisible && (
                        <form className="maintenance-form" onSubmit={handleMaintenanceSubmit}>
                            <select 
                                value={newMaintenance.details} 
                                onChange={(e) => setNewMaintenance({ ...newMaintenance, details: e.target.value })} 
                                required
                            >
                                <option value="">Select Maintenance Type</option>
                                <option value="Oil Change">Oil Change</option>
                                <option value="Tire Replacement">Tire Replacement</option>
                                <option value="Brake Repair">Brake Repair</option>
                            </select>
                            <input 
                                type="number" 
                                placeholder="Cost" 
                                value={newMaintenance.cost} 
                                onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: e.target.value })} 
                                required
                            />
                            <input 
                                type="number" 
                                placeholder="Vehicle ID" 
                                value={newMaintenance.vehicle_id} 
                                onChange={(e) => setNewMaintenance({ ...newMaintenance, vehicle_id: e.target.value })} 
                                required
                            />
                            <button type="submit" className="submit-button">Submit</button>
                        </form>
                    )}
                </>
            )}

            <div className="maintenance-grid">
                {maintenanceRecords.map((record) => (
                    <MaintenanceCard
                        key={record.maintenance_id}
                        record={record}
                        handleMarkAsCompleted={handleMarkAsCompleted}
                        userRole={userRole}
                    />
                ))}
            </div>
        </div>
    );
};

export default Maintenance;