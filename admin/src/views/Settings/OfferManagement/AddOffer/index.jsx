import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

import Layout from '../../../../components/Layout'
import AddOffer from './AddOffer'
import MainHeading from '../../component/MainHeading'

function index (props) {
  const { id } = useParams()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [Title, setTitle] = useState('')
  const [Description, setDescription] = useState('')
  const [Details, setDetails] = useState('')
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const content = useRef()
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
          AddOffer
          Description={Description}
          Details={Details}
          Title={Title}
          button={isCreate ? 'Add Offer' : !isEdit ? 'Save Changes' : 'Edit Offer'}
          cancelLink={`/settings/offer-management${page?.OfferManagement || ''}`}
          heading={isCreate ? 'Add Offer' : 'Edit Offer'}
          isCreate={isCreate}
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <main className="main-content">
            <section className="management-section common-box">
              <AddOffer
                {...props}
                ref={content}
                Description={Description}
                Details={Details}
                Title={Title}
                isCreate={isCreate}
                setDescription={setDescription}
                setDetails={setDetails}
                setIsCreate={setIsCreate}
                setIsEdit={setIsEdit}
                setSubmitDisableButton={setSubmitDisableButton}
                setTitle={setTitle}

              />
            </section>
          </main>
        </div>
      </Layout>
    </Fragment>
  )
}

export default index
