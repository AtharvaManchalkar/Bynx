import React, { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import './Reports.css';
import API from "../api/axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Reports = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [wasteData, setWasteData] = useState([]);
    const [binData, setBinData] = useState([]);

    const startDateRef = useRef(null);
    const endDateRef = useRef(null);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async (start_date = null, end_date = null) => {
        try {
            const params = {};
            if (start_date) params.start_date = start_date;
            if (end_date) params.end_date = end_date;
            const response = await API.get('/report-data', { params });
            setWasteData(response.data.waste_data);
            setBinData(response.data.bin_data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    const handleFilterApply = () => {
        fetchReportData(startDate ? startDate.toISOString().split('T')[0] : null, endDate ? endDate.toISOString().split('T')[0] : null);
    };

    const lineChartData = {
        labels: wasteData.map(data => data.date),
        datasets: [
            {
                label: 'Total Waste Collected (kg)',
                data: wasteData.map(data => data.total_waste),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            },
        ],
    };

    const barChartData = {
        labels: binData.map(data => data.location),
        datasets: [
            {
                label: 'Bin Level (%)',
                data: binData.map(data => data.current_level),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            },
        ],
    };

    return (
        <div className="reports-page">
            <h1>Reports</h1>

            <div className="filter-section">
                <label>Filter:</label>
                <div className="date-picker-wrapper">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Start date"
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="date-input"
                        ref={startDateRef}
                    />
                    <span className="calendar-icon" onClick={() => startDateRef.current.setFocus()}>&#x1F4C5;</span>
                </div>
                <div className="date-picker-wrapper">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="End date"
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="date-input"
                        ref={endDateRef}
                    />
                    <span className="calendar-icon" onClick={() => endDateRef.current.setFocus()}>&#x1F4C5;</span>
                </div>
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