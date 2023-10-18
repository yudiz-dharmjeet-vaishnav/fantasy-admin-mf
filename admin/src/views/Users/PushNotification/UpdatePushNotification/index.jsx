import React, { Fragment, useRef, useState } from 'react'

import Layout from '../../../../components/Layout'
import UpdatePushNotification from './UpdatePushNotification'
import UsersListMainHeader from '../../Component/UsersListMainHeader'

function IndexUpdatePushNotification (props) {
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const content = useRef()

  function onSubmit () {
    content.current.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <UsersListMainHeader
          UpdatePushNotification
          cancelLink="/users/push-notification/automated-notification"
          heading='Edit Push Notification'
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <UpdatePushNotification
          {...props}
          ref={content}
          setSubmitDisableButton={setSubmitDisableButton}
        />
      </Layout>
    </Fragment>
  )
}

export default IndexUpdatePushNotification
