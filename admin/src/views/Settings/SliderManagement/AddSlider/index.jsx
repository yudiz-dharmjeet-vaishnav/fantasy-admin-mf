import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Layout from '../../../../components/Layout'
import AddSlider from './AddSlider'
import MainHeading from '../../component/MainHeading'

function index (props) {
  const { id } = useParams()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const content = useRef()

  useEffect(() => {
    if (id) {
      setIsCreate(false)
      // setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  function heading () {
    if (isCreate) {
      return 'Add Slider'
    }
    return !isEdit ? 'Edit Slider' : 'View Slider Details'
  }

  function onSubmit () {
    content?.curren?.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <MainHeading
          AddSlider
          Auth={Auth}
          adminPermission={adminPermission}
          button={isCreate ? 'Add Slider' : 'Save Changes'}
          cancelLink={`/settings/slider-management${page?.SliderManagement || ''}`}
          heading={heading()}
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddSlider
            {...props}
            ref={content}
            Auth={Auth}
            adminPermission={adminPermission}
            isCreate={isCreate}
            setIsCreate={setIsCreate}
            setIsEdit={setIsEdit}
            setSubmitDisableButton={setSubmitDisableButton}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

export default index
