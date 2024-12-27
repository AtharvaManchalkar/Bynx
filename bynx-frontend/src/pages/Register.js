import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from "../api/axios";
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'User'
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
            const response = await API.post('/register', {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });
            
            if (response.data.success) {
                navigate('/login');
            } else {
                setError(response.data.message || 'Registration failed');
            }
        } catch (error) {
            setError(error.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="login">
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
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
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Worker">Worker</option>
                    </select>
                    <button type="submit">Register</button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="login-message">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;