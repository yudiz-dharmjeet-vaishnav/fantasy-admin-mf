import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"

import Routes from "./Routes";
import AdminApp from "admin/App"
import UiApp from "ui/App"

const App = () => {
  return (
    <Router>
      <Routes />
      <AdminApp />
      <UiApp />
    </Router>
  )
};

const root = ReactDOM.createRoot(document.getElementById("app"))

root.render(<App />);
