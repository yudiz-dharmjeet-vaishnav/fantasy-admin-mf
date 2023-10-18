import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import AddSetting from './AddSetting'
import MainHeading from '../../component/MainHeading'

function index (props) {
  const [Key, setKey] = useState('')
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const content = useRef()

  function onSubmit () {
    content?.current?.onSubmit()
  }
  function updateCurrencyData () {
    content?.current?.updateCurrencyData()
  }
  function imageSubmit (Key) {
    content?.current?.imageSubmit(Key)
  }
  return (
    <Fragment>
      <Layout {...props} >
        <MainHeading
          AddSetting
          Auth={Auth}
          Key={Key}
          adminPermission={adminPermission}
          cancelLink={`/settings/setting-management${page?.SettingManagement || ''}`}
          heading= 'Edit Setting'
          imageSubmit={imageSubmit}
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
          updateCurrencyData={updateCurrencyData}
        />
        <AddSetting
          {...props}
          ref={content}
          Auth={Auth}
          Key={Key}
          adminPermission={adminPermission}
          setKey={setKey}
          setSubmitDisableButton={setSubmitDisableButton}
        />
      </Layout>
    </Fragment>
  )
}

export default index
