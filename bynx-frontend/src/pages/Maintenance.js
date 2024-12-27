import React, { useState, useEffect } from 'react';
import API from "../api/axios";
import './Maintenance.css';

const Maintenance = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [isMaintenanceFormVisible, setMaintenanceFormVisible] = useState(false);
    const [newMaintenance, setNewMaintenance] = useState({ details: '', cost: 0, vehicle_id: 1 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get("/api/maintenance");
                setMaintenanceRecords(response.data || []);
            } catch (error) {
                console.error("Error fetching maintenance records:", error);
                setError('Failed to fetch maintenance records');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await API.post("/api/maintenance", newMaintenance);
            setMaintenanceRecords([...maintenanceRecords, response.data]);
            setNewMaintenance({ details: '', cost: 0, vehicle_id: 1 });
            setMaintenanceFormVisible(false);
        } catch (error) {
            console.error("Error adding maintenance record:", error);
            setError('Failed to add maintenance record');
        }
    };

    const handleMarkAsCompleted = async (recordId) => {
        try {
            const response = await API.put(`/api/maintenance/${recordId}`, { maintenance_date: new Date(), status: 'Resolved' });
            if (response.status === 200) {
                const updatedRecords = maintenanceRecords.map(record => 
                    record.maintenance_id === recordId ? { ...record, maintenance_date: new Date(), status: 'Resolved' } : record
                );
                setMaintenanceRecords(updatedRecords);
            }
        } catch (error) {
            console.error("Error marking maintenance as completed:", error);
            setError('Failed to mark maintenance as completed');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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
                                <option value="Oil change">Oil change</option>
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
                                    <td>{record.vehicle_number}</td>
                                    <td>{record.maintenance_date ? new Date(record.maintenance_date).toLocaleString('en-GB') : 'Pending'}</td>
                                    <td>{record.status}</td>
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
                                <td>{record.vehicle_number}</td>
                                <td>{record.maintenance_date ? new Date(record.maintenance_date).toLocaleString('en-GB') : 'Pending'}</td>
                                <td>{record.status}</td>
                                <td>
                                    <button onClick={() => handleMarkAsCompleted(record.maintenance_id)}>
                                        Mark as Completed
                                    </button>
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