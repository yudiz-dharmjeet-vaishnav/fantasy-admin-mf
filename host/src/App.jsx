import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"

import "./index.css";
import Routes from "./Routes";
import AdminRoutes from "admin/Routes"

const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes />
        <AdminRoutes />
      </Router>
    </div>
  )
};
ReactDOM.render(<App />, document.getElementById("app"));
