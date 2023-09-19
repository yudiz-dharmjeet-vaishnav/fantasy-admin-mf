import React from 'react'
import { Provider } from 'react-redux'

import "./index.css";
import Routes from "./Routes";
import { store } from './Store'

const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);

export default App
