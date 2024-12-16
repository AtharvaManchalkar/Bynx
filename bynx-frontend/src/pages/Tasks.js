import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Tasks = () => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await API.get("/tasks/");
                setTasks(response.data);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, []);

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
        <div>
            <h2>Tasks</h2>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        <p>{task.description}</p>
                        <p>Status: {task.status}</p>
                        {task.status !== "completed" && (
                            <button onClick={() => markTaskCompleted(task.id)}>
                                Mark Completed
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Tasks;