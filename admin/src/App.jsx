import React, { Fragment, useEffect, useRef, useState } from 'react'
import './App.css'
import { createBrowserHistory } from 'history'
import RoutesComponent from './routes/index'
import ModalComponent from './helpers/ModalComponent'
import { useSelector } from 'react-redux'
import { useMyContext } from './context/context'
// import { Provider } from 'react-redux'
// import { QueryClientProvider } from '@tanstack/react-query'
import { store } from './Store'
// import { client } from './api/client'
// import { MyProvider } from './context/context'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/style.scss'
import './index.css'
// import { BrowserRouter } from 'react-router-dom'
export const history = createBrowserHistory()

function App () {
  const error = useSelector(state => state.auth.error)
  const previousProps = useRef({ error }).current
  const [initialFlag, setInitialFlag] = useState(false)
  const token = localStorage.getItem('Token')
  const adminData = JSON.parse(localStorage.getItem('adminData'))
  const permission = JSON.parse(localStorage.getItem('adminPermission'))
  const { dispatch } = useMyContext()

  useEffect(() => {
    dispatch({ type: 'IsFullList', payload: false })
  }, [])

  useEffect(() => {
    if (previousProps.error !== error) {
      if (error) {
        setInitialFlag(true)
      }
    }
    setTimeout(() => {
      setInitialFlag(false)
    }, 3000)
    return () => {
      previousProps.error = error
    }
  }, [error])

  if (token) {
    store.dispatch({
      type: 'TOKEN_LOGIN',
      payload: {
        token,
        adminData,
        permission
      }
    })
    if (history.location.pathname === '/auth/login' || history.location.pathname === '/auth/forgot-password') {
      history.push('/dashboard')
    }
    // else {
    //   history.push({ pathname: history.location.pathname, search: history.location.search, state: history.location.state })
    // }
  } else {
    history.push({ pathname: history.location.pathname, search: history.location.search, state: history.location.state })
  }

  return (
    <Fragment>
      {/* <Provider store={store}>
        <QueryClientProvider client={client}>
          <MyProvider> */}
            {error && initialFlag && <ModalComponent error={error} />}
            {/* <BrowserRouter> */}
              <RoutesComponent />
            {/* </BrowserRouter> */}
          {/* </MyProvider>
        </QueryClientProvider>
      </Provider> */}
    </Fragment>
  )
}

export default App
