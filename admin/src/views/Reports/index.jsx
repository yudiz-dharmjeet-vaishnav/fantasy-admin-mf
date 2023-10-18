import React, { Fragment, useRef } from 'react'
import Layout from '../../components/Layout'
import AllReportsComponent from './Reports'
import MainHeading from '../Settings/component/MainHeading'

function IndexAllReports (props) {
  const content = useRef()

  function onExport () {
    content.current.onExport()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section">
            <MainHeading
              AllReports
              export='Export'
              heading="Reports"
              onExport={onExport}
            />
            <div className='without-pagination'>
              <AllReportsComponent
                {...props}
                ref={content}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default IndexAllReports
