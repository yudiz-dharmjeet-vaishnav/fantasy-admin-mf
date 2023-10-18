import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddRole from './AddRole'
import Layout from '../../../../components/Layout'
import SubAdminMainHeader from '../../components/SubAdminMainHeader'

import { addRole, getRoleDetails, updateRole } from '../../../../actions/role'

function IndexAddRole (props) {
  const { id } = useParams()

  const content = useRef('')
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)

  const token = useSelector(state => state?.auth?.token)
  const roleDetails = useSelector(state => state?.role?.roleDetails)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)

  useEffect(() => {
    if (id) {
      setIsCreate(false)
      // setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  function addRoleFunc (name, permissions, roleStatus) {
    const addRoleData = {
      name, roleStatus, permissions, token
    }
    dispatch(addRole(addRoleData))
  }
  function updateRoleFunc (name, permissions, roleStatus, roleId) {
    const updateRoleData = {
      name, permissions, roleStatus, roleId, token
    }
    dispatch(updateRole(updateRoleData))
  }

  useEffect(() => {
    if (id) {
      dispatch(getRoleDetails(id, token))
    }
  }, [])

  function heading () {
    if (isCreate) {
      return 'Add Role'
    }
    return !isEdit ? 'Edit Role' : 'Role Details'
  }
  function button () {
    if (isCreate) {
      return 'Add Role'
    }
    return !isEdit ? 'Save Changes' : 'Edit Role'
  }

  function onSubmit () {
    content?.current?.onSubmit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <SubAdminMainHeader
          Auth={Auth}
          EditRole
          button={button}
          cancelLink='/sub-admin/roles'
          header={heading()}
          name={name}
          onSubmit={onSubmit}
        />
        <div className='without-pagination'>
          <AddRole
            {...props}
            ref={content}
            addRoleFunc={addRoleFunc}
            cancelLink="/sub-admin/roles"
            name={name}
            roleDetails={roleDetails}
            setIsEdit={setIsEdit}
            setName={setName}
            updateRoleFunc={updateRoleFunc}
          />
        </div>
      </Layout>
    </Fragment>
  )
}

IndexAddRole.propTypes = {
  match: PropTypes.object
}

export default IndexAddRole
