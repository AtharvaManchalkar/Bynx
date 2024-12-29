import React, { useState, useEffect } from 'react';
import './Complaints.css';
import API from "../api/axios";

const ComplaintCard = ({ complaint, workers, handleAssignWorker, userRole }) => {
    const formatDate = (date) => new Date(date).toLocaleString('en-GB');
    
    return (
        <div className="complaint-card">
            <div className="complaint-header">
                <span className="complaint-id">#{complaint.complaint_id}</span>
                <span className={`complaint-status status-${complaint.status.toLowerCase()}`}>
                    {complaint.status}
                </span>
            </div>
            <div className="complaint-body">
                <p className="complaint-description">{complaint.description}</p>
                <div className="complaint-meta">
                    <div>Submitted: {formatDate(complaint.submitted_at)}</div>
                    {complaint.address && <div>Location: {complaint.address}</div>}
                </div>
            </div>
            {userRole === 'Admin' && (
                <div className="complaint-footer">
                    {complaint.assigned_to ? (
                        <div>Assigned to: {complaint.assigned_to}</div>
                    ) : (
                        <select
                            className="worker-select"
                            value=""
                            onChange={(e) => {
                                const selectedWorker = workers.find(w => w.name === e.target.value);
                                if (selectedWorker) {
                                    handleAssignWorker(complaint.complaint_id, selectedWorker);
                                }
                            }}
                        >
                            <option value="">Assign Worker</option>
                            {workers.map((worker) => (
                                <option key={worker.user_id} value={worker.name}>
                                    {worker.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}
        </div>
    );
};

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
        setError('');

        const complaintData = {
            user_id: userId,
            description: newComplaint.description,
            status: "Pending"
        };

        try {
            const response = await API.post("/complaints", complaintData);
            const endpoint = `/complaints/user/${userId}`;
            const refreshResponse = await API.get(endpoint);
            setComplaints(refreshResponse.data || []);
            setNewComplaint({ description: '' });
            setComplaintFormVisible(false);
        } catch (error) {
            console.error("Error adding complaint:", error);
            setError('Failed to add complaint: ' + (error.response?.data?.detail || 'Unknown error'));
            setTimeout(() => setError(null), 3000);
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
                const endpoint = userRole === 'Admin' ? "/complaints" : `/complaints/user/${userId}`;
                const refreshResponse = await API.get(endpoint);
                setComplaints(refreshResponse.data || []);
            }
        } catch (error) {
            console.error("Error assigning worker:", error);
            setError('Failed to assign worker: ' + (error.response?.data?.detail || 'Unknown error'));
            setTimeout(() => setError(null), 3000);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="complaints">
            <h1>Complaints</h1>

            {userRole === 'User' && (
                <div className="user-section">
                    <button className="add-button" onClick={() => setComplaintFormVisible(!isComplaintFormVisible)}>
                        + Lodge a Complaint
                    </button>

                    {isComplaintFormVisible && (
                        <form className="complaint-form" onSubmit={handleComplaintSubmit}>
                            <input 
                                type="text" 
                                placeholder="Description" 
                                value={newComplaint.description} 
                                onChange={(e) => setNewComplaint({ description: e.target.value })} 
                                required
                            />
                            <button type="submit" className="add-button">Submit</button>
                        </form>
                    )}
                </div>
            )}

            <div className="complaints-grid">
                {complaints.map((complaint) => (
                    <ComplaintCard
                        key={complaint.complaint_id}
                        complaint={complaint}
                        workers={workers}
                        handleAssignWorker={handleAssignWorker}
                        userRole={userRole}
                    />
                ))}
            </div>
        </div>
    );
};

export default Complaints;