import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Header from '../../../../components/Header'
import Layout from '../../../../components/Layout'
import UpdateEmailTemplateComponent from './UpdateEmailTemplate'
import MainHeading from '../../component/MainHeading'

function UpdateEmailTemplate (props) {
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const content = useRef()
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)

  function onSubmit () {
    content?.current?.onSubmit()
  }
  return (
    <Fragment>
      <Header />
      <Layout {...props} >
        <MainHeading
          Auth={Auth}
          UpdateEmailTemplate
          adminPermission={adminPermission}
          cancelLink="/settings/email-template"
          heading='Edit Email Template'
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <UpdateEmailTemplateComponent
            {...props}
            ref={content}
            Auth={Auth}
            adminPermission={adminPermission}
            setSubmitDisableButton={setSubmitDisableButton}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

export default UpdateEmailTemplate
