import React, { Fragment } from 'react'

import Layout from '../../../../components/Layout'
import UserViewContent from './UserKycVerification'

function UserKycRequest (props) {
  return (
    <Fragment>
      <Layout {...props} >
        <UserViewContent
          {...props}
        />
      </Layout>
    </Fragment>
  )
}

export default UserKycRequest
