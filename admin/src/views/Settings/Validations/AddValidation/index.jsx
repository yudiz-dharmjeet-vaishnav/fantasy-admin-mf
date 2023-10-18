import React, { Fragment } from 'react'

import Layout from '../../../../components/Layout'
import AddValidation from './AddValidation'

function index (props) {
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <AddValidation {...props} />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default index
