import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { registerServiceWorker } from "./app/registerServiceWorker";
import { router } from "./app/router";
import "./styles/tokens.css";
import "./styles/globals.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element tidak ditemukan.");
}

createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

registerServiceWorker();
