import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { applyTheme } from "./components/theme";
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

const PrivateRoute = ({ children, roles }) => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
        return <Navigate to="/login" />;
    }
    if (roles && !roles.includes(userRole)) {
        return <Navigate to="/home" />;
    }
    return children;
};

const App = () => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        applyTheme(theme + '-theme');
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme + '-theme');
    };

    const userRole = localStorage.getItem('userRole');

    return (
        <div className={theme + '-theme'}>
            <Router>
                <div>
                    {userRole && window.location.pathname !== '/login' && window.location.pathname !== '/register' && <Navbar toggleTheme={toggleTheme} />}
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/home" element={<PrivateRoute roles={['Admin', 'Worker', 'User']}><HomeDashboard /></PrivateRoute>} />
                        <Route path="/reports" element={<PrivateRoute roles={['Admin', 'Worker', 'User']}><Reports /></PrivateRoute>} />
                        <Route path="/complaints" element={<PrivateRoute roles={['Admin', 'Worker', 'User']}><Complaints /></PrivateRoute>} />
                        <Route path="/maintenance" element={<PrivateRoute roles={['Admin', 'Worker']}><Maintenance /></PrivateRoute>} />
                        <Route path="/tasks" element={<PrivateRoute roles={['Admin', 'Worker']}><Tasks /></PrivateRoute>} />
                        <Route path="/bin-management" element={<PrivateRoute roles={['Admin', 'Worker']}><BinManagement /></PrivateRoute>} />
                        <Route path="/collection-routes" element={<PrivateRoute roles={['Admin', 'Worker']}><CollectionRoutes /></PrivateRoute>} />
                        <Route path="/dashboard" element={<PrivateRoute roles={['Admin', 'Worker']}><HomeDashboard /></PrivateRoute>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;