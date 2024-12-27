import React, { useState, useEffect } from 'react';
import API from "../api/axios";
import './Maintenance.css';

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

    useEffect(() => {
        fetchMaintenanceRecords();
    }, []);

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
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Rest of your component JSX remains the same
    return (
        <div className="maintenance">
            <h1>Maintenance Page</h1>

            {userRole === 'Worker' && (
                <>
                    <div className="section-header">
                        <button className="add-button" onClick={() => setMaintenanceFormVisible(!isMaintenanceFormVisible)}>
                            + Add Maintenance Request
                        </button>
                    </div>

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
                            <button type="submit">Submit</button>
                        </form>
                    )}

                    <table className="maintenance-table">
                        <thead>
                            <tr>
                                <th>Maintenance ID</th>
                                <th>Details</th>
                                <th>Cost</th>
                                <th>Vehicle Number</th>
                                <th>Maintenance Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {maintenanceRecords.map((record) => (
                                <tr key={record.maintenance_id}>
                                    <td>{record.maintenance_id}</td>
                                    <td>{record.details}</td>
                                    <td>{record.cost}</td>
                                    <td>{record.vehicle_number || record.vehicle_id}</td>
                                    <td>{record.maintenance_date ? new Date(record.maintenance_date).toLocaleString('en-GB') : 'Pending'}</td>
                                    <td className={`status ${record.status?.toLowerCase()}`}>{record.status || 'Pending'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {userRole === 'Admin' && (
                <table className="maintenance-table">
                    <thead>
                        <tr>
                            <th>Maintenance ID</th>
                            <th>Details</th>
                            <th>Cost</th>
                            <th>Vehicle Number</th>
                            <th>Maintenance Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {maintenanceRecords.map((record) => (
                            <tr key={record.maintenance_id}>
                                <td>{record.maintenance_id}</td>
                                <td>{record.details}</td>
                                <td>{record.cost}</td>
                                <td>{record.vehicle_number || record.vehicle_id}</td>
                                <td>{record.maintenance_date ? new Date(record.maintenance_date).toLocaleString('en-GB') : 'Pending'}</td>
                                <td className={`status ${record.status?.toLowerCase()}`}>{record.status || 'Pending'}</td>
                                <td>
                                    {record.status !== 'Completed' && (
                                        <button 
                                            className="complete-button"
                                            onClick={() => handleMarkAsCompleted(record.maintenance_id)}
                                        >
                                            Mark as Completed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Maintenance;