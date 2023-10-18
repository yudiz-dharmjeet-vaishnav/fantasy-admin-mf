import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Layout from '../../../../components/Layout'
import UpdateComplaint from './UpdateComplaint'
import MainHeading from '../../component/MainHeading'

function UpdateComplaintComponent (props) {
  const [type, setType] = useState('')
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const content = useRef('')
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)

  function onEdit () {
    content?.current?.onEdit()
  }

  return (
    <div>
      <Layout {...props} >
        <MainHeading
          Auth={Auth}
          UpdateComplaint
          cancelLink={`/settings/feedback-complaint-management${page?.FeedbackManagement || ''}`}
          heading={type === 'C' ? 'Update Complaint Status' : 'Update Feedback Status'}
          onEdit={onEdit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <UpdateComplaint
            {...props}
            ref={content}
            setSubmitDisableButton={setSubmitDisableButton}
            setType={setType}
            type={type}
          />
        </div>
      </Layout>
    </div>
  )
}

export default UpdateComplaintComponent
