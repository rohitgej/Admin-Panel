import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const Complain = () => {
    const [complaints, setComplaints] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/viewsupports');
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        const formattedData = data.map(complaint => {
                            let createdAt = '';
                            if (complaint.created_at) {
                                if (complaint.created_at.$date) {
                                    createdAt = new Date(complaint.created_at.$date).toISOString().split('T')[0];
                                } else {
                                    createdAt = new Date(complaint.created_at).toISOString().split('T')[0];
                                }
                            }
                            return {
                                support_id: complaint.support_id,
                                customerName: complaint.email_id,
                                orderId: complaint.order_id || '',
                                subject: complaint.subject,
                                email: complaint.email_id,
                                date: createdAt,
                                status: complaint.status,
                                complain: complaint.message
                            };
                        });
                        setComplaints(formattedData);
                    } else {
                        console.error('Unexpected response data:', data);
                    }
                } else {
                    console.error('Error fetching complaints:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };

        fetchComplaints();
    }, []);

    const handleStatusChange = async (support_id, newStatus) => {
        try {
            const response = await fetch('http://localhost:3000/api/update-supportstatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ support_id, status: newStatus }),
            });

            if (response.ok) {
                const result = await response.json();
                const updatedComplaints = complaints.map(complaint =>
                    complaint.support_id === support_id ? { ...complaint, status: newStatus } : complaint
                );
                setComplaints(updatedComplaints);
            } else {
                console.error('Error updating status:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const columns = [
        {
            name: 'Support ID',
            selector: row => row.support_id,
            sortable: true,
        },
        {
            name: 'Customer Name',
            selector: row => row.customerName,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Order ID',
            selector: row => row.orderId,
            sortable: true,
        },
        {
            name: 'Subject',
            selector: row => row.subject,
            sortable: true,
        },
        {
            name: 'Complain',
            selector: row => row.complain,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(row.support_id, e.target.value)}
                >
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            ),
        },
    ];

    const filteredComplaints = complaints.filter(complaint =>
        complaint.support_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.complain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: '20px',backgroundColor:"white" }}>
            <h2>Customer Complaints</h2>

            <input
                type="text"
                placeholder="Search by Support ID or other fields"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
            />

            <DataTable
                columns={columns}
                data={filteredComplaints}
                pagination
                highlightOnHover
                pointerOnHover
            />
        </div>
    );
};

export default Complain;
