import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import './Reports.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,  // Add BarElement
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,  // Register BarElement here
    Title,
    Tooltip,
    Legend
);

const Reports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleFilterApply = () => {
        alert(`Applying filter from ${startDate} to ${endDate}`);
        // Placeholder for filter logic to retrieve data based on dates
    };

    const lineChartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Example x-axis labels
        datasets: [
            {
                label: 'Total Waste Collected (kg)',
                data: [120, 190, 300, 500, 200, 300], // Example data
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    };

    const barChartData = {
        labels: ['Bin 1', 'Bin 2', 'Bin 3', 'Bin 4'], // Example x-axis labels
        datasets: [
            {
                label: 'Bin Level (%)',
                data: [80, 55, 65, 90], // Example data
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    return (
        <div className="reports-page">
            <h1>Reports</h1>

            <div className="filter-section">
                <label>Filter:</label>
                <input 
                    type="text" 
                    placeholder="Start date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="date-input" 
                />
                <input 
                    type="text" 
                    placeholder="End date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="date-input" 
                />
                <button onClick={handleFilterApply} className="apply-filter-btn">Apply Filter</button>
            </div>

            <div className="graphs-section">
                <div className="graph">
                    <h2>Total Waste Collected Over Time</h2>
                    <Line data={lineChartData} options={{ responsive: true }} />
                </div>
                <div className="graph">
                    <h2>Bin Level Trends</h2>
                    <Bar data={barChartData} options={{ responsive: true }} />
                </div>
            </div>

            <div className="summary-cards">
                <div className="card">Most Filled Bin: <span>Bin 4</span></div>
                <div className="card">Average Waste Collected: <span>350 kg</span></div>
                <div className="card">Top Collection Location: <span>Central Park</span></div>
            </div>

            <div className="export-buttons">
                <button className="export-btn csv">Export Data (.csv file)</button>
                <button className="export-btn pdf">Export Data (.pdf file)</button>
            </div>
        </div>
    );
};

export default Reports;
