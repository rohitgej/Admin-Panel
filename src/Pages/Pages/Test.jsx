import React, { useState, useEffect } from 'react';
import '../styles/Orders.css';
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageModal from '../../Components/modals/ImageModal/ImageModal';
import AssignModal from '../../Components/modals/AssignModal/AssignModal';
import ViewItemModal from '../../Components/modals/ViewItemsModal/ViewItemModal';
import Button from '../../Components/button/Button';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [payments, setPayments] = useState([]);
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [deliveryStatus, setDeliveryStatus] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchUsers();
    fetchTimeSlots();
    fetchPayments();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/getcheckout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const result = await response.json();
      setOrders(result.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://20.20.20.115:3000/api/viewuser', {
        method: 'POST',
      });
      const result = await response.json();
      setUsers(result.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/getTimeslot');
      const result = await response.json();
      setTimeSlots(result);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/viewtransactionmethod');
      const result = await response.json();
      setPayments(result.transactionmethod);
    } catch (error) {
      console.error('Error fetching payments API:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const openImageModal = (imagesList) => {
    setImages(imagesList);
    setModalIsOpen(true);
  };

  const closeImageModal = () => {
    setModalIsOpen(false);
    setImages([]);
  };

  const openItemModal = (item) => {
    setSelectedItem(item);
    setItemModalOpen(true);
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    setItemModalOpen(false);
  };

  const handleStatusChange = (orderId, statusType, value) => {
    if (statusType === 'delivery') {
      setDeliveryStatus((prev) => ({ ...prev, [orderId]: value }));
    } else if (statusType === 'payment') {
      setPaymentStatus((prev) => ({ ...prev, [orderId]: value }));
    }
  };

  const handleAssignPartner = (partnerId) => {
    console.log(`Assigned partner ID: ${partnerId}`);
    setShowAssignModal(false);
  };

  const handleSave = (orderId) => {
    const updatedOrder = {
      delivery_status: deliveryStatus[orderId],
      payment_status: paymentStatus[orderId],
    };
    // Implement your save logic here, e.g., API call to update order
    console.log('Saving order:', orderId, updatedOrder);
  };

  const getAddress = (addressId) => {
    for (const user of users) {
      const address = user.addresses.find((addr) => addr._id === addressId);
      if (address) {
        return `${address.house_no}, ${address.block_no}, ${address.address}`;
      }
    }
    return 'Address not found';
  };

  const getTimeslotName = (timeslotId) => {
    const timeslot = timeSlots.find((slot) => slot._id === timeslotId);
    return timeslot ? timeslot.Timeslot : 'Unknown Timeslot';
  };

  const getPaymentMethod = (paymentId) => {
    const payment = payments.find((p) => p._id === paymentId);
    return payment ? payment.transactionmethod_name : 'Unknown Payment Method';
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.Customer_OrderNumber.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="orders-page">
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search by Order ID, Customer Order No, or Name"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table aria-label="orders table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer Order No</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Time Slot</TableCell>
              <TableCell>Payment Status</TableCell>
              <TableCell>Delivery Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Assign Pickup</TableCell>
              <TableCell>Collection Image</TableCell>
              <TableCell>Assign Delivery</TableCell>
              <TableCell>Delivery Image</TableCell>
              <TableCell>Save</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.Customer_OrderNumber}</TableCell>
                  <TableCell>{order.mobile_no}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{getAddress(order.address)}</TableCell>
                  <TableCell>{order.remark}</TableCell>
                  <TableCell>
                    {order.items.map((item, idx) => (
                      <Box key={idx} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          {item.item_id} - {item.quantity} pcs - ${item.price} - {item.weight}kg
                        </Typography>
                        <Button
                          onAdd={() => openItemModal(item)}
                          Title="View Item"
                        />
                      </Box>
                    ))}
                  </TableCell>
                  <TableCell>
                    {new Date(order.order_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getTimeslotName(order.timeslot)}</TableCell>
                  <TableCell>
                    <Select
                      value={paymentStatus[order.order_id] || order.payment_status || ''}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, 'payment', e.target.value)
                      }
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="unpaid">Unpaid</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={deliveryStatus[order.order_id] || order.delivery_status || ''}
                      onChange={(e) =>
                        handleStatusChange(order.order_id, 'delivery', e.target.value)
                      }
                      displayEmpty
                      fullWidth
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="in_transit">In Transit</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>{getPaymentMethod(order.payment)}</TableCell>
                  <TableCell>
                    <Button onAdd={() => setShowAssignModal(true)} Title="Assign" />
                  </TableCell>
                  <TableCell>
                    {order.collection_image_url && order.collection_image_url.length > 0 ? (
                      <Tooltip title="View Images">
                        <img
                          src={order.collection_image_url[0]}
                          alt="Collection"
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 4,
                            cursor: 'pointer',
                          }}
                          onClick={() => openImageModal(order.collection_image_url)}
                        />
                      </Tooltip>
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button onAdd={() => setShowAssignModal(true)} Title="Assign" />
                  </TableCell>
                  <TableCell>
                    {order.delivery_image_url && order.delivery_image_url.length > 0 ? (
                      <Tooltip title="View Images">
                        <img
                          src={order.delivery_image_url[0]}
                          alt="Delivery"
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 4,
                            cursor: 'pointer',
                          }}
                          onClick={() => openImageModal(order.delivery_image_url)}
                        />
                      </Tooltip>
                    ) : (
                      'No Image'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button onAdd={() => handleSave(order.order_id)} Title="Save" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={17} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalIsOpen}
        onRequestClose={closeImageModal}
        images={images}
      />

      {/* Assign Modal */}
      <AssignModal
        show={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssign={handleAssignPartner}
      />

      {/* View Item Modal */}
      <ViewItemModal
        isOpen={itemModalOpen}
        onClose={closeItemModal}
        item={selectedItem}
      />
    </div>
  );
};

export default Orders;
