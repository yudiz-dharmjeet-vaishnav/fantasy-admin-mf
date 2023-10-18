import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import Heading from '../../../Settings/component/Heading'
import AutomatedNotification from './AutomatedNotification'

function IndexAutomatedNotification (props) {
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

  const [modalOpen, setModalOpen] = useState(false)

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <Heading
              automatedNotification
              goBack
              heading="Automated Push Notifications"
              modalOpen={modalOpen}
              permission={(Auth && Auth === 'SUPER') || (adminPermission?.PUSHNOTIFICATION !== 'R')}
              setModalOpen={setModalOpen}
            />
            <AutomatedNotification
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default IndexAutomatedNotification
