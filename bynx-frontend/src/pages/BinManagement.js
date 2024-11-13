import React, { useState } from 'react';
import './BinManagement.css';

const BinManagement = () => {
    const [filter, setFilter] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [bins, setBins] = useState([
        // Example bin data - this would be replaced with actual data from the database
        { id: 1, location: 'Central Park', fillLevel: 95, lastEmptied: '12-11-2024', type: 'recyclable' },
        { id: 2, location: 'Downtown', fillLevel: 65, lastEmptied: '10-11-2024', type: 'non-recyclable' },
        { id: 3, location: 'Uptown', fillLevel: 45, lastEmptied: '11-11-2024', type: 'recyclable' },
    ]);

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

    const updateStatus = (index) => {
        const updatedBins = [...bins];
        updatedBins[index].statusUpdated = true;
        setBins(updatedBins);
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
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>
            
            <h2>Bin Table</h2>
            <table className="bin-table">
                <thead>
                    <tr>
                        <th>BinID</th>
                        <th>Location</th>
                        <th>Fill Level</th>
                        <th>Last Emptied</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bins.map((bin, index) => (
                        <tr key={bin.id}>
                            <td>{bin.id}</td> {/* New BinID column */}
                            <td>{bin.location}</td>
                            <td>
                                <div className={`fill-level ${bin.fillLevel > 90 ? 'red' : bin.fillLevel > 50 ? 'yellow' : 'green'}`}>
                                    {bin.fillLevel}%
                                </div>
                            </td>
                            <td>{bin.lastEmptied}</td>
                            <td>{bin.type}</td>
                            <td>
                                <button 
                                    className={bin.statusUpdated ? "status-updated" : "update-status"} 
                                    onClick={() => updateStatus(index)}
                                >
                                    {bin.statusUpdated ? "Status Updated" : "Update Status"}
                                </button>
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
                    <option value="fillLevel">Fill Level</option>
                    <option value="lastEmptied">Last Emptied</option>
                </select>
            </div>
        </div>
    );
};

export default BinManagement;
