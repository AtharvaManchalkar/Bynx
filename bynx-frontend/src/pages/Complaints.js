import React, { useState, useEffect } from 'react';
import './Complaints.css';
import API from "../api/axios";

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [isComplaintFormVisible, setComplaintFormVisible] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ location: '', description: '' });
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await API.get(userRole === 'Admin' ? "/complaints/admin" : `/complaints/user/${userId}`);
                setComplaints(response.data);
            } catch (error) {
                console.error("Error fetching complaints:", error);
            }
        };

        const fetchWorkers = async () => {
            try {
                const response = await API.get("/users?role=Worker");
                setWorkers(response.data);
            } catch (error) {
                console.error("Error fetching workers:", error);
            }
        };

        fetchComplaints();
        if (userRole === 'Admin') {
            fetchWorkers();
        }
    }, [userRole, userId]);

    const toggleComplaintForm = () => setComplaintFormVisible(!isComplaintFormVisible);

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        const newComplaintRecord = {
            user_id: userId,
            location: newComplaint.location,
            description: newComplaint.description,
            status: "Pending",
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };
        try {
            const response = await API.post("/complaints", newComplaintRecord);
            setComplaints([...complaints, response.data]);
            setNewComplaint({ location: '', description: '' });
        } catch (error) {
            console.error("Error adding complaint:", error);
        }
    };

    const handleAssignWorker = async (complaintId, workerName) => {
        try {
            await API.put(`/complaints/${complaintId}`, { assigned_to: workerName });
            setComplaints((prev) =>
                prev.map((complaint) =>
                    complaint.complaint_id === complaintId ? { ...complaint, assigned_to: workerName } : complaint
                )
            );
        } catch (error) {
            console.error("Error assigning worker:", error);
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

            {userRole === 'User' && (
                <>
                    <div className="section-header">
                        <h2>Complaint List</h2>
                        <button className="add-button" onClick={toggleComplaintForm}>+ Lodge a Complaint</button>
                    </div>

                    {isComplaintFormVisible && (
                        <form className="complaint-form" onSubmit={handleComplaintSubmit}>
                            <input 
                                type="text" 
                                placeholder="Location" 
                                value={newComplaint.location} 
                                onChange={(e) => setNewComplaint({ ...newComplaint, location: e.target.value })} 
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
                </>
            )}

            <table className="complaints-table">
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        <th>Location</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Date Submitted</th>
                        {userRole === 'Admin' && <th>Assigned To</th>}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {complaints.map((complaint, index) => (
                        <tr key={complaint.complaint_id}>
                            <td>{complaint.complaint_id}</td>
                            <td>{complaint.location}</td>
                            <td>{complaint.description}</td>
                            <td>{complaint.status}</td>
                            <td>{new Date(complaint.created_at).toLocaleString('en-GB')}</td>
                            {userRole === 'Admin' && (
                                <td>
                                    <select
                                        value={complaint.assigned_to || 'Not yet assigned'}
                                        onChange={(e) => handleAssignWorker(complaint.complaint_id, e.target.value)}
                                    >
                                        <option value="Not yet assigned">Not yet assigned</option>
                                        {workers.map((worker) => (
                                            <option key={worker.id} value={worker.name}>
                                                {worker.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            )}
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