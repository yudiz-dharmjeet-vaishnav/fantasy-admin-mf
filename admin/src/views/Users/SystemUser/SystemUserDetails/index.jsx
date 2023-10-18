import React, { Fragment, useRef } from 'react'

import Layout from '../../../../components/Layout'
import SystemUserDetails from './SystemUserDetails'
import UsersListMainHeader from '../../Component/UsersListMainHeader'

function SystemUserDetailsPage (props) {
  const content = useRef()

  function onRefresh () {
    content.current.onRefresh()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <UsersListMainHeader
          {...props}
          SystemUserDetails
          heading="System User Details"
          onRefresh={onRefresh}
          refresh="Refresh"
        />
        <div className='without-pagination'>
          <SystemUserDetails
            {...props}
            ref={content}
            systemUser
          />
        </div>
      </Layout>
    </Fragment>
  )
}

export default SystemUserDetailsPage
