import React, { useEffect, useState } from "react";
import API from "../api/axios";
import "./Tasks.css";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const workerId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login

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
        } else {
            console.error("Worker ID is null or undefined");
        }
    }, [workerId]);

    const markTaskCompleted = async (taskId) => {
        try {
            await API.put(`/tasks/${taskId}`, { status: "completed" });
            alert("Task marked as completed!");
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, status: "completed" } : task
                )
            );
        } catch (error) {
            alert("Failed to update task!");
        }
    };

    return (
        <div className="tasks">
            <h1>Tasks Page</h1>
            <table className="tasks-table">
                <thead>
                    <tr>
                        <th>Complaint ID</th>
                        <th>Location</th>
                        <th>Description</th>
                        <th>Assigned At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.complaint_id}</td>
                            <td>{task.location}</td>
                            <td>{task.description}</td>
                            <td>{new Date(task.assigned_at).toLocaleString('en-GB')}</td>
                            <td>
                                {task.status !== "completed" ? (
                                    <button
                                        className="mark-completed-button"
                                        onClick={() => markTaskCompleted(task.id)}
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

export default Tasks;