import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const fetchBins = async () => {
            try {
                const response = await API.get("/bins");
                setBins(response.data.data);
                setFilteredBins(response.data.data);
            } catch (error) {
                console.error("Error fetching bins:", error);
            }
        };

        fetchBins();
    }, []);

    useEffect(() => {
        let updatedBins = [...bins];

        // Filter by status
        if (filter) {
            updatedBins = updatedBins.filter(bin => bin.status.toLowerCase() === filter.toLowerCase());
        }

        // Search by location or bin_id
        if (searchQuery) {
            updatedBins = updatedBins.filter(bin =>
                bin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                bin.bin_id.toString().includes(searchQuery)
            );
        }

        // Sort by selected criteria
        if (sortBy) {
            updatedBins.sort((a, b) => {
                if (sortBy === 'location') {
                    return a.location.localeCompare(b.location);
                } else if (sortBy === 'capacity') {
                    return a.capacity - b.capacity;
                } else if (sortBy === 'current_level') {
                    return a.current_level - b.current_level;
                } else if (sortBy === 'last_collected') {
                    return new Date(a.last_collected) - new Date(b.last_collected);
                }
                return 0;
            });
        }

        setFilteredBins(updatedBins);
    }, [filter, searchQuery, sortBy, bins]);

    const handleFilterChange = (e) => setFilter(e.target.value);
    const handleSortChange = (e) => setSortBy(e.target.value);
    const handleSearchChange = (e) => setSearchQuery(e.target.value);
    const handleSearchClick = () => {
        // Perform search logic here based on searchQuery and filter
        console.log("Searching for:", searchQuery, "with filter:", filter);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    const handleUpdateStatusClick = (index) => {
        setEditingIndex(index);
        setCurrentLevel(filteredBins[index].current_level);
        setIsDamaged(filteredBins[index].status === 'Damaged');
    };

    const handleFinishClick = async (index) => {
        const updatedBins = [...filteredBins];
        const bin = updatedBins[index];
        bin.current_level = currentLevel;
        bin.status = isDamaged ? 'Damaged' : currentLevel === 0 ? 'Empty' : currentLevel > 75 ? 'Full' : 'Partially Full';
        bin.last_collected = new Date().toISOString().slice(0, 19);
        setFilteredBins(updatedBins);
        setEditingIndex(null);

        try {
            await API.put(`/bins/${bin.bin_id}`, {
                location: bin.location,
                capacity: bin.capacity,
                current_level: bin.current_level,
                status: bin.status,
                last_collected: bin.last_collected
            });
        } catch (error) {
            console.error("Error updating bin status:", error);
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
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown} // Handles Enter key press
                />
                <button className="search-button" onClick={handleSearchClick}>Search</button>
                <div className="filter-container">
                    <span>Filter by: </span>
                    <select className="filter-dropdown" onChange={handleFilterChange} value={filter}>
                        <option value="">All</option>
                        <option value="full">Full</option>
                        <option value="partially full">Partially Full</option>
                        <option value="empty">Empty</option>
                        <option value="damaged">Damaged</option>
                    </select>
                </div>
            </div>
            
            <h2>Bin Table</h2>
            <table className="bin-table">
                <thead>
                    <tr>
                        <th>BinID</th>
                        <th>Location</th>
                        <th>Capacity</th>
                        <th>Current Level</th>
                        <th>Status</th>
                        <th>Last Collected</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(filteredBins) && filteredBins.map((bin, index) => (
                        <tr key={bin.bin_id} className={searchQuery && (bin.location.toLowerCase().includes(searchQuery.toLowerCase()) || bin.bin_id.toString().includes(searchQuery)) ? 'highlight' : ''}>
                            <td>{bin.bin_id}</td>
                            <td>{bin.location}</td>
                            <td>{bin.capacity}</td>
                            <td>
                                <div className={`fill-level ${editingIndex === index ? (currentLevel > 75 ? 'red' : currentLevel > 50 ? 'yellow' : 'green') : (bin.current_level > 75 ? 'red' : bin.current_level > 50 ? 'yellow' : 'green')}`}>
                                    {editingIndex === index ? `${currentLevel}%` : `${bin.current_level}%`}
                                </div>
                                {editingIndex === index && (
                                    <input
                                        type="range"
                                        min="0"
                                        max={bin.capacity}
                                        value={currentLevel}
                                        onChange={(e) => setCurrentLevel(e.target.value)}
                                        className="slider"
                                    />
                                )}
                            </td>
                            <td>
                                {editingIndex === index ? (
                                    <>
                                        <span>{isDamaged ? 'Damaged' : currentLevel === 0 ? 'Empty' : currentLevel > 75 ? 'Full' : 'Partially Full'}</span>
                                        <label className="status-label">
                                            <input
                                                type="checkbox"
                                                checked={isDamaged}
                                                onChange={(e) => setIsDamaged(e.target.checked)}
                                            />
                                            isDamaged?
                                        </label>
                                    </>
                                ) : (
                                    bin.status
                                )}
                            </td>
                            <td>{bin.last_collected}</td>
                            <td>
                                {editingIndex === index ? (
                                    <button className="finish-button" onClick={() => handleFinishClick(index)}>Finish</button>
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
                <select className="sort-dropdown" onChange={handleSortChange} value={sortBy}>
                    <option value="">Select</option>
                    <option value="location">Location</option>
                    <option value="capacity">Capacity</option>
                    <option value="current_level">Current Level</option>
                    <option value="last_collected">Last Collected</option>
                </select>
            </div>
        </div>
    );
};

export default BinManagement;