import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Tasks.css";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const workerId = parseInt(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await API.get(`/tasks/worker/${workerId}`);
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        if (workerId) {
            fetchTasks();
        }
    }, [workerId]);

    const handleResolveTask = async (complaintId) => {
        try {
            await API.put(`/tasks/${complaintId}/resolve`);
            setTasks(prev =>
                prev.map(task =>
                    task.complaint_id === complaintId
                        ? { ...task, status: "Resolved" }
                        : task
                )
            );
        } catch (error) {
            console.error("Error resolving task:", error);
        }
    };

    return (
        <div className="tasks">
            <h1>Assigned Tasks</h1>
            <table className="tasks-table">
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        <th>Location</th>
                        <th>Description</th>
                        <th>Date Assigned</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.complaint_id}>
                            <td>{task.complaint_id}</td>
                            <td>{task.address}</td>
                            <td>{task.description}</td>
                            <td>{new Date(task.submitted_at).toLocaleString('en-GB')}</td>
                            <td>{task.status}</td>
                            <td>
                                {task.status !== "Resolved" ? (
                                    <button
                                        className="resolve-button"
                                        onClick={() => handleResolveTask(task.complaint_id)}
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

export default Tasks;