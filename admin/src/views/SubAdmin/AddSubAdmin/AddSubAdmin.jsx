import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { FormGroup, Input, Label, CustomInput, Form, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import PropTypes from 'prop-types'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import RequiredField from '../../../components/RequiredField'

import { verifyEmail, verifyPassword, verifyLength, verifyMobileNumber, isNumber, modalMessageFunc, verifyLengthUserName, verifySpecialCharacter, verifySpecialCharacterInput } from '../../../helpers/helper'
import { geActiveRolesList } from '../../../actions/role'

const animatedComponents = makeAnimated()
const AddSubAdminForm = forwardRef((props, ref) => {
  const {
    SubAdminDetails,
    // match,
    addSubAdmin,
    updateSubAdmin,
    setSubmitDisableButton,
    setIsEdit
  } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [MobNum, setMobNum] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState([])
  const [options, setOptions] = useState([])
  const [selectedRole, setSelectedRole] = useState([])
  const [subAdminStatus, setSubAdminStatus] = useState('Y')
  const [errUsername, setErrUsername] = useState('')
  const [errFullname, setErrFullname] = useState('')
  const [roleErr, setRoleErr] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [errEmail, setErrEmail] = useState('')
  const [errMobNum, setErrMobNum] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [close, setClose] = useState(false)
  const [SubAdminId, setSubAdminId] = useState('')

  const activeRolesList = useSelector(state => state?.role?.activeRolesList)
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector(state => state?.subadmin?.resStatus)
  const resMessage = useSelector(state => state?.subadmin?.resMessage)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)

  const previousProps = useRef({
    resStatus, resMessage, SubAdminDetails
  })?.current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const updateDisable = SubAdminDetails && previousProps?.SubAdminDetails !== SubAdminDetails && SubAdminDetails?.sName === fullname && SubAdminDetails?.sUsername === username &&
                        SubAdminDetails?.sEmail === email && SubAdminDetails?.sMobNum === MobNum && SubAdminDetails?.eStatus === subAdminStatus && SubAdminDetails?.aRole === role &&
                        SubAdminDetails?.sPassword === password

  useEffect(() => {
    if (id) {
      setSubAdminId(id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    dispatch(geActiveRolesList(token))
  }, [])

  useEffect(() => {
    if (activeRolesList) {
      const arr = []
      if (activeRolesList?.length !== 0) {
        activeRolesList?.map((data) => {
          const obj = {
            value: data?._id,
            label: data?.sName
          }
          arr?.push(obj)
          return arr
        })
        setOptions(arr)
      }
    }
  }, [activeRolesList])

  //  set SubAdminDetails
  useEffect(() => {
    if (previousProps?.SubAdminDetails !== SubAdminDetails) {
      if (SubAdminDetails) {
        const arr = [...role]
        SubAdminDetails?.aRole?.map((item) => {
          const obj = {
            value: item?._id,
            label: item?.sName
          }
          arr.push(obj)
          return arr
        })
        setUsername(SubAdminDetails?.sUsername ? SubAdminDetails?.sUsername : '')
        setFullname(SubAdminDetails?.sName ? SubAdminDetails?.sName : '')
        setEmail(SubAdminDetails?.sEmail ? SubAdminDetails?.sEmail : '')
        setMobNum(SubAdminDetails?.sMobNum ? SubAdminDetails?.sMobNum : '')
        setRole(arr)
        setSelectedRole(arr)
        setSubAdminStatus(SubAdminDetails?.eStatus ? SubAdminDetails?.eStatus : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.SubAdminDetails = SubAdminDetails
    }
  }, [SubAdminDetails])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    setSubmitDisableButton(updateDisable)
  }, [updateDisable])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          navigate('/sub-admin', { state: { message: resMessage } })
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

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Username':
        if (!event?.target?.value) {
          setErrUsername('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          setErrUsername('No Initial Space Allowed')
        } else if (!verifySpecialCharacterInput(event?.target?.value)) {
          setErrUsername('Special Characters Are Not Allowed')
        } else if ((verifyLength(event?.target?.value, 1) && event?.target?.value?.length <= 16)) {
          setErrUsername('')
        } else if (event.target.value.length >= 16) {
          setErrUsername('Please enter a Username between 1 and 16 characters')
        }
        setUsername(event.target.value.trimStart())
        break
      case 'Fullname':
        if (!event?.target?.value) {
          setErrFullname('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          setErrFullname('No Initial Space Allowed')
        } else if (!verifySpecialCharacterInput(event?.target?.value)) {
          setErrFullname('Special Characters Are Not Allowed')
        } else if ((verifyLength(event?.target?.value, 1) && event?.target?.value?.length <= 16)) {
          setErrFullname('')
        } else if (event?.target?.value?.length >= 16) {
          setErrFullname('Please enter a Fullname between 1 and 16 characters')
        }
        if (isNumber(event?.target?.value)) {
          setErrFullname('Name must be alphanumeric')
        }
        setFullname(event.target.value.trimStart())
        break
      case 'Email':
        if (verifyLength(event?.target?.value, 1) && verifyEmail(event?.target?.value)) {
          setErrEmail('')
        } else if (!verifyLength(event?.target?.value, 1)) {
          setErrEmail('Required field')
        } else {
          setErrEmail('Invalid email')
        }
        setEmail(event?.target?.value)
        break
      case 'MobileNum':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (verifyMobileNumber(event?.target?.value)) {
            setErrMobNum('')
          } else {
            setErrMobNum('Must contain 10 digits')
          }
          setMobNum(event?.target?.value)
        }
        break
      case 'Password':
        if (verifyPassword(event?.target?.value)) {
          setErrPassword('')
        } else {
          setErrPassword('Must contain minimum 5 characters and maximum 14 characters')
        }
        setPassword(event?.target?.value)
        break
      // case 'Role':
      //   if (!verifyLength(event.target.value, 1)) {
      //     setRoleErr('Required field')
      //   } else {
      //     setRoleErr('')
      //   }
      //   setRole(event.target.value)
      //   break
      case 'Status':
        setSubAdminStatus(event?.target?.value)
        break
      default:
        break
    }
  }

  function onHandleChange (selected) {
    if (selected) {
      setSelectedRole(selected)
      if (selected?.length >= 1) {
        setRoleErr('')
      } else {
        setRoleErr('Required field')
      }
      setRole(selected)
    } else {
      setRole([])
    }
  }

  // for validate the field and dispatch action
  function onSubmit (e) {
    const addValidation = verifySpecialCharacter(username) && verifyLengthUserName(username, 1) && verifyLength(password, 1) && verifySpecialCharacter(fullname) && verifyLengthUserName(fullname, 1) && verifyLength(email, 1) && verifyLength(MobNum, 1) && verifyLength(role, 1) && !errUsername && !errFullname && !errEmail && !roleErr && !errPassword
    const updateValidation = verifyLength(username, 1) && verifyLength(fullname, 1) && verifyLength(email, 1) && verifyLength(MobNum, 1) && verifyLength(role, 1) && !errUsername && !errFullname && !errEmail && !roleErr
    const validate = isCreate ? addValidation : updateValidation

    if (validate) {
      setLoading(true)
      const selected = []
      selectedRole?.map((data) => {
        selected?.push(data?.value)
        return selected
      })
      if (isCreate) {
        addSubAdmin(fullname, username, email, MobNum, password, selected, subAdminStatus)
      } else {
        updateSubAdmin(fullname, username, email, MobNum, password, selected, SubAdminId, subAdminStatus)
      }
      setLoading(true)
    } else {
      if (!verifyLength(username, 1)) {
        setErrUsername('Required field')
      } else if (!verifySpecialCharacter(username)) {
        setErrUsername('Special Characters Are Not Allowed')
      }
      if (!verifyLength(fullname, 1)) {
        setErrFullname('Required field')
      } else if (!verifySpecialCharacter(fullname)) {
        setErrFullname('Special Characters Are Not Allowed')
      }
      if (!verifyLength(email, 1)) {
        setErrEmail('Required field')
      }
      if (!verifyLength(MobNum, 1)) {
        setErrMobNum('Required field')
      }
      if (isCreate && (!verifyLength(password, 1))) {
        setErrPassword('Required field')
      }
      if (!verifyLength(role, 1)) {
        setRoleErr('Required field')
      }
    }
  }
  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  return (
    <main className="main-content">
      <section className="common-detail">
        <AlertMessage
          close={close}
          message={message}
          modalMessage={modalMessage}
          status={status}
        />

        {loading && <Loading />}
        <section className="common-form-block">
          <div className='d-flex inline-input' />
          <Form>
            <Row>
              <Col md={12} xl={6}>
                <FormGroup>
                  <Label for="Username">
                    Username
                    <RequiredField/>
                  </Label>
                  <Input className={errUsername ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.SUBADMIN === 'R'} id="Username" onChange={event => handleChange(event, 'Username')} placeholder="Enter Username" type="text" value={username} />
                  <p className="error-text">{errUsername}</p>
                </FormGroup>
              </Col>
              <Col md={12} xl={6}>
                <FormGroup>
                  <Label for="fullName">
                    Full Name
                    <RequiredField/>
                  </Label>
                  <Input className={errFullname ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.SUBADMIN === 'R'} id="fullName" onChange={event => handleChange(event, 'Fullname')} placeholder="Enter Full Name" type="text" value={fullname} />
                  <p className="error-text">{errFullname}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={6}>
                <FormGroup>
                  <Label for="emailAddress">
                    Email Address
                    <RequiredField/>
                  </Label>
                  <Input className={errEmail ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.SUBADMIN === 'R'} id="emailAddress" onChange={event => handleChange(event, 'Email')} placeholder="Enter Email Address" type="email" value={email} />
                  <p className="error-text">{errEmail}</p>
                </FormGroup>
              </Col>
              <Col md={12} xl={6}>
                <FormGroup>
                  <Label for="Password">
                    Password
                    {isCreate ? (<RequiredField/>) : ''}
                  </Label>
                  <Input className={errPassword ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.SUBADMIN === 'R'} id="Password" onChange={event => handleChange(event, 'Password')} placeholder="Enter Password" type="password" value={password} />
                  <p className="error-text">{errPassword}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label for="phoneNumber">
                    Mobile Number
                    <RequiredField/>
                  </Label>
                  <Input className={errMobNum ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.SUBADMIN === 'R'} id="phoneNumber" onChange={event => handleChange(event, 'MobileNum')} placeholder="Enter Mobile Number" type="tel" value={MobNum} />
                  <p className="error-text">{errMobNum}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='mt-3'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label>
                    Role
                    <RequiredField/>
                  </Label>
                  <Select
                    captureMenuScroll={true}
                    className={roleErr ? 'league-placeholder-error' : 'subAdmin-log'}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    id="SportsType"
                    isMulti={true}
                    menuPlacement="auto"
                    menuPosition="fixed"
                    name="SportsType"
                    onChange={selected => onHandleChange(selected)}
                    options={options}
                    placeholder="Select Roles"
                    value={role}
                  />
                  <p className="error-text">{roleErr}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className=' p-3 mt-2'>
              <div className='radio-button-div'>
                <Col md={12} xl={12}>
                  <FormGroup>
                    <Label for="status">Status</Label>
                    <div className="d-flex inline-input mt-2">
                      <CustomInput
                        checked={subAdminStatus === 'Y'}
                        disabled={adminPermission?.SUBADMIN === 'R'}
                        id="subAdminStatus1"
                        label="Active"
                        name="subAdminStatus"
                        onClick={event => handleChange(event, 'Status')}
                        type="radio"
                        value="Y"
                      />
                      <CustomInput
                        checked={subAdminStatus !== 'Y'}
                        disabled={adminPermission?.SUBADMIN === 'R'}
                        id="subAdminStatus3"
                        label="Block"
                        name="subAdminStatus"
                        onClick={event => handleChange(event, 'Status')}
                        type="radio"
                        value="B"
                      />
                    </div>
                  </FormGroup>
                </Col>
              </div>
            </Row>
          </Form>
        </section>
      </section>
    </main>
  )
})

AddSubAdminForm.propTypes = {
  cancelLink: PropTypes.string,
  SubAdminDetails: PropTypes.object,
  match: PropTypes.object,
  addSubAdmin: PropTypes.func,
  updateSubAdmin: PropTypes.func,
  history: PropTypes.object,
  setSubmitDisableButton: PropTypes.func,
  setIsEdit: PropTypes.func

}
AddSubAdminForm.displayName = AddSubAdminForm
export default connect(null, null, null, { forwardRef: true })(AddSubAdminForm)
