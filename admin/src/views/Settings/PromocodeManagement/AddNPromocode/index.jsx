import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import AddNPromocode from './AddNPromocode'
import MainHeading from '../../component/MainHeading'

function index (props) {
  const [isCreate, setIsCreate] = useState(true)
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const content = useRef('')

  function onAdd () {
    content?.current?.onAdd()
  }
  return (
    <div>
      <Layout {...props}>
        <MainHeading
          {...props}
          AddNPromocode
          Auth={Auth}
          button={isCreate ? 'Add Promocode' : 'Save Changes'}
          cancelLink={`/settings/promocode-management${page?.PromoCodeManagement || ''}`}
          heading={isCreate ? 'Create Promocode' : 'Edit Promocode'}
          onAdd ={onAdd}
          page={page}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddNPromocode
            {...props}
            ref={content}
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
