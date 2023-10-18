import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import AddPromocode from './AddPromocode'
import MainHeading from '../../component/MainHeading'

function index (props) {
  const [isCreate, setIsCreate] = useState(true)
  const [submitDisableButton, setSubmitDisableButton] = useState()
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const content = useRef()
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)

  function onAdd () {
    content.current.onAdd()
  }
  return (
    <div>
      <Layout {...props} >
        <MainHeading
          {...props}
          AddPromocode
          Auth={Auth}
          adminPermission={adminPermission}
          button={isCreate ? 'Add Promocode' : 'Save Changes'}
          cancelLink={`/settings/promocode-management${page?.PromoCodeManagement || ''}`}
          heading= {isCreate ? 'Create Promocode' : 'Edit Promocode'}
          onAdd={onAdd}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddPromocode
            {...props}
            ref={content}
            Auth={Auth}
            adminPermission={adminPermission}
            isCreate={isCreate}
            setIsCreate={setIsCreate}
            setSubmitDisableButton={setSubmitDisableButton}
          />
        </div>
      </Layout>
    </div>
  )
}

export default index
