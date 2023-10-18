import React, { createContext, useContext, useReducer } from 'react'
import reducer from './reducer'
import PropTypes from 'prop-types'

export const MyContext = createContext()

export const MyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, { token: '', isFullList: '' })

  return (
    <MyContext.Provider value={{ state, dispatch }}>
      {children}
    </MyContext.Provider>
  )
}

export const useMyContext = () => {
  return useContext(MyContext)
}

MyProvider.propTypes = {
  children: PropTypes.object
}
