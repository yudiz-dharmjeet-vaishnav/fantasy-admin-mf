import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import UpdateNotification from './UpdateNotification'
import MainHeading from '../../component/MainHeading'

function UpdateNotificationIndex (props) {
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const content = useRef()

  function onSubmit () {
    content?.current?.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <MainHeading
          Auth={Auth}
          UpdateNotification
          adminPermission={adminPermission}
          cancelLink={`/settings/notification-management${page?.NotificationManagement || ''}`}
          heading='Edit Notification'
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <main className="main-content">
          <UpdateNotification
            {...props}
            ref={content}
            Auth={Auth}
            adminPermission={adminPermission}
            setSubmitDisableButton={setSubmitDisableButton}
          />
        </main>
      </Layout>
    </Fragment>
  )
}

export default UpdateNotificationIndex
