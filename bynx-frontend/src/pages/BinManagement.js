import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BinManagement.css';
import API from "../api/axios";

const BinManagement = () => {
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [bins, setBins] = useState([]);
    const [filteredBins, setFilteredBins] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [isDamaged, setIsDamaged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBins = async () => {
            try {
                const response = await API.get("/bins");
                if (response.data) {
                    setBins(response.data);
                    setFilteredBins(response.data);
                }
            } catch (error) {
                console.error("Error fetching bins:", error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchBins();
    }, [navigate]);

    useEffect(() => {
        let updatedBins = [...bins];

        if (filter) {
            updatedBins = updatedBins.filter(bin => 
                bin.status.toLowerCase() === filter.toLowerCase()
            );
        }

        if (searchQuery) {
            updatedBins = updatedBins.filter(bin =>
                bin.location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bin.bin_id.toString().includes(searchQuery)
            );
        }

        if (sortBy) {
            updatedBins.sort((a, b) => {
                switch(sortBy) {
                    case 'location':
                        return a.location.name.localeCompare(b.location.name);
                    case 'current_level':
                        return b.current_level - a.current_level;
                    case 'last_emptied':
                        return new Date(b.last_emptied || 0) - new Date(a.last_emptied || 0);
                    default:
                        return 0;
                }
            });
        }

        setFilteredBins(updatedBins);
    }, [filter, searchQuery, sortBy, bins]);

    const handleUpdateStatusClick = (index) => {
        setEditingIndex(index);
        setCurrentLevel(filteredBins[index].current_level);
        setIsDamaged(filteredBins[index].status === 'Damaged');
    };

    const handleFinishClick = async (index) => {
        try {
            const bin = filteredBins[index];
            const updatedLevel = parseInt(currentLevel);
            const updateData = {
                current_level: updatedLevel,
                last_emptied: new Date().toISOString()
            };

            await API.put(`/bins/${bin.bin_id}`, updateData);

            const updatedBins = [...bins];
            const binIndex = updatedBins.findIndex(b => b.bin_id === bin.bin_id);
            if (binIndex !== -1) {
                updatedBins[binIndex] = {
                    ...bin,
                    current_level: updatedLevel,
                    status: isDamaged ? 'Damaged' : 
                            updatedLevel === 0 ? 'Empty' : 
                            updatedLevel > 75 ? 'Full' : 'Partially Full',
                    last_emptied: new Date().toISOString()
                };
                setBins(updatedBins);
            }
            setEditingIndex(null);
        } catch (error) {
            console.error("Error updating bin:", error);
        }
    };

    return (
        <div className="bin-management">
            <h1>Bin Management</h1>
            
            <div className="top-section">
                <input 
                    type="text" 
                    placeholder="Search by Location or BinID" 
                    className="search-bar" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(e.target.value)}
                />
                
                <div className="filter-container">
                    <span>Filter by: </span>
                    <select 
                        className="filter-dropdown" 
                        onChange={(e) => setFilter(e.target.value)} 
                        value={filter}
                    >
                        <option value="">All</option>
                        <option value="full">Full</option>
                        <option value="partially full">Partially Full</option>
                        <option value="empty">Empty</option>
                        <option value="damaged">Damaged</option>
                    </select>
                </div>
            </div>
            
            <table className="bin-table">
                <thead>
                    <tr>
                        <th>BinID</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Current Level</th>
                        <th>Status</th>
                        <th>Last Emptied</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBins.map((bin, index) => (
                        <tr key={bin.bin_id}>
                            <td>{bin.bin_id}</td>
                            <td>{bin.location.name}</td>
                            <td>{bin.type}</td>
                            <td>
                                <div className={`fill-level ${
                                    bin.current_level > 75 ? 'red' : 
                                    bin.current_level > 50 ? 'yellow' : 'green'
                                }`}>
                                    {editingIndex === index ? (
                                        <>
                                            {currentLevel}%
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentLevel}
                                                onChange={(e) => setCurrentLevel(e.target.value)}
                                                className="slider"
                                            />
                                        </>
                                    ) : `${bin.current_level}%`}
                                </div>
                            </td>
                            <td>{bin.status}</td>
                            <td>
                                {bin.last_emptied ? 
                                    new Date(bin.last_emptied).toLocaleString('en-GB') : 
                                    'Never'}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <button 
                                        className="finish-button"
                                        onClick={() => handleFinishClick(index)}
                                    >
                                        Finish
                                    </button>
                                ) : (
                                    <button 
                                        className="update-status"
                                        onClick={() => handleUpdateStatusClick(index)}
                                    >
                                        Update Status
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="sort-container">
                <span>Sort By: </span>
                <select 
                    className="sort-dropdown" 
                    onChange={(e) => setSortBy(e.target.value)} 
                    value={sortBy}
                >
                    <option value="">Select</option>
                    <option value="location">Location</option>
                    <option value="current_level">Current Level</option>
                    <option value="last_emptied">Last Emptied</option>
                </select>
            </div>
        </div>
    );
};

export default BinManagement;