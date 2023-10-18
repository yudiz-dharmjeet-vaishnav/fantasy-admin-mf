import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import AddPopUpAd from './AddPopUpAd'
import MainHeading from '../../component/MainHeading'

function PopupAdOperation (props) {
  const { id } = useParams()
  const [isCreate, setIsCreate] = useState(true)
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const content = useRef()
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  useEffect(() => {
    if (id) {
      setIsCreate(false)
      // setLoading(true)
    }
  }, [])

  function onSubmit () {
    content?.current?.onSubmit()
  }

  return (
    <Fragment>
      <Layout {...props} >
        <MainHeading
          AddPopUpAd
          Auth={Auth}
          adminPermission={adminPermission}
          button = {isCreate ? 'Add Pop Up Ad' : 'Save Changes'}
          cancelLink={`/settings/popup-ads-management${page?.PopupAdsManagement || ''}`}
          heading={isCreate ? 'Add Popup Ad' : 'Edit Popup Ad'}
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddPopUpAd
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

PopupAdOperation.propTypes = {
  match: PropTypes.object
}

export default PopupAdOperation
