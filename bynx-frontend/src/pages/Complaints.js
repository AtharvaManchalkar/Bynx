import React, { useState, useEffect } from 'react';
import './Complaints.css';
import API from "../api/axios";

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [isComplaintFormVisible, setComplaintFormVisible] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ userId: '', binId: '', description: '' });

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await API.get("/complaints");
                setComplaints(response.data.data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        fetchComplaints();
    }, []);

    const toggleComplaintForm = () => setComplaintFormVisible(!isComplaintFormVisible);

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

    return (
        <div className="complaints">
            <h1>Complaints Page</h1>

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
        </div>
    );
};

export default Complaints;