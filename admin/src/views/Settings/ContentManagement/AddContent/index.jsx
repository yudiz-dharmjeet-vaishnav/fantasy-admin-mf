import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import AddContent from './AddContent'
import Header from '../../../../components/Header'
import Layout from '../../../../components/Layout'
import MainHeading from '../../component/MainHeading'

function AddContest (props) {
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const content = useRef()
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const page = JSON.parse(localStorage?.getItem('queryParams'))
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
          AddContent
          Auth={Auth}
          button={isCreate ? 'Add Content' : !isEdit ? 'Save Changes' : 'Edit Content'}
          cancelLink={`/settings/content-management${page?.ContentManagement || ''}`}
          heading={isCreate ? 'Add Content' : !isEdit ? 'Edit Content' : 'View Details'}
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddContent
            {...props}
            ref={content}
            Auth={Auth}
            adminPermission={adminPermission}
            isCreate={isCreate}
            isEdit={isEdit}
            setIsCreate={setIsCreate}
            setIsEdit={setIsEdit}
            setSubmitDisableButton={setSubmitDisableButton}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

AddContest.propTyes = {
  match: PropTypes.object
}

export default AddContest
