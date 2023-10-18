import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Header from '../../../../components/Header'
import Layout from '../../../../components/Layout'
import AddSportComponent from './AddSport'
import MainHeading from '../../component/MainHeading'

function AddSport (props) {
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const content = useRef()

  function onSubmit () {
    content.current.onSubmit()
  }
  return (
    <Fragment>
      <Header />
      <Layout {...props} >
        <MainHeading
          AddSport
          Auth={Auth}
          adminPermission={adminPermission}
          cancelLink="/settings/sports"
          heading='Edit Sport'
          onSubmit={onSubmit}
          setSubmitDisableButton={setSubmitDisableButton}
          submitDisableButton={submitDisableButton}
        />
        <AddSportComponent
          {...props}
          ref={content}
          Auth={Auth}
          adminPermission={adminPermission}
          setSubmitDisableButton={setSubmitDisableButton}
        />
      </Layout>
    </Fragment>
  )
}

export default AddSport
