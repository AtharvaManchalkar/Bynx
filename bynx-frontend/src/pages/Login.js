import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./Login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            // Remove /api prefix since it's already in axios baseURL
            const response = await API.post('/login', {
                email: formData.email,
                password: formData.password
            });
            
            if (response.data.success) {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('userId', response.data.userId);
                navigate('/home');
                window.location.reload();
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="login-message">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;