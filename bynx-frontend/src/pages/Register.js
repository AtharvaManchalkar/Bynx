import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from "../api/axios";
import './Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post('/register', { name: username, email, password, role });
            if (response.data.success) {
                navigate('/login');
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="login">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
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
                <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="Worker">Worker</option>
                </select>
                <button type="submit">Register</button>
            </form>
            <p className="login-message">Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default Register;