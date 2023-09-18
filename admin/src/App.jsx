import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"

import "./index.css";
import Routes from "./Routes";

const App = () => (
  <div className="container">
    <Router>
      <Routes />
    </Router>
  </div>
);
ReactDOM.render(<App />, document.getElementById("app"));
