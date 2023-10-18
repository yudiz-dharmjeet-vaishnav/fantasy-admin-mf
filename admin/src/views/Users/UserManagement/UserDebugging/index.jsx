import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import UserDebuggingPage from './UserDebugging'
import UsersListMainHeader from '../../Component/UsersListMainHeader'
import { getUserDetails } from '../../../../actions/users'

function UserDebugging (props) {
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const usersDetails = useSelector(state => state.users.usersDetails)

  useEffect(() => {
    if (id) {
      // dispatch action to get UserDetails
      dispatch(getUserDetails(id, token))
    }
  }, [])

  return (
    <Fragment>
      <Layout {...props} >
        <UsersListMainHeader
          {...props}
          UserDebugger
          heading="User Debugger"
        />
        <div className='without-pagination'>
          <UserDebuggingPage
            {...props}
            user
            usersDetails={usersDetails}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

UserDebugging.propTypes = {
  match: PropTypes.object
}

export default UserDebugging
