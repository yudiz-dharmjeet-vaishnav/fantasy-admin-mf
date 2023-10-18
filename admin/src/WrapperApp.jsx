import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/style.scss'

import App from './App'
import { store } from './Store'
import { client } from './api/client'
import { MyProvider } from './context/context'

function WrapperApp() {
  return (
    <Router>
      <Provider store={store}>
        <QueryClientProvider client={client}>
          <MyProvider>
            <App />
          </MyProvider>
        </QueryClientProvider>
      </Provider>
    </Router>
  )
}

export default WrapperApp