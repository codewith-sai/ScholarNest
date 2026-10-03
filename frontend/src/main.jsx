import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";

import App from "./App";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
      <App />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
   
  </React.StrictMode>
);