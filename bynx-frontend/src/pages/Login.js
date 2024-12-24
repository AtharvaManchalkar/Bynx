import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/login', { email, password });
            if (response.data.success) {
                const { role } = response.data;
                localStorage.setItem('userRole', role);
                if (role === 'User') {
                    navigate('/home');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p className="login-message">Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;