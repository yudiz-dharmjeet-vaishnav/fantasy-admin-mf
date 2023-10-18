import React, { Fragment, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddVersion from './AddVersion'
import Layout from '../../../../components/Layout'
import MainHeading from '../../component/MainHeading'

function AddVersionIndex (props) {
  const location = useLocation()
  const conditionUrl = !location?.pathname?.includes('add-version')
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const Auth = useSelector(
    (state) => state?.auth?.adminData && state?.auth?.adminData?.eType
  )
  const adminPermission = useSelector((state) => state?.auth?.adminPermission)
  const content = useRef()

  function onSubmit () {
    content?.current?.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <MainHeading
          AddVersion
          Auth={Auth}
          adminPermission={adminPermission}
          cancelLink ={`/settings/versions${page?.VersionManagement || ''}`}
          conditionUrl={conditionUrl}
          heading = {conditionUrl ? 'Edit Version' : 'Add Version'}
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <main className='main-content'>
            <section className='management-section'>
              <AddVersion
                {...props}
                ref={content}
                Auth={Auth}
                adminPermission={adminPermission}
                setSubmitDisableButton={setSubmitDisableButton}
              />
            </section>
          </main>
        </div>
      </Layout>
    </Fragment>
  )
}

AddVersionIndex.propTypes = {
  match: PropTypes.object
}
export default AddVersionIndex
