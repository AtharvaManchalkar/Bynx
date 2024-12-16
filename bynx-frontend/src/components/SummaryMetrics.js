import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SummaryMetrics.css';

const SummaryMetrics = () => {
    const [metrics, setMetrics] = useState({
        totalBins: 0,
        filledBins: 0,
        pendingComplaints: 0,
        scheduledCollections: 0,
        availableVehicles: 0,
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await axios.get('http://localhost:8000/summary-metrics');
                setMetrics(response.data.data);
            } catch (error) {
                console.error('Error fetching summary metrics:', error);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="summary-metrics">
            <h1>Summary Metrics</h1>
            <div className="metrics-container">
                <div className="metric">
                    <h3>Total Bins:</h3>
                    <p>{metrics.totalBins}</p>
                </div>
                <div className="metric">
                    <h3>Filled Bins:</h3>
                    <p>{metrics.filledBins}</p>
                </div>
                <div className="metric">
                    <h3>Pending Complaints:</h3>
                    <p>{metrics.pendingComplaints}</p>
                </div>
                <div className="metric">
                    <h3>Scheduled Collections:</h3>
                    <p>{metrics.scheduledCollections}</p>
                </div>
                <div className="metric">
                    <h3>Available Vehicles:</h3>
                    <p>{metrics.availableVehicles}</p>
                </div>
            </div>
        </div>
    );
};

export default SummaryMetrics;