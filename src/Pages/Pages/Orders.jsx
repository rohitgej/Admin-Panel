import React, { useState, useEffect } from "react";
import "../styles/Orders.css";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ImageModal from "../../Components/modals/ImageModal/ImageModal";
import AssignModal from "../../Components/modals/AssignModal/AssignModal";
import Button from "../../Components/Button/Button";
import ViewItemModal from "../../Components/modals/ViewItemsModal/ViewItemModal";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [payments, setPayments] = useState([]);
  const [itemModal, setItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item
  const [OrdersDetails, setOrdersDetails]=useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignType,setAssignType]= useState(null)
  const [runnerid,setRunnerid]=useState(null)

  // New states for dropdown
  const [deliveryStatus, setDeliveryStatus] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const requestOptions = {
          method: "POST",
          body: JSON.stringify({}),
          redirect: "follow",
        };

        const response = await fetch(
          "http://localhost:3000/api/getcheckout",
          requestOptions
        );
        const result = await response.json();
        setOrders(result.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchUsers = async () => {
      const raw = "";
      const requestOptions = {
        method: "POST",
        body: raw,
        redirect: "follow",
      };
      try {
        const response = await fetch(
          "http://20.20.20.115:3000/api/viewuser",
          requestOptions
        );
        const result = await response.json();
        setUsers(result.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchTimeSlots = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getTimeslot", {
          method: "GET",
        });
        const result = await response.json();
        setTimeSlots(result);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    };

    const fetchPayments = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/viewtransactionmethod",
          { method: "GET" }
        );
        const result = await response.json();
        setPayments(result.transactionmethod);
      } catch (error) {
        console.error("Error fetching payments API:", error);
      }
    };
    fetchPayments();
    fetchOrders();
    fetchUsers();
    fetchTimeSlots();
  }, []);

  const getTimeslotName = (timeslotId) => {
   

    const timeslot = timeSlots.find((slot) => slot._id === timeslotId);

   

    return timeslot ? timeslot.Timeslot : "Unknown Timeslot";
  };

  const getPaymentMethod = (PaymentId) => {
    const payment = payments.find((slot) => slot._id === PaymentId);
    return payment ? payment.transactionmethod_name : "Unknown payment method";
  };

  // Function to handle search input
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to open modal with the selected images
  const openModal = (imagesList) => {
    setImages(imagesList);
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setImages([]);
  };

 
  const closeItemModal = () => {
    setItemModal(false);
  };

  // Function to open the item modal
  const openItemModal = (item, orders) => {
    setOrdersDetails(orders)
    setSelectedItem(item); // Set the selected item data
    setItemModal(true); // Open the modal
  };

  // Function to handle status changes
  const handleStatusChange = (orderId, statusType, value) => {
    if (statusType === "delivery") {
      setDeliveryStatus((prevState) => ({ ...prevState, [orderId]: value }));
    } else if (statusType === "payment") {
      setPaymentStatus((prevState) => ({ ...prevState, [orderId]: value }));
      
      // Retrieve the token from local storage
      const token = localStorage.getItem("token");
  
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
  
      const raw = JSON.stringify({
        order_id: orderId,
        payment_status: value
      });
  
      const requestOptions = {
        method: "PUT",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
  
      // Make the API call to update the payment status
      fetch("http://localhost:3000/api/update_paymentstatus", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          
          alert("Payment status updated successfully!");
        })
        .catch((error) => console.error("Error updating payment status:", error));
    }
  };
  const handleAssignPartnerClick = (order,delivery_type,selectedRunner) => {
    setSelectedOrder(order);
    setRunnerid(selectedRunner)
    setAssignType(delivery_type)
    setShowModal(true);  // Open the modal
  };

  const handleDeliverytatusChange = async(orderId, value) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem("token");
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
  
    let raw =JSON.stringify({
      order_id: orderId,
      delivery_status: value,
    });

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    try {
      const response = await fetch('http://localhost:3000/api/updateOrder', requestOptions);
      const result = await response.json();
      alert(result.message);
      
      // Optionally refresh items or update the state directly to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    }
  }


  const handleAssignPartner = (partnerId) => {
    console.log(`Assigned partner ID: ${partnerId}`);
  };

  // Function to get address from user data
  const getAddress = (addressId) => {
    for (const user of users) {
      const address = user.addresses.find((addr) => addr._id === addressId);
      if (address) {
        return `${address.house_no}, ${address.block_no}, ${address.address}`;
      }
    }
    return "Address not found";
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(
    (order) =>
      order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.Customer_OrderNumber.toString()
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="inventory-page">
      <h1>Orders</h1>

      <div className="search-bar">
        <Box sx={{ marginBottom: "20px" }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search by Order ID, Customer Order No, or Name"
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </div>
      <div className="otable-container">
        <table className="otable-container">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Order No</th>
              <th>Mobile Number</th>
              <th>Name</th>
              <th>Address</th>
              <th>Remark</th>
              <th>Items</th>
              <th>Order Date</th>
              <th>Time Slot</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Payment Method</th>
              <th>Assign pick up</th>
              <th>Collection Image</th>
              <th>Assign Delivery</th>
              <th>Delivery Image</th>
            
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.order_id}</td>
                  <td>{order.Customer_OrderNumber}</td>
                  <td>{order.mobile_no}</td>
                  <td>{order.name}</td>
                  <td>{getAddress(order.address)}</td>
                  <td>{order.remark}</td>
                  <td>
                  <div className="OitemSec" onClick={() => openItemModal(order.items, order)}>
                      {order.items.length} items
                    </div>
                  </td>

                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>{getTimeslotName(order.timeslot)} </td>
                  <td >
                    <Select  sx={{fontSize:"10px"}}
                      value={
                        paymentStatus[order.order_id] || order.payment_status
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          order.order_id,
                          "payment",
                          e.target.value
                        )
                      }
                      displayEmpty
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="paid">Paid</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="return">Return</MenuItem>
                    </Select>
                  </td>
                  <td >
                    <Select sx={{fontSize:"10px"}}
                      value={
                        deliveryStatus[order.order_id] || order.delivery_status
                      }
                      onChange={(e) =>
                        handleDeliverytatusChange(
                          order.order_id,
                          e.target.value
                        )
                      }
                      displayEmpty
                    >
                      <MenuItem  value={1}>Ordered</MenuItem>
                      <MenuItem value={2}>Order Accepted</MenuItem>
                      <MenuItem value={3}>Ready For pick up</MenuItem>
                      <MenuItem value={4}>Picked Up</MenuItem>
                      <MenuItem value={5}>In Progress</MenuItem>
                      <MenuItem value={6}>Out of Delivery</MenuItem>
                      <MenuItem value={7}>Delivered</MenuItem>
                      <MenuItem value={8}>Cancelled</MenuItem>

                    </Select>
                  </td>
                  <td>{getPaymentMethod(order.payment)}</td>
                  <td>
                  <Button onAdd={() => handleAssignPartnerClick(order.order_id,"pickup",order.runner_id)} Title="Assign" />
                   
                  </td>
                  <td>
                    <img
                      src={
                        order.collection_image_url[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Collection"
                      style={{
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                      }}
                      onClick={() => openModal(order.collection_image_url)}
                    />
                  </td>
                  <td>
                  <Button onAdd={() => handleAssignPartnerClick(order.order_id,"delivery",order.runner_id)} Title="Assign" />
                   
                  </td>
                  <td>
                    <img
                      src={
                        order.delivery_image_url[0] ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Delivery"
                      style={{
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                      }}
                      onClick={() => openModal(order.delivery_image_url)}
                    />
                  </td>
                 
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="17">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        images={images}
      />

      {/* Assign Modal */}
      <AssignModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAssign={handleAssignPartner}
        order={selectedOrder}  // Pass the selected order
        assignType={assignType}
        selectedRunnerId={runnerid || ''}
      />

      {/* View Item Modal */}
      <ViewItemModal
        isOpen={itemModal}
       onClose={closeItemModal}
        items={selectedItem} // Ensure this is passed
        orders={OrdersDetails} // Ensure this is passed
      />
    </div>
  );
};

export default Orders;
