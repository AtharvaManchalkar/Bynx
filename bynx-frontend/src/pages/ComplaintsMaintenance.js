import React, { useState, useEffect } from 'react';
import './ComplaintsMaintenance.css';
import API from "../api/axios";

const ComplaintsMaintenance = () => {
    const [complaints, setComplaints] = useState([]);
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [isComplaintFormVisible, setComplaintFormVisible] = useState(false);
    const [isMaintenanceFormVisible, setMaintenanceFormVisible] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ userId: '', binId: '', description: '' });
    const [newMaintenance, setNewMaintenance] = useState({ binId: '', description: '', status: 'Pending' });

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await API.get("/complaints");
                setComplaints(response.data.data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        const fetchMaintenanceRecords = async () => {
            try {
                const response = await API.get("/maintenance-requests");
                setMaintenanceRecords(response.data.data);
            } catch (error) {
                console.error("Error fetching maintenance records:", error);
            }
        };

        fetchComplaints();
        fetchMaintenanceRecords();
    }, []);

    const toggleComplaintForm = () => setComplaintFormVisible(!isComplaintFormVisible);
    const toggleMaintenanceForm = () => setMaintenanceFormVisible(!isMaintenanceFormVisible);

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        const newComplaintRecord = {
            user_id: newComplaint.userId,
            bin_id: newComplaint.binId,
            description: newComplaint.description,
            status: "Pending",
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
        try {
            const response = await API.post("/complaints", newComplaintRecord);
            setComplaints([...complaints, response.data.data]);
            setNewComplaint({ userId: '', binId: '', description: '' });
        } catch (error) {
            console.error("Error adding complaint:", error);
        }
    };

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

    const handleResolveComplaint = async (index) => {
        const updatedComplaints = [...complaints];
        const complaint = updatedComplaints[index];
        complaint.status = "Resolved";
        complaint.resolved_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try {
            await API.put(`/complaints/${complaint.complaint_id}`, complaint);
            setComplaints(updatedComplaints);
        } catch (error) {
            console.error("Error resolving complaint:", error);
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
        <div className="complaints-maintenance">
            <h1>Complaints Maintenance Page</h1>

            {/* Complaint List */}
            <div className="section-header">
                <h2>Complaint List</h2>
                <button className="add-button" onClick={toggleComplaintForm}>+ Add a new Complaint</button>
            </div>

            {isComplaintFormVisible && (
                <form className="complaint-form" onSubmit={handleComplaintSubmit}>
                    <input 
                        type="text" 
                        placeholder="User ID" 
                        value={newComplaint.userId} 
                        onChange={(e) => setNewComplaint({ ...newComplaint, userId: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Bin ID" 
                        value={newComplaint.binId} 
                        onChange={(e) => setNewComplaint({ ...newComplaint, binId: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Description" 
                        value={newComplaint.description} 
                        onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })} 
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            <table className="complaints-table">
                <thead>
                    <tr>
                        <th>BinID</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Date Submitted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((complaint, index) => (
                        <tr key={complaint.complaint_id}>
                            <td>{complaint.bin_id}</td>
                            <td>{complaint.description}</td>
                            <td>{complaint.status}</td>
                            <td>{new Date(complaint.created_at).toLocaleString('en-GB')}</td>
                            <td>
                                {complaint.status !== "Resolved" ? (
                                    <button
                                        className="mark-resolved-button"
                                        onClick={() => handleResolveComplaint(index)}
                                    >
                                        Mark as Resolved
                                    </button>
                                ) : (
                                    <span className="resolved-status">Resolved</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

export default ComplaintsMaintenance;