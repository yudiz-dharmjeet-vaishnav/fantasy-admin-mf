import React from "react";
import ReactDOM from "react-dom/client";

import AdminApp from "admin/App"

const App = () => {
  return (
    <>
      <AdminApp />
    </>
  )
};

const root = ReactDOM.createRoot(document.getElementById("app"))

root.render(<App />);
