import React, { Fragment, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddPermission from './AddPermission'
import Layout from '../../../components/Layout'
import { addPermission, updatePermission, getPermissionDetails } from '../../../actions/permission'

function AddSubAdmin (props) {
  const { id } = useParams()
  const token = useSelector(state => state?.auth?.token)
  const permissionDetails = useSelector(state => state?.permission?.permissionDetails)
  const dispatch = useDispatch()

  function AddPermissionFunc (sName, sKey, eStatus) {
    dispatch(addPermission(sName, sKey, eStatus, token))
  }
  function EditPermissionFunc (Name, Key, permissionStatus, ID) {
    const updatedPermissionData = {
      Name, Key, permissionStatus, ID, token
    }
    dispatch(updatePermission(updatedPermissionData))
  }

  useEffect(() => {
    if (id) {
      dispatch(getPermissionDetails(id, token))
    }
  }, [])

  return (
    <Fragment>
      <Layout {...props} >
        <AddPermission
          {...props}
          AddPermissionFunc={AddPermissionFunc}
          PermissionDetails={permissionDetails}
          UpdatePermission={EditPermissionFunc}
          cancelLink="/sub-admin/permission"
        />
      </Layout>
    </Fragment>
  )
}

AddSubAdmin.propTypes = {
  match: PropTypes.object
}

export default AddSubAdmin
