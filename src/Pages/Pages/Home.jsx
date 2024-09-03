import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';
import "../styles/Home.css";

const Home = () => {
  const [chartData, setChartData] = useState([]);
  const [monthlyReport, setMonthlyReport] = useState({ totalOrders: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const raw = "";

      const requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow"
      };

      try {
        const response = await fetch("http://localhost:3000/api/getcheckout", requestOptions);
        const result = await response.json();
        const orders = result.orders;

        // Process data to get revenue and order counts per day
        const aggregatedData = orders.reduce((acc, order) => {
          const orderDate = new Date(order.order_date).toLocaleDateString('en-US');
          if (!acc[orderDate]) {
            acc[orderDate] = { date: orderDate, revenue: 0, orders: 0 };
          }
          acc[orderDate].revenue += order.total;
          acc[orderDate].orders += 1; // Increment the order count
          return acc;
        }, {});

        // Convert aggregated data into an array and sort by date
        const formattedData = Object.values(aggregatedData).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Calculate total revenue and total orders for the monthly report
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;

        setChartData(formattedData);
        setMonthlyReport({ totalOrders, totalRevenue });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


const token = localStorage.getItem("token")
  console.log(token);
  
 
  return (
    <Box sx={{ height: '100vh', overflowY: 'auto', paddingBottom: 20 }} className="hide-scrollbar">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box my={2}>
        <Typography variant="h6">
          Welcome back
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur excepturi, iure adipisci asperiores vitae aut pariatur alias tenetur quidem nemo reiciendis obcaecati hic? Corporis repellat excepturi sint, error natus quod?
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, overflow: 'auto', maxHeight: 400 }}>
            <Typography variant="h6">Orders Over Time</Typography>
            <LineChart width={500} height={300} data={chartData}>
              <Line type="monotone" dataKey="orders" stroke="#585ce4" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, overflow: 'auto', maxHeight: 400 }}>
            <Typography variant="h6">Revenue Over Time</Typography>
            <BarChart width={500} height={300} data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#585ce4" />
            </BarChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, overflow: 'auto', maxHeight: 400 }}>
            <Typography variant="h6">Monthly Reports</Typography>
            <Typography>Number of Orders: {monthlyReport.totalOrders}</Typography>
            <Typography>Total Revenue: ${monthlyReport.totalRevenue.toFixed(2)}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
