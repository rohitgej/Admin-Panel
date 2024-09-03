import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Sections/Dashboard";
import Home from "./Pages/Pages/Home";
import AddInventory from "./Pages/Pages/Analytics";
import Customers from "./Pages/Pages/Customers";
import AddLaundry from "./Pages/Pages/AddLaundry";
import AddCategories from "./Pages/Pages/AddCategories";
import AddItems from "./Pages/Pages/AddItems";
import Orders from "./Pages/Pages/Orders";
import Login from "./Pages/Pages/Login";
import Complain from "./Pages/Pages/Complain";
import DeliveryPartner from "./Pages/Pages/DeliveryPartner";
import ForgotPassword from "./Pages/Pages/ForgetPassword";
import OtpVerification from "./Pages/Pages/OtpVerification";
import NewPassword from "./Pages/Pages/NewPassword";
import TimeSlot from "./Pages/Pages/TimeSlot";
import SendNotification from "./Pages/Pages/SendNotification"
import Register from "./Pages/Pages/Registration";
import ProtectedRoute from "../src/Components/Protected/ProtectedRout"; // Import the ProtectedRoute component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="AddLaundry" element={<AddLaundry />} />
            <Route path="AddInventory" element={<AddInventory />} />
            <Route path="AddCategories" element={<AddCategories />} />
            <Route path="AddItems" element={<AddItems />} />
            <Route path="Customers" element={<Customers />} />
            <Route path="Orders" element={<Orders />} />
            <Route path="complain" element={<Complain />} />
            <Route path="DeliveryPartner" element={<DeliveryPartner />} />
            <Route path="TimeSlot" element={<TimeSlot />} />
            <Route path="SendNotification" element={<SendNotification/>} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
