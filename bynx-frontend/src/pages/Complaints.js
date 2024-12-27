import React, { useState, useEffect } from 'react';
import './Complaints.css';
import API from "../api/axios";

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [isComplaintFormVisible, setComplaintFormVisible] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ description: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [workers, setWorkers] = useState([]);
    const [error, setError] = useState(null);
    const userRole = localStorage.getItem('role');
    const userId = parseInt(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchData = async () => {
            if (!userId || !userRole) {
                setError('Authentication required');
                setIsLoading(false);
                return;
            }

            try {
                const endpoint = userRole === 'Admin' ? "/complaints" : `/complaints/user/${userId}`;
                const complaintsResponse = await API.get(endpoint);
                setComplaints(complaintsResponse.data || []);

                if (userRole === 'Admin') {
                    const workersResponse = await API.get("/users?role=Worker");
                    setWorkers(workersResponse.data || []);
                }
            } catch (error) {
                console.error("Error fetching complaints:", error);
                setError('Failed to fetch complaints');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userId, userRole]);

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        const complaintData = {
            user_id: userId,
            description: newComplaint.description,
            status: "Pending"
        };

        try {
            const response = await API.post("/complaints", complaintData);
            setComplaints([...complaints, response.data]);
            setNewComplaint({ description: '' });
            setComplaintFormVisible(false);
        } catch (error) {
            console.error("Error adding complaint:", error);
        }
    };

    const handleAssignWorker = async (complaintId, worker) => {
        try {
            const updateData = {
                assigned_to: worker.name,
                status: "Assigned"
            };

            const response = await API.put(`/complaints/${complaintId}`, updateData);
            
            if (response.status === 200) {
                // Refresh complaints to get updated worker_id
                const endpoint = userRole === 'Admin' ? "/complaints" : `/complaints/user/${userId}`;
                const refreshResponse = await API.get(endpoint);
                setComplaints(refreshResponse.data || []);
            }
        } catch (error) {
            console.error("Error assigning worker:", error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="complaints">
            <h1>Complaints Page</h1>

            {userRole === 'User' && (
                <>
                    <div className="section-header">
                        <button className="add-button" onClick={() => setComplaintFormVisible(!isComplaintFormVisible)}>
                            + Lodge a Complaint
                        </button>
                    </div>

                    {isComplaintFormVisible && (
                        <form className="complaint-form" onSubmit={handleComplaintSubmit}>
                            <input 
                                type="text" 
                                placeholder="Description" 
                                value={newComplaint.description} 
                                onChange={(e) => setNewComplaint({ description: e.target.value })} 
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}

                    <table className="complaints-table">
                        <thead>
                            <tr>
                                <th>Complaint ID</th>
                                <th>Location</th>
                                <th>Description</th>
                                <th>Date Submitted</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map((complaint) => (
                                <tr key={complaint.complaint_id}>
                                    <td>{complaint.complaint_id}</td>
                                    <td>{complaint.address}</td>
                                    <td>{complaint.description}</td>
                                    <td>{new Date(complaint.submitted_at).toLocaleString('en-GB')}</td>
                                    <td>{complaint.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {userRole === 'Admin' && (
                <table className="complaints-table">
                    <thead>
                        <tr>
                            <th>Complaint ID</th>
                            <th>Description</th>
                            <th>Date Submitted</th>
                            <th>Status</th>
                            <th>User ID</th>
                            <th>Location ID</th>
                            <th>Assigned To</th>
                            <th>Worker ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint) => (
                            <tr key={complaint.complaint_id}>
                                <td>{complaint.complaint_id}</td>
                                <td>{complaint.description}</td>
                                <td>{new Date(complaint.submitted_at).toLocaleString('en-GB')}</td>
                                <td>{complaint.status}</td>
                                <td>{complaint.user_id}</td>
                                <td>{complaint.location_id}</td>
                                <td>
                                    {complaint.assigned_to ? (
                                        complaint.assigned_to
                                    ) : (
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                const selectedWorker = workers.find(w => w.name === e.target.value);
                                                if (selectedWorker) {
                                                    handleAssignWorker(complaint.complaint_id, selectedWorker);
                                                }
                                            }}
                                        >
                                            <option key="default-select" value="">Select Worker</option>
                                            {workers.map((worker) => (
                                                <option key={`worker-${worker.user_id}`} value={worker.name}>
                                                    {worker.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                                <td>{complaint.worker_id || 'Not assigned'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Complaints;