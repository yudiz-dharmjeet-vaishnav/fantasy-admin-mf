import React, { Fragment } from 'react'
import Layout from '../../components/Layout'
import DashboardContent from './dashboard'
import MainHeading from '../Settings/component/MainHeading'

function index (props) {
  return (
    <Fragment>
      <Layout {...props}>
        <MainHeading
          heading="Dashboard"
        />
        <DashboardContent {...props} />
      </Layout>
    </Fragment>
  )
}

export default index
