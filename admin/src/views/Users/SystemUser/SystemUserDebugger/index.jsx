import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import UserDebugging from '../../../Users/UserManagement/UserDebugging/UserDebugging'
import Layout from '../../../../components/Layout'
import UsersListMainHeader from '../../Component/UsersListMainHeader'

import { getSystemUserDetails } from '../../../../actions/systemusers'

function SystemUserDebugging (props) {
  const { id } = useParams()
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const systemUserDetails = useSelector(state => state.systemusers.systemUserDetails)

  useEffect(() => {
    if (id) {
      // dispatch action to getSystemUserDetails
      dispatch(getSystemUserDetails(id, token))
    }
  }, [])

  return (
    <Fragment>
      <Layout {...props} >
        <UsersListMainHeader
          {...props}
          UserDebugger
          heading="System User Debugger"
          systemUser
        />
        <div className='without-pagination'>
          <UserDebugging
            systemUser
            usersDetails={systemUserDetails}
            {...props}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

SystemUserDebugging.propTypes = {
  match: PropTypes.object
}

export default SystemUserDebugging
