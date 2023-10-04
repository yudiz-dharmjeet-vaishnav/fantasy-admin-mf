import React from 'react'
import { Provider } from 'react-redux'

import './assets/css/style.scss'
import Routes from "./Routes";
import { store } from './Store'

const App = () => (
  <Provider store={store}>
    <Routes />
  </Provider>
);

export default App
