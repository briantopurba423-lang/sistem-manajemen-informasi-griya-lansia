import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./Login.jsx";

const el = document.getElementById("app");
if (el) {
    createRoot(el).render(<Login />);
}
