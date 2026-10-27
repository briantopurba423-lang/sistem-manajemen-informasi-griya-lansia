import React from "react";
import { createRoot } from "react-dom/client";
import PerawatApp from "./perawat/App.jsx";
import "../css/perawat.css";

const el = document.getElementById("perawat-app");
if (el) createRoot(el).render(<PerawatApp />);
