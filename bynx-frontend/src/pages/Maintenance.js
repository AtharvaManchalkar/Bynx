import React, { useState, useEffect } from 'react';
import './Maintenance.css';
import API from "../api/axios";

const Maintenance = () => {
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [isMaintenanceFormVisible, setMaintenanceFormVisible] = useState(false);
    const [newMaintenance, setNewMaintenance] = useState({ binId: '', description: '', status: 'Pending' });

    useEffect(() => {
        const fetchMaintenanceRecords = async () => {
            try {
                const response = await API.get("/maintenance-requests");
                setMaintenanceRecords(response.data.data);
            } catch (error) {
                console.error("Error fetching maintenance records:", error);
            }
        };

        fetchMaintenanceRecords();
    }, []);

    const toggleMaintenanceForm = () => setMaintenanceFormVisible(!isMaintenanceFormVisible);

    const handleMaintenanceSubmit = async (e) => {
        e.preventDefault();
        const newMaintenanceRecord = {
            bin_id: newMaintenance.binId,
            description: newMaintenance.description,
            status: newMaintenance.status,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
        try {
            const response = await API.post("/maintenance-requests", newMaintenanceRecord);
            setMaintenanceRecords([...maintenanceRecords, response.data.data]);
            setNewMaintenance({ binId: '', description: '', status: 'Pending' });
        } catch (error) {
            console.error("Error adding maintenance record:", error);
        }
    };

    const handleCompleteMaintenance = async (index) => {
        const updatedMaintenanceRecords = [...maintenanceRecords];
        const record = updatedMaintenanceRecords[index];
        record.status = "Completed";
        record.completed_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try {
            await API.put(`/maintenance-requests/${record.request_id}`, record);
            setMaintenanceRecords(updatedMaintenanceRecords);
        } catch (error) {
            console.error("Error completing maintenance record:", error);
        }
    };

    return (
        <div className="maintenance">
            <h1>Maintenance Page</h1>

            {/* Maintenance Records */}
            <div className="section-header">
                <h2>Maintenance Records</h2>
                <button className="add-button" onClick={toggleMaintenanceForm}>+ Add Maintenance Record</button>
            </div>

            {isMaintenanceFormVisible && (
                <form className="maintenance-form" onSubmit={handleMaintenanceSubmit}>
                    <input 
                        type="text" 
                        placeholder="Bin ID" 
                        value={newMaintenance.binId} 
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, binId: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={newMaintenance.description} 
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, description: e.target.value })} 
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            <table className="maintenance-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>BinID</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {maintenanceRecords.map((record, index) => (
                        <tr key={record.request_id}>
                            <td>{new Date(record.created_at).toLocaleString('en-GB')}</td>
                            <td>{record.bin_id}</td>
                            <td>{record.description}</td>
                            <td>{record.status}</td>
                            <td>
                                {record.status !== "Completed" ? (
                                    <button
                                        className="mark-completed-button"
                                        onClick={() => handleCompleteMaintenance(index)}
                                    >
                                        Mark as Completed
                                    </button>
                                ) : (
                                    <span className="completed-status">Completed</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Maintenance;