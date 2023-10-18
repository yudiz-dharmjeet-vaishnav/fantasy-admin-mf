import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import UpdatePayoutComponent from './UpdatePayout'
import Layout from '../../../../components/Layout'
import MainHeading from '../../component/MainHeading'

function UpdatePayout (props) {
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const page = JSON.parse(localStorage?.getItem('queryParams'))
  const content = useRef()
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)

  function onSubmit () {
    content.current.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <MainHeading
          Auth={Auth}
          UpdatePayout
          adminPermission={adminPermission}
          cancelLink={`/settings/payout-management${page?.PayoutManagement || ''}`}
          heading ="Edit Payout"
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <UpdatePayoutComponent
            {...props}
            ref={content}
            Auth={Auth}
            adminPermission={adminPermission}
            cancelLink="/settings/payout-management"
            setSubmitDisableButton={setSubmitDisableButton}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

export default UpdatePayout
