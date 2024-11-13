import React, { useState } from 'react';
import './ComplaintsMaintenance.css';

const ComplaintsMaintenance = () => {
    const [complaints, setComplaints] = useState([
        { id: 1, binId: 101, description: "Overflowing bin near park entrance", status: "open", dateSubmitted: "12/11/2024" },
        { id: 2, binId: 102, description: "Damaged bin in downtown", status: "in-progress", dateSubmitted: "10/11/2024" },
    ]);

    const [maintenanceRecords, setMaintenanceRecords] = useState([
        { id: 1, date: "10/11/2024", binId: 101, cost: "50", notes: "Replaced damaged bin lid" },
    ]);

    const [isComplaintFormVisible, setComplaintFormVisible] = useState(false);
    const [isMaintenanceFormVisible, setMaintenanceFormVisible] = useState(false);

    const [newComplaint, setNewComplaint] = useState({ binId: '', description: '' });
    const [newMaintenance, setNewMaintenance] = useState({ binId: '', cost: '', notes: '' });

    const toggleComplaintForm = () => setComplaintFormVisible(!isComplaintFormVisible);
    const toggleMaintenanceForm = () => setMaintenanceFormVisible(!isMaintenanceFormVisible);

    const handleComplaintSubmit = (e) => {
        e.preventDefault();
        const newComplaintRecord = {
            id: complaints.length + 1,
            binId: newComplaint.binId,
            description: newComplaint.description,
            status: "open",
            dateSubmitted: new Date().toLocaleDateString('en-GB'),
        };
        setComplaints([...complaints, newComplaintRecord]);
        setNewComplaint({ binId: '', description: '' });
    };

    const handleMaintenanceSubmit = (e) => {
        e.preventDefault();
        const newMaintenanceRecord = {
            id: maintenanceRecords.length + 1,
            binId: newMaintenance.binId,
            cost: newMaintenance.cost,
            notes: newMaintenance.notes,
            date: new Date().toLocaleDateString('en-GB'),
        };
        setMaintenanceRecords([...maintenanceRecords, newMaintenanceRecord]);
        setNewMaintenance({ binId: '', cost: '', notes: '' });
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
                        <tr key={complaint.id}>
                            <td>{complaint.binId}</td>
                            <td>{complaint.description}</td>
                            <td>{complaint.status}</td>
                            <td>{complaint.dateSubmitted}</td>
                            <td>
                                {complaint.status !== "resolved" ? (
                                    <button
                                        className="mark-resolved-button"
                                        onClick={() => {
                                            const updatedComplaints = [...complaints];
                                            updatedComplaints[index].status = "resolved";
                                            setComplaints(updatedComplaints);
                                        }}
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
                        placeholder="Cost" 
                        value={newMaintenance.cost} 
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, cost: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        placeholder="Notes" 
                        value={newMaintenance.notes} 
                        onChange={(e) => setNewMaintenance({ ...newMaintenance, notes: e.target.value })} 
                    />
                    <button type="submit">Submit</button>
                </form>
            )}

            <table className="maintenance-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>BinID</th>
                        <th>Cost</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody>
                    {maintenanceRecords.map((record) => (
                        <tr key={record.id}>
                            <td>{record.date}</td>
                            <td>{record.binId}</td>
                            <td>${record.cost}</td>
                            <td>{record.notes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComplaintsMaintenance;
