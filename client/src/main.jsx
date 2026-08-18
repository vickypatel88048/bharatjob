import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";

import App from "./App";
import "./index.css";

// Production safety net: if any page still contains a hardcoded
// localhost API URL, redirect that request to the deployed backend.
if (import.meta.env.PROD) {
  axios.interceptors.request.use((config) => {
    if (typeof config.url === "string" && config.url.startsWith("http://localhost:5000")) {
      config.url = config.url.replace(
        "http://localhost:5000",
        "https://bharatjob-2.onrender.com"
      );
    }
    return config;
  });
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
