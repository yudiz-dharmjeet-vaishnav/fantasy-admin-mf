import React from 'react'

import Header from '../../../components/Header'
import Layout from '../../../components/Layout'
import ChangePasswordContent from './changePassword'

function ChangePassword (props) {
  return (
    <div>
      <Header />
      <Layout {...props} >
        <ChangePasswordContent />
      </Layout>
    </div>
  )
}
export default ChangePassword
