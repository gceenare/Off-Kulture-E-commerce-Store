import React from "react";
import { createRoot } from "react-dom/client";
import AppWithApi from "./AppWithApi.tsx";
import { ApiProvider } from "./contexts/ApiContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApiProvider>
      <AppWithApi />
    </ApiProvider>
  </React.StrictMode>
);
