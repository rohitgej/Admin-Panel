import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import "../styles/Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/viewuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.user) {
          setCustomers([data.user]);
        } else if (data.users) {
          setCustomers(data.users);
        } else {
          throw new Error('Unexpected API response');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const filteredData = customers.filter((customer) => {
      return (
        (customer.user_id && customer.user_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.mobile_no && customer.mobile_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email_id && customer.email_id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });

    setFilteredCustomers(filteredData);
  }, [searchTerm, customers]);

  const columns = [
    {
      name: 'User ID',
      selector: (row) => row.user_id || 'N/A',
      sortable: true,
    },
    {
      name: 'Mobile Number',
      selector: (row) => row.mobile_no || 'N/A',
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name || 'N/A',
      sortable: true,
    },
    {
      name: 'Emails',
      selector: (row) => row.email_id || 'N/A',
      sortable: true,
    },
    {
      name: 'Addresses',
      cell: (row) => (
        <div>
          {row.addresses ? (
            row.addresses.map((address, index) => (
              <div key={index}>
                {address.house_no} {address.block_no}, {address.address}
              </div>
            ))
          ) : (
            <div>N/A</div>
          )}
        </div>
      ),
    },
    {
      name: 'Profile Image',
      cell: (row) => (
        <img
          src={row.profileImage || 'default_image_url'}
          alt="Profile"
          className="profile-image"
        />
      ),
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="customer-page">
      <h1>Customers</h1>

      <input
        type="text"
        placeholder="Search by User ID or other fields"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
      />

      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredCustomers}
          pagination
          highlightOnHover
        />
      </div>
    </div>
  );
};

export default Customers;
