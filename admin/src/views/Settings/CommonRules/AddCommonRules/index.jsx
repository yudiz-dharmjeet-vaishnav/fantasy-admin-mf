import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import AddRuleComponent from './Addrule'
import MainHeading from '../../component/MainHeading'

function AddRule (props) {
  const content = useRef()
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)

  function onSubmit () {
    content?.current?.onSubmit()
  }
  return (
    <div>
      <Layout {...props} >
        <MainHeading
          AddRuleComponent
          Auth={Auth}
          adminPermission={adminPermission}
          cancelLink="/settings/common-rules"
          heading='Edit Common Rule'
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddRuleComponent
            {...props}
            ref={content}
            adminPermission={adminPermission}
            setSubmitDisableButton={setSubmitDisableButton}
          />
        </div>
      </Layout>
    </div>
  )
}

export default AddRule
