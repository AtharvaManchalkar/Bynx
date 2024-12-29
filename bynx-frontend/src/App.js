import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeDashboard from "./pages/HomeDashboard";
import BinManagement from "./pages/BinManagement";
import CollectionRoutes from "./pages/CollectionRoutes";
import Reports from "./pages/Reports";
import Complaints from "./pages/Complaints";
import Maintenance from "./pages/Maintenance";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import NotFound from "./pages/NotFound";
import "./App.css";

const App = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const savedTheme = localStorage.getItem('theme') || 'light';
        setIsAuthenticated(!!token);
        setUserRole(role);
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    return (
        <div>
            <Router>
                <div className="App">
                    <Navbar toggleTheme={toggleTheme} />
                    <main>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" 
                                element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to="/home" />} 
                            />
                            <Route path="/login" 
                                element={isAuthenticated ? <Navigate to="/home" /> : <Login />} 
                            />
                            <Route path="/register" 
                                element={isAuthenticated ? <Navigate to="/home" /> : <Register />} 
                            />

                            {/* Protected Routes */}
                            <Route path="/home" 
                                element={!isAuthenticated ? <Navigate to="/login" /> : <HomeDashboard />} 
                            />

                            <Route path="/bin-management" 
                                element={
                                    !isAuthenticated ? <Navigate to="/login" /> :
                                    !['Admin', 'Worker'].includes(userRole) ? <Navigate to="/unauthorized" /> :
                                    <BinManagement />
                                } 
                            />

                            <Route path="/collection-routes" 
                                element={
                                    !isAuthenticated ? <Navigate to="/login" /> :
                                    !['Admin', 'Worker', 'User'].includes(userRole) ? <Navigate to="/unauthorized" /> :
                                    <CollectionRoutes />
                                } 
                            />

                            <Route path="/reports" 
                                element={
                                    !isAuthenticated ? <Navigate to="/login" /> :
                                    <Reports />
                                } 
                            />

                            <Route path="/complaints" 
                                element={
                                    !isAuthenticated ? <Navigate to="/login" /> :
                                    !['Admin', 'User'].includes(userRole) ? <Navigate to="/unauthorized" /> :
                                    <Complaints />
                                } 
                            />

                            <Route path="/maintenance" 
                                element={
                                    !isAuthenticated ? <Navigate to="/login" /> :
                                    !['Admin', 'Worker'].includes(userRole) ? <Navigate to="/unauthorized" /> :
                                    <Maintenance />
                                } 
                            />

                            <Route path="/tasks" 
                                element={
                                    !isAuthenticated ? <Navigate to="/login" /> :
                                    userRole !== 'Worker' ? <Navigate to="/unauthorized" /> :
                                    <Tasks />
                                } 
                            />

                            {/* Error Routes */}
                            <Route path="/unauthorized" 
                                element={
                                    <div className="error-page">
                                        <h1>Unauthorized Access</h1>
                                        <p>You don't have permission to access this page.</p>
                                    </div>
                                } 
                            />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </div>
    );
};

export default App;