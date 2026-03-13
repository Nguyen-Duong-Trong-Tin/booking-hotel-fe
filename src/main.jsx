import React from "react";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";
import App from "./App";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer position="top-right" autoClose={3000} />
  </React.StrictMode>
);
