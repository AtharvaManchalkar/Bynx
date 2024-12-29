import React, { useState, useEffect } from 'react';
import API from "../api/axios";
import './Tasks.css';

const TaskCard = ({ task, onResolve }) => {
    const formatDate = (date) => new Date(date).toLocaleString('en-GB');
    
    return (
        <div className="task-card">
            <div className="task-header">
                <span className="task-id">Task #{task.complaint_id}</span>
                <span className={`task-status status-${task.status?.toLowerCase()}`}>
                    {task.status}
                </span>
            </div>
            <div className="task-body">
                <p className="task-description">{task.description}</p>
                <div className="task-meta">
                    <div>Location: {task.address}</div>
                    <div>Assigned: {formatDate(task.submitted_at)}</div>
                </div>
            </div>
            <div className="task-footer">
                {task.status !== "Resolved" && (
                    <button 
                        className="resolve-button"
                        onClick={() => onResolve(task.complaint_id)}
                    >
                        Mark as Resolved
                    </button>
                )}
            </div>
        </div>
    );
};

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const workerId = parseInt(localStorage.getItem('userId'));

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await API.get(`/tasks/worker/${workerId}`);
                setTasks(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setError('Failed to fetch tasks');
                setIsLoading(false);
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
            setError('Failed to resolve task');
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="tasks">
            <h1>Assigned Tasks</h1>
            <div className="tasks-grid">
                {tasks.map((task) => (
                    <TaskCard 
                        key={task.complaint_id} 
                        task={task} 
                        onResolve={handleResolveTask}
                    />
                ))}
            </div>
        </div>
    );
};

export default Tasks;