import React, { Fragment, useRef } from 'react'

import Layout from '../../../components/Layout'
import SportsComponent from './Sports'
import MainHeading from '../component/MainHeading'

function SportsManagement (props) {
  const content = useRef()

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              heading="Sports"
              info
            />
            <SportsComponent
              {...props}
              ref={content}
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default SportsManagement
