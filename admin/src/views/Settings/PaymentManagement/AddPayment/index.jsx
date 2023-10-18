import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import AddPayment from './AddPayment'
import MainHeading from '../../component/MainHeading'

function index (props) {
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const content = useRef()

  function onSubmit () {
    content?.current?.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <MainHeading
          AddPayment
          adminPermission={adminPermission}
          cancelLink={`/settings/payment-management${page?.PaymentManagement || ''}`}
          heading ="Edit Payment"
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddPayment
            {...props}
            ref={content}
            adminPermission={adminPermission}
            cancelLink="/settings/payment-management"
            setSubmitDisableButton={setSubmitDisableButton}
            Auth={Auth}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

export default index
