import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import "../styles/DeliveryPartner.css";

const DeliveryPartner = () => {
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDeliveryPartners = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/view-runners', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({}), // Empty body to fetch all runners
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                console.log('Fetched data:', data); // Log the fetched data

                if (data.runners && Array.isArray(data.runners)) {
                    setDeliveryPartners(data.runners);
                    setFilteredPartners(data.runners);
                } else {
                    throw new Error('Invalid response structure');
                }
            } catch (error) {
                console.error('Error fetching delivery partners:', error);
                setError(error.message);
            }
        };

        fetchDeliveryPartners();
    }, []);

    useEffect(() => {
        // Filter data based on search term
        const filteredData = deliveryPartners.filter(partner =>
            partner.runner_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.runner_mobile_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.runner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            partner.runner_email_id.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPartners(filteredData);
    }, [searchTerm, deliveryPartners]);

    // Define columns for the Data Table
    const columns = [
        {
            name: 'Runner ID',
            selector: row => row.runner_id,
            sortable: true,
        },
        {
            name: 'Mobile Number',
            selector: row => row.runner_mobile_no,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.runner_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.runner_email_id,
            sortable: true,
        },
    ];

    return (
        <div className="delivery-partner-page">
            <h1>Delivery Partners</h1>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <input
                type="text"
                placeholder="Search by Runner ID or other fields"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
            />
            <div className="table-container">
                <DataTable
                    columns={columns}
                    data={filteredPartners}
                    pagination
                    highlightOnHover
                    striped
                />
            </div>
        </div>
    );
};

export default DeliveryPartner;
