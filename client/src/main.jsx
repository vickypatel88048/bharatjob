import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";

import App from "./App";
import "./index.css";

// Production safety net: route legacy hardcoded API URLs to the
// current deployed backend configured for the production build.
const PRODUCTION_API =
  import.meta.env.VITE_API_URL ||
  "https://bharatjob-2.onrender.com/api";

const LEGACY_API_BASES = [
  "http://localhost:5000/api",
  "https://bharatjob-1.onrender.com/api",
];

if (import.meta.env.PROD) {
  axios.interceptors.request.use((config) => {
    if (typeof config.url === "string") {
      const legacyBase = LEGACY_API_BASES.find((base) =>
        config.url.startsWith(base)
      );

      if (legacyBase) {
        config.url =
          PRODUCTION_API + config.url.slice(legacyBase.length);
      }
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
