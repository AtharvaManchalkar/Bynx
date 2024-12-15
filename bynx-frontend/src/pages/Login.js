import React, { useState } from "react";
import API from "../api/axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/users/login", { email, password });
            localStorage.setItem("authToken", response.data.user_id); // Store the user token
            alert("Login successful!");
            window.location.href = "/dashboard"; // Redirect to the dashboard
        } catch (error) {
            alert(error.response?.data?.detail || "Login failed!");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
