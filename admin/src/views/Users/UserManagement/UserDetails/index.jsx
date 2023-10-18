import React, { Fragment, useRef } from 'react'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import UserDetails from './UserDetails'
import UsersListMainHeader from '../../Component/UsersListMainHeader'

function UserDetailsPage (props) {
  const content = useRef()

  function onRefresh () {
    content.current.onRefresh()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <UsersListMainHeader
          {...props}
          UserDetails
          heading="User Details"
          onRefresh={onRefresh}
          refresh="Refresh"
        />
        <div className='without-pagination'>
          <UserDetails
            {...props}
            ref={content}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

UserDetailsPage.prototypes = {
  match: PropTypes.object
}

export default UserDetailsPage
