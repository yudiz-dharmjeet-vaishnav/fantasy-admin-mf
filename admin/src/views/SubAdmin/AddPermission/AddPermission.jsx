import React, { useState, useEffect, useRef, Fragment } from 'react'
import { Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap'
import { useSelector } from 'react-redux'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import RequiredField from '../../../components/RequiredField'

import { modalMessageFunc, verifyLength } from '../../../helpers/helper'

function AddPermission (props) {
  const {
    AddPermissionFunc, UpdatePermission, PermissionDetails
  } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [Name, setName] = useState('')
  const [PermissionStatus, setPermissionStatus] = useState('Y')
  const [ErrName, setErrName] = useState('')
  const [ErrKey, setErrKey] = useState('')
  const [Key, setKey] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [PermissionId, setPermissionId] = useState('')

  const resStatus = useSelector(state => state?.permission?.resStatus)
  const resMessage = useSelector(state => state?.permission?.resMessage)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const previousProps = useRef({
    resStatus, resMessage, PermissionDetails
  })?.current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = PermissionDetails && previousProps?.PermissionDetails !== PermissionDetails && PermissionDetails?.sName === Name && PermissionDetails?.sKey === Key && PermissionDetails?.eStatus === PermissionStatus

  useEffect(() => {
    if (id) {
      setPermissionId(id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          navigate('/sub-admin/permission', { state: { message: resMessage } })
        } else {
          if (resStatus) {
            setIsEdit(false)
          }
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  //  set permission details
  useEffect(() => {
    if (previousProps?.PermissionDetails !== PermissionDetails) {
      if (PermissionDetails) {
        setName(PermissionDetails?.sName)
        setKey(PermissionDetails?.sKey)
        setPermissionStatus(PermissionDetails?.eStatus)
        setLoading(false)
      }
    }
    return () => {
      previousProps.PermissionDetails = PermissionDetails
    }
  }, [PermissionDetails])

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Name':
        if (verifyLength(event?.target?.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event?.target?.value)
        break
      case 'PermissionManagement':
        if (verifyLength(event?.target?.value, 1)) {
          setErrKey('')
        } else {
          setErrKey('Required field')
        }
        setKey(event?.target?.value)
        break
      case 'PermissionStatus':
        setPermissionStatus(event?.target?.value)
        break
      default:
        break
    }
  }
  // for validate the field and dispatch action
  function Submit (e) {
    e.preventDefault()
    if (verifyLength(Name, 1) && verifyLength(Key, 1) && !ErrName && PermissionStatus) {
      if (isCreate) {
        AddPermissionFunc(Name, Key, PermissionStatus)
      } else {
        UpdatePermission(Name, Key, PermissionStatus, PermissionId)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        setErrName('Required field')
      }
      if (!verifyLength(Key, 1)) {
        setErrKey('Required field')
      }
    }
  }

  // for set heading text
  function heading () {
    if (isCreate) {
      return 'Create Permission'
    }
    return !isEdit ? 'Edit Permission' : 'Permission Details'
  }

  // for set button name
  function button () {
    if (isCreate) {
      return 'Create Permission'
    }
    return !isEdit ? 'Save Changes' : 'Edit Permission'
  }

  return (
    <div>
      <main className="main-content">
        <AlertMessage
          close={close}
          message={message}
          modalMessage={modalMessage}
          status={status}
        />

        {loading && <Loading />}
        <section className="common-form-block">
          <h2>{heading()}</h2>
          <Form>
            <FormGroup>
              <Label for="Name">
                Permission Name
                <RequiredField/>
              </Label>
              <Input disabled={adminPermission?.PERMISSION === 'R'} name="Name" onChange={event => handleChange(event, 'Name')} placeholder="Name" value={Name} />
              <p className="error-text">{ErrName}</p>
            </FormGroup>
            <FormGroup>
              <Label for="Key">
                Permission Key
                <RequiredField/>
              </Label>
              <Input disabled={adminPermission?.PERMISSION === 'R'} name="PermissionNone" onChange={event => handleChange(event, 'PermissionManagement')} placeholder="Permission key" value={Key} />
              <p className="error-text">{ErrKey}</p>
            </FormGroup>
            <FormGroup>
              <Label for="Status">Permission Status</Label>
              <div className="d-flex inline-input">
                <CustomInput checked={PermissionStatus === 'Y'} disabled={adminPermission?.PERMISSION === 'R'} id="PermissionStatus1" label="Active" name="PermissionStatus" onClick={event => handleChange(event, 'PermissionStatus')} type="radio" value="Y" />
                <CustomInput checked={PermissionStatus === 'N'} disabled={adminPermission?.PERMISSION === 'R'} id="PermissionStatus2" label="In Active" name="PermissionStatus" onClick={event => handleChange(event, 'PermissionStatus')} type="radio" value="N" />
              </div>
            </FormGroup>
            {
            ((Auth && Auth === 'SUPER') || (adminPermission?.PERMISSION !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" disabled={submitDisable || (!Name || !Key)} onClick={Submit}>{button()}</Button>
              </Fragment>
            )
          }
          </Form>
          <div className="form-footer text-center small-text">
            <NavLink to={props?.cancelLink}>Cancel</NavLink>
          </div>
        </section>
      </main>
    </div>
  )
}

AddPermission.propTypes = {
  AddPermissionFunc: PropTypes.func,
  UpdatePermission: PropTypes.func,
  PermissionDetails: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  cancelLink: PropTypes.string
}

export default AddPermission
