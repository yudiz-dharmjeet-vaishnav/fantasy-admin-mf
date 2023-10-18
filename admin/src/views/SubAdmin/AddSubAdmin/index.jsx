import React, { Fragment, useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Header from '../../../components/Header'
import Layout from '../../../components/Layout'
import AddSubAdminForm from './AddSubAdmin'
import SubAdminMainHeader from '../components/SubAdminMainHeader'

import { addSubadmin, updateSubadmin, getSubadminDetails } from '../../../actions/subadmin'

function AddSubAdmin (props) {
  const { id } = useParams()
  const token = useSelector(state => state.auth.token)
  const dispatch = useDispatch()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const content = useRef()

  const subadminDetails = useSelector(state => state?.subadmin?.subadminDetails)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  useEffect(() => {
    if (id) {
      dispatch(getSubadminDetails(id, token))
    }
  }, [])

  useEffect(() => {
    if (id) {
      setIsCreate(false)
      // setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  function button () {
    if (isCreate) {
      return 'Create SubAdmin'
    }
    return !isEdit ? 'Save Changes' : 'Edit SubAdmin'
  }

  function addSubAdminFun (fullname, username, email, MobNum, password, aRole, subAdminStatus) {
    const addSubAdminData = {
      fullname, username, email, MobNum, password, aRole, token, subAdminStatus
    }
    dispatch(addSubadmin(addSubAdminData))
  }

  function updateSubAdminFun (fullname, username, email, MobNum, password, aRole, ID, subAdminStatus) {
    const updateSubAdminData = {
      fullname, username, email, MobNum, password, aRole, ID, token, subAdminStatus
    }
    dispatch(updateSubadmin(updateSubAdminData))
  }

  function onSubmit () {
    content?.current?.onSubmit()
  }

  return (
    <Fragment>
      <Header />
      <Layout {...props} >
        <SubAdminMainHeader
          AddSubAdmin
          Auth={Auth}
          adminPermission={adminPermission}
          button={button()}
          header={isCreate ? 'Add Sub-Admin' : 'Edit Sub-Admin'}
          onSubmit={onSubmit}
          submitDisableButton={submitDisableButton}
        />

        <div className='without-pagination'>
          <AddSubAdminForm
            {...props}
            ref={content}
            SubAdminDetails={subadminDetails}
            addSubAdmin={addSubAdminFun}
            adminPermission={adminPermission}
            setIsEdit={setIsEdit}
            setSubmitDisableButton = {setSubmitDisableButton}
            updateSubAdmin={updateSubAdminFun}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

AddSubAdmin.propTypes = {
  match: PropTypes.object
}

export default AddSubAdmin
