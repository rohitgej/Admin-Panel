// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./Pages/Pages/Login";

const AppPro = () => {
  return (
    <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />
          </Routes>
    </Router>
  );
};

export default AppPro;
