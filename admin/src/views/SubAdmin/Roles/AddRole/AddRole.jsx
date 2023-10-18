import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'
import { FormGroup, Label, Input, CustomInput, Row, Col, Card, CardTitle, UncontrolledTooltip, Collapse } from 'reactstrap'
import { useDispatch, useSelector, connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import caretIcon from '../../../../assets/images/caret-top.svg'
import caretBottom from '../../../../assets/images/caret-bottom.svg'
import infoIcon from '../../../../assets/images/info-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getYStatusPermissionList } from '../../../../actions/permission'

const AddRole = forwardRef((props, ref) => {
  const {
    addRoleFunc, updateRoleFunc, roleDetails, setIsEdit, name, setName
  } = props
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [matchPermissions, setMatchPermissions] = useState([])
  const [usersPermissions, setUsersPermissions] = useState([])
  const [settingsPermissions, setSettingsPermissions] = useState([])
  const [subAdminPermissions, setSubAdminPermissions] = useState([])
  const [leaguePermission, setLeaguePermission] = useState([])
  const [otherPermissions, setOtherPermissions] = useState([])
  const [roleStatus, setRoleStatus] = useState('Y')
  const [ErrName, setErrName] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const [roleId, setRoleId] = useState('')
  const [matchPermissionOpen, setMatchPermissionOpen] = useState(false)
  const [userPermissionOpen, setUserPermissionOpen] = useState(false)
  const [settingPermissionOpen, setSettingPermissionOpen] = useState(false)
  const [subAdminPermissionOpen, setSubAdminPermissionOpen] = useState(false)
  const [leaguePermissionOpen, setLeaguePermissionOpen] = useState(false)
  const [otherPermissionOpen, setOpenPermissionOpen] = useState(false)

  const toggleOtherPermission = () => setOpenPermissionOpen(!otherPermissionOpen)
  const toggleLeaguePermission = () => setLeaguePermissionOpen(!leaguePermissionOpen)
  const toggleSubAdminPermission = () => setSubAdminPermissionOpen(!subAdminPermissionOpen)
  const toggleMatchPermissionOpen = () => setMatchPermissionOpen(!matchPermissionOpen)
  const toggleUserPermission = () => setUserPermissionOpen(!userPermissionOpen)
  const toggleSettingPermission = () => setSettingPermissionOpen(!settingPermissionOpen)

  const permissionStatusList = useSelector(state => state?.permission?.permissionStatusList)
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector(state => state?.role?.resStatus)
  const resMessage = useSelector(state => state?.role?.resMessage)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)

  const previousProps = useRef({
    resStatus, resMessage, roleDetails
  })?.current
  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    dispatch(getYStatusPermissionList(token))
    if (id) {
      setRoleId(id)
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
          navigate('/sub-admin/roles', { state: { message: resMessage } })
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

  //  set roleDetails
  useEffect(() => {
    if (previousProps?.roleDetails !== roleDetails) {
      if (roleDetails) {
        setName(roleDetails?.sName)
        setRoleStatus(roleDetails?.eStatus)
        const matchArr = []
        const settingsArr = []
        const usersArr = []
        const subAdminArr = []
        const leagueArr = []
        const othersArr = []
        if (roleDetails?.aPermissions?.length !== 0) {
          roleDetails?.aPermissions?.map((data) => {
            if ((data?.sKey === 'MATCH') || (data?.sKey === 'MATCHLEAGUE') || (data?.sKey === 'SCORE_POINT') || (data?.sKey === 'USERLEAGUE') || (data?.sKey === 'USERTEAM') || (data?.sKey === 'SEASON') || (data.sKey === 'TEAM') || (data?.sKey === 'PLAYER') || (data?.sKey === 'BOT_LOG') || (data?.sKey === 'MATCHPLAYER') || (data?.sKey === 'ROLES') || (data?.sKey === 'BASETEAM')) {
              const obj = {
                sKey: data?.sKey,
                eName: data?.sName,
                eType: data?.eType
              }
              matchArr?.push(obj)
            }
            if ((data?.sKey === 'SPORT') || (data?.sKey === 'PROMO') || (data?.sKey === 'RULE') || (data?.sKey === 'OFFER') || (data?.sKey === 'BANNER') || (data?.sKey === 'PAYOUT_OPTION') || (data?.sKey === 'EMAIL_TEMPLATES') || (data?.sKey === 'POPUP_ADS') || (data?.sKey === 'SETTING') || (data?.sKey === 'VERSION') || (data?.sKey === 'LEADERSHIP_BOARD') || (data?.sKey === 'MAINTENANCE') || (data?.sKey === 'NOTIFICATION') || (data?.sKey === 'PAYMENT_OPTION') || (data?.sKey === 'PAYMENT_OPTION') || (data?.sKey === 'CMS') || (data?.sKey === 'REPORT') || (data?.sKey === 'COMPLAINT')) {
              const obj = {
                sKey: data?.sKey,
                eName: data?.sName,
                eType: data?.eType
              }
              settingsArr?.push(obj)
            }
            if ((data.sKey === 'BANKDETAILS') || (data?.sKey === 'DEPOSIT') || (data?.sKey === 'PUSHNOTIFICATION') || (data?.sKey === 'KYC') || (data?.sKey === 'PASSBOOK') || (data?.sKey === 'PREFERENCES') || (data?.sKey === 'WITHDRAW') || (data?.sKey === 'USERS') || (data?.sKey === 'SYSTEM_USERS') || (data?.sKey === 'STATISTICS') || (data?.sKey === 'TDS') || (data?.sKey === 'BALANCE')) {
              const obj = {
                sKey: data?.sKey,
                eName: data?.sName,
                eType: data?.eType
              }
              usersArr?.push(obj)
            }
            if ((data?.sKey === 'SUBADMIN') || (data?.sKey === 'ADMIN_ROLE')) {
              const obj = {
                sKey: data?.sKey,
                eName: data?.sName,
                eType: data?.eType
              }
              subAdminArr?.push(obj)
            }
            if ((data?.sKey === 'SERIES_LEADERBOARD') || (data?.sKey === 'LEAGUE')) {
              const obj = {
                sKey: data?.sKey,
                eName: data?.sName,
                eType: data?.eType
              }
              leagueArr?.push(obj)
            }
            if ((data.sKey === 'DASHBOARD') || (data.sKey === 'PERMISSION') || (data.sKey === 'MERCHANDISE')) {
              const obj = {
                sKey: data?.sKey,
                eName: data?.sName,
                eType: data?.eType
              }
              othersArr?.push(obj)
            }
            return null
          })
          setMatchPermissions(matchArr)
          setSettingsPermissions(settingsArr)
          setUsersPermissions(usersArr)
          setSubAdminPermissions(subAdminArr)
          setLeaguePermission(leagueArr)
          setOtherPermissions(othersArr)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.roleDetails = roleDetails
    }
  }, [roleDetails])

  //  set permission status list
  useEffect(() => {
    if (permissionStatusList) {
      const matchArr = []
      const settingsArr = []
      const usersArr = []
      const subAdminArr = []
      const leagueArr = []
      const othersArr = []
      if (permissionStatusList.length !== 0 && isCreate) {
        permissionStatusList.map((data) => {
          if ((data?.sKey === 'MATCH') || (data?.sKey === 'MATCHLEAGUE') || (data?.sKey === 'SCORE_POINT') || (data?.sKey === 'USERLEAGUE') || (data?.sKey === 'USERTEAM') || (data?.sKey === 'SEASON') || (data?.sKey === 'TEAM') || (data?.sKey === 'PLAYER') || (data?.sKey === 'BOT_LOG') || (data?.sKey === 'MATCHPLAYER') || (data?.sKey === 'ROLES') || (data?.sKey === 'BASETEAM')) {
            const obj = {
              sKey: data?.sKey,
              eName: data?.sName,
              eType: 'N'
            }
            matchArr.push(obj)
          }
          if ((data?.sKey === 'SPORT') || (data?.sKey === 'PROMO') || (data?.sKey === 'RULE') || (data?.sKey === 'OFFER') || (data?.sKey === 'BANNER') || (data?.sKey === 'PAYOUT_OPTION') || (data?.sKey === 'EMAIL_TEMPLATES') || (data?.sKey === 'POPUP_ADS') || (data?.sKey === 'SETTING') || (data?.sKey === 'VERSION') || (data.sKey === 'LEADERSHIP_BOARD') || (data?.sKey === 'MAINTENANCE') || (data?.sKey === 'NOTIFICATION') || (data?.sKey === 'PAYMENT_OPTION') || (data?.sKey === 'CMS') || (data?.sKey === 'REPORT') || (data?.sKey === 'COMPLAINT')) {
            const obj = {
              sKey: data?.sKey,
              eName: data?.sName,
              eType: 'N'
            }
            settingsArr?.push(obj)
          }
          if ((data?.sKey === 'BANKDETAILS') || (data?.sKey === 'DEPOSIT') || (data?.sKey === 'PUSHNOTIFICATION') || (data?.sKey === 'KYC') || (data?.sKey === 'PASSBOOK') || (data?.sKey === 'PREFERENCES') || (data?.sKey === 'WITHDRAW') || (data?.sKey === 'USERS') || (data?.sKey === 'SYSTEM_USERS') || (data.sKey === 'STATISTICS') || (data?.sKey === 'TDS') || (data?.sKey === 'BALANCE')) {
            const obj = {
              sKey: data?.sKey,
              eName: data?.sName,
              eType: 'N'
            }
            usersArr?.push(obj)
          }
          if ((data?.sKey === 'SUBADMIN') || (data?.sKey === 'ADMIN_ROLE')) {
            const obj = {
              sKey: data?.sKey,
              eName: data?.sName,
              eType: 'N'
            }
            subAdminArr?.push(obj)
          }
          if ((data?.sKey === 'SERIES_LEADERBOARD') || (data?.sKey === 'LEAGUE')) {
            const obj = {
              sKey: data?.sKey,
              eName: data?.sName,
              eType: 'N'
            }
            leagueArr.push(obj)
          }
          if ((data?.sKey === 'DASHBOARD') || (data?.sKey === 'PERMISSION') || (data?.sKey === 'MERCHANDISE')) {
            const obj = {
              sKey: data?.sKey,
              eName: data?.sName,
              eType: 'N'
            }
            othersArr?.push(obj)
          }
          return null
        })
        setMatchPermissions(matchArr)
        setSettingsPermissions(settingsArr)
        setUsersPermissions(usersArr)
        setSubAdminPermissions(subAdminArr)
        setLeaguePermission(leagueArr)
        setOtherPermissions(othersArr)
      }
    }
    return () => {
      previousProps.permissionStatusList = permissionStatusList
    }
  }, [permissionStatusList])

  // for change permission
  function onChangePermission (event, ID, type) {
    if (type === 'MATCH') {
      const arr = [...matchPermissions]
      const index = matchPermissions?.findIndex(data => data?.sKey === ID)
      if (event?.target?.value) {
        arr[index] = { ...arr[index], eType: event?.target?.value }
        setMatchPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setMatchPermissions(arr)
      }
    } else if (type === 'SETTING') {
      const arr = [...settingsPermissions]
      const index = settingsPermissions?.findIndex(data => data?.sKey === ID)
      if (event?.target?.value) {
        arr[index] = { ...arr[index], eType: event?.target?.value }
        setSettingsPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setSettingsPermissions(arr)
      }
    } else if (type === 'USER') {
      const arr = [...usersPermissions]
      const index = usersPermissions?.findIndex(data => data?.sKey === ID)
      if (event?.target?.value) {
        arr[index] = { ...arr[index], eType: event?.target?.value }
        setUsersPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setUsersPermissions(arr)
      }
    } else if (type === 'LEAGUE') {
      const arr = [...leaguePermission]
      const index = leaguePermission?.findIndex(data => data?.sKey === ID)
      if (event?.target?.value) {
        arr[index] = { ...arr[index], eType: event?.target?.value }
        setLeaguePermission(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setLeaguePermission(arr)
      }
    } else if (type === 'SUBADMIN') {
      const arr = [...subAdminPermissions]
      const index = subAdminPermissions?.findIndex(data => data?.sKey === ID)
      if (event?.target?.value) {
        arr[index] = { ...arr[index], eType: event?.target?.value }
        setSubAdminPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setSubAdminPermissions(arr)
      }
    } else if (type === 'OTHER') {
      const arr = [...otherPermissions]
      const index = otherPermissions?.findIndex(data => data?.sKey === ID)
      if (event?.target?.value) {
        arr[index] = { ...arr[index], eType: event?.target?.value }
        setOtherPermissions(arr)
      } else {
        arr[index] = { ...arr[index], eType: 'N' }
        setOtherPermissions(arr)
      }
    }
  }
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
      case 'Status':
        setRoleStatus(event?.target?.value)
        break
      default:
        break
    }
  }

  // for validate the field and dispatch action
  function onSubmit (e) {
    const permissions = []
    matchPermissions?.map((data) => {
      const obj = {
        sKey: data?.sKey,
        eType: data?.eType
      }
      permissions?.push(obj)
      return permissions
    })
    usersPermissions?.map((data) => {
      const obj = {
        sKey: data?.sKey,
        eType: data?.eType
      }
      permissions?.push(obj)
      return permissions
    })
    settingsPermissions?.map((data) => {
      const obj = {
        sKey: data?.sKey,
        eType: data?.eType
      }
      permissions?.push(obj)
      return permissions
    })
    subAdminPermissions?.map((data) => {
      const obj = {
        sKey: data?.sKey,
        eType: data?.eType
      }
      permissions?.push(obj)
      return permissions
    })
    leaguePermission?.map((data) => {
      const obj = {
        sKey: data?.sKey,
        eType: data?.eType
      }
      permissions?.push(obj)
      return permissions
    })
    otherPermissions?.map((data) => {
      const obj = {
        sKey: data?.sKey,
        eType: data?.eType
      }
      permissions?.push(obj)
      return permissions
    })

    const verify = name && permissions && permissions?.length !== 0
    if (verify) {
      if (isCreate) {
        addRoleFunc(name, permissions, roleStatus)
      } else {
        updateRoleFunc(name, permissions, roleStatus, roleId)
      }
      setLoading(true)
    } else {
      if (!verifyLength(name, 1)) {
        setErrName('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

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
        <section className="common-box-subadmin-details">
          <Fragment>
            <div className="common-box-subadmin">
              <Row>
                <Col className='p-0' md={12}>
                  <FormGroup>
                    <Label className='lable-league' for="Name">
                      Role
                      <RequiredField/>
                    </Label>
                    <Input disabled={adminPermission?.ADMIN_ROLE === 'R'} id="Name" onChange={event => handleChange(event, 'Name')} placeholder="Enter Name" type="text" value={name} />
                    <p className="error-text">{ErrName}</p>
                  </FormGroup>
                </Col>
                <Col className='match-details-radio p-0' md={12}>
                  <FormGroup className='radio-div'>
                    <Label className='lable-league' for="status">Status</Label>
                    <div className="d-flex inline-input mt-2">
                      <CustomInput
                        checked={roleStatus === 'Y'}
                        disabled={adminPermission?.ADMIN_ROLE === 'R'}
                        id="roleStatus1"
                        label="Active"
                        name="roleStatus"
                        onClick={event => handleChange(event, 'Status')}
                        type="radio"
                        value="Y"
                      />
                      <CustomInput
                        checked={roleStatus !== 'Y'}
                        disabled={adminPermission?.ADMIN_ROLE === 'R'}
                        id="roleStatus2"
                        label="In Active"
                        name="roleStatus"
                        onClick={event => handleChange(event, 'Status')}
                        type="radio"
                        value="N"
                      />
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </Fragment>

          <Fragment>
            <div className="common-box-subadmin p-0">
              <div className='subadmin-details'>
                <div className="common-item">
                  <h2 className='common-box-header-main p-4'>Permissions</h2>
                  <div className='sub-heading px-4' onClick={toggleMatchPermissionOpen}>
                    <h3 className='common-box-header-second '>
                      Match Related Permissions
                      <img className='custom-info' height='20' id='match' src={infoIcon} width='20' />
                      <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="match">
                        <p className='p-head'>Match Related Permissions</p>
                        <p className='p-body'>
                          To access sports(Cricket, football,..) tab need to give permissions of
                          {matchPermissions && matchPermissions?.length !== 0 && matchPermissions?.map(data => data?.sKey).toString()}
                          ,REPORT,SYSTEM_USERS
                        </p>
                      </UncontrolledTooltip>
                    </h3>
                    <span className='carer-Icons'>
                      <img alt="caret-icon" src={matchPermissionOpen ? caretIcon : caretBottom} />
                    </span>
                  </div>
                  <Collapse isOpen={matchPermissionOpen}>
                    <Row className='sub-admin-row p-4'>
                      {
                      matchPermissions && matchPermissions?.length !== 0 && matchPermissions.map((data) => {
                        return (
                          <Col key={data?.sKey} className='subadmin-switch' md={12} xl={6}>
                            <Card body className='mt-2 card-body-subadmin'>
                              <CardTitle className='card-title-subadmin' tag="h5">{data?.sKey ? data?.sKey : ''}</CardTitle>
                              <div className="d-flex inline-input">
                                <CustomInput
                                  checked={`${data?.eType}` === 'N'}
                                  disabled={adminPermission?.ADMIN_ROLE === 'R'}
                                  id={`${data?.sKey}None`}
                                  label="None"
                                  name={`${data?.sKey}`}
                                  onClick={event => onChangePermission(event, data?.sKey, 'MATCH')}
                                  type="radio"
                                  value="N"
                                />
                                <CustomInput
                                  checked={`${data?.eType}` === 'R'}
                                  disabled={adminPermission?.ADMIN_ROLE === 'R'}
                                  id={`${data?.sKey}Read`}
                                  label="Read"
                                  name={`${data?.sKey}`}
                                  onClick={event => onChangePermission(event, data?.sKey, 'MATCH')}
                                  type="radio"
                                  value="R"
                                />
                                <CustomInput
                                  checked={`${data?.eType}` === 'W'}
                                  disabled={adminPermission?.ADMIN_ROLE === 'R'}
                                  id={`${data?.sKey}Write`}
                                  label="Write"
                                  name={`${data?.sKey}`}
                                  onClick={event => onChangePermission(event, data?.sKey, 'MATCH')}
                                  type="radio"
                                  value="W"
                                />
                              </div>
                            </Card>
                          </Col>
                        )
                      })
                    }
                    </Row>
                  </Collapse>

                  <div className='sub-heading px-4' onClick={toggleUserPermission}>
                    <h3 className=''>
                      User Related Permissions
                      <img className='custom-info' id='user' src={infoIcon} />
                      <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="user">
                        <p className='p-head'>User Related Permissions</p>
                        <p className='p-body'>
                          To access users tab need to give permissions of
                          {usersPermissions && usersPermissions?.length !== 0 && usersPermissions?.map(data => data?.sKey)?.toString()}
                        </p>
                      </UncontrolledTooltip>
                    </h3>
                    <span className='carer-Icons'>
                      <img alt="caret-icon" src={userPermissionOpen ? caretIcon : caretBottom} />
                    </span>
                  </div>
                  <Collapse isOpen={userPermissionOpen}>
                    <Row className='sub-admin-row p-4'>
                      {
                      usersPermissions && usersPermissions?.length !== 0 && usersPermissions.map((data) => {
                        return (
                          <Col key={data?.sKey} className='subadmin-switch' md={12} xl={6}>
                            <Card body className='mt-2 card-body-subadmin'>
                              <CardTitle className='card-title-subadmin' tag="h5">{data?.sKey ? data.sKey : ''}</CardTitle>
                              <div className="d-flex inline-input">
                                <CustomInput checked={`${data?.eType}` === 'N'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}None`} label="None" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'USER')} type="radio" value="N" />
                                <CustomInput checked={`${data?.eType}` === 'R'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Read`} label="Read" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'USER')} type="radio" value="R" />
                                <CustomInput checked={`${data?.eType}` === 'W'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Write`} label="Write" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'USER')} type="radio" value="W" />
                              </div>
                            </Card>
                          </Col>
                        )
                      })
                    }
                    </Row>
                  </Collapse>

                  <div className='sub-heading px-4' onClick={toggleSettingPermission}>
                    <h3 className='common-box-header-second mt-4'>
                      Settings Related Permissions
                      <img className='custom-info' height='20' id='settings' src={infoIcon} width='20' />
                      <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="settings">
                        <p className='p-head'>Settings Related Permissions</p>
                        <p className='p-body'>
                          To access settings tab need to give permissions of
                          {settingsPermissions && settingsPermissions?.length !== 0 && settingsPermissions?.map(data => data?.sKey)?.toString()}
                        </p>
                        <p>Note: For Reports need to give SPORT permission also</p>
                      </UncontrolledTooltip>
                    </h3>
                    <span className='carer-Icons'>
                      <img alt="caret-icon" src={settingPermissionOpen ? caretIcon : caretBottom} />
                    </span>
                  </div>
                  <Collapse isOpen={settingPermissionOpen}>
                    <Row className='sub-admin-row p-4'>
                      {
                      settingsPermissions && settingsPermissions?.length !== 0 && settingsPermissions.map((data) => {
                        return (
                          <Col key={data?.sKey} className='subadmin-switch' md={12} xl={6}>
                            <Card body className='mt-2 card-body-subadmin'>
                              <CardTitle className='card-title-subadmin' tag="h5">{data?.sKey ? data?.sKey : ''}</CardTitle>
                              <div className="d-flex inline-input">
                                <CustomInput checked={`${data?.eType}` === 'N'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}None`} label="None" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'SETTING')} type="radio" value="N" />
                                <CustomInput checked={`${data?.eType}` === 'R'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Read`} label="Read" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'SETTING')} type="radio" value="R" />
                                <CustomInput checked={`${data?.eType}` === 'W'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Write`} label="Write" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'SETTING')} type="radio" value="W" />
                              </div>
                            </Card>
                          </Col>
                        )
                      })
                    }
                    </Row>
                  </Collapse>

                  <div className='sub-heading px-4' onClick={toggleSubAdminPermission}>
                    <h3 className='common-box-header-second mt-4'>
                      Sub-Admin Related Permissions
                      <img className='custom-info' height='20' id='subadmin' src={infoIcon} width='20' />
                      <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="subadmin">
                        <p className='p-head'>Sub-Admin Related Permissions</p>
                        <p className='p-body'>
                          To access Sub-Admin tab need to give permissions of
                          {subAdminPermissions && subAdminPermissions?.length !== 0 && subAdminPermissions?.map(data => data?.sKey)?.toString()}
                        </p>
                      </UncontrolledTooltip>
                    </h3>
                    <span className='carer-Icons'>
                      <img alt="caret-icon" src={subAdminPermissionOpen ? caretIcon : caretBottom} />
                    </span>
                  </div>
                  <Collapse isOpen={subAdminPermissionOpen}>
                    <Row className='sub-admin-row p-4'>
                      {
                      subAdminPermissions && subAdminPermissions?.length !== 0 && subAdminPermissions.map((data) => {
                        return (
                          <Col key={data.sKey} className='subadmin-switch' md={12} xl={6}>
                            <Card body className='mt-2 card-body-subadmin'>
                              <CardTitle className='card-title-subadmin' tag="h5">{data?.sKey ? data?.sKey : ''}</CardTitle>
                              <div className="d-flex inline-input">
                                <CustomInput checked={`${data?.eType}` === 'N'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}None`} label="None" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'SUBADMIN')} type="radio" value="N" />
                                <CustomInput checked={`${data?.eType}` === 'R'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Read`} label="Read" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'SUBADMIN')} type="radio" value="R" />
                                <CustomInput checked={`${data?.eType}` === 'W'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Write`} label="Write" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'SUBADMIN')} type="radio" value="W" />
                              </div>
                            </Card>
                          </Col>
                        )
                      })
                    }
                    </Row>
                  </Collapse>

                  <div className='sub-heading px-4' onClick={toggleLeaguePermission}>
                    <h3 className='common-box-header-second mt-4'>
                      League and Series Related Permissions
                      <img className='custom-info' height='20' id='league' src={infoIcon} width='20' />
                      <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="league">
                        <p className='p-head'>League and Series Related Permissions</p>
                        <p className='p-body'>
                          To access League and Series LeaderBoard tab need to give permissions of
                          {leaguePermission && leaguePermission?.length !== 0 && leaguePermission?.map(data => data?.sKey)?.toString()}
                        </p>
                      </UncontrolledTooltip>
                    </h3>
                    <span className='carer-Icons'>
                      <img alt="caret-icon" src={leaguePermissionOpen ? caretIcon : caretBottom} />
                    </span>
                  </div>
                  <Collapse isOpen={leaguePermissionOpen}>
                    <Row className='sub-admin-row p-4' >
                      {
                      leaguePermission && leaguePermission?.length !== 0 && leaguePermission.map((data) => {
                        return (
                          <Col key={data.sKey} className='subadmin-switch' md={12} xl={6}>
                            <Card body className='mt-2 card-body-subadmin'>
                              <CardTitle className='card-title-subadmin' tag="h5">{data?.sKey ? data.sKey : ''}</CardTitle>
                              <div className="d-flex inline-input">
                                <CustomInput checked={`${data?.eType}` === 'N'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}None`} label="None" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'LEAGUE')} type="radio" value="N" />
                                <CustomInput checked={`${data?.eType}` === 'R'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Read`} label="Read" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'LEAGUE')} type="radio" value="R" />
                                <CustomInput checked={`${data?.eType}` === 'W'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Write`} label="Write" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'LEAGUE')} type="radio" value="W" />
                              </div>
                            </Card>
                          </Col>
                        )
                      })
                    }
                    </Row>
                  </Collapse>

                  <div className='sub-heading px-4' onClick={toggleOtherPermission}>
                    <h3 className='common-box-header-second mt-4'>Other</h3>
                    <span className='carer-Icons'>
                      <img alt="caret-icon" src={otherPermissionOpen ? caretIcon : caretBottom} />
                    </span>
                  </div>
                  <Collapse isOpen={otherPermissionOpen}>
                    <Row className='sub-admin-row p-4'>
                      {
                      otherPermissions && otherPermissions?.length !== 0 && otherPermissions.map((data) => {
                        return (
                          <Col key={data.sKey} className='subadmin-switch' md={12} xl={6}>
                            <Card body className='mt-2 card-body-subadmin'>
                              <CardTitle className='card-title-subadmin' tag="h5">{data?.sKey ? data?.sKey : ''}</CardTitle>
                              <div className="d-flex inline-input">
                                <CustomInput checked={`${data?.eType}` === 'N'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}None`} label="None" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'OTHER')} type="radio" value="N" />
                                <CustomInput checked={`${data?.eType}` === 'R'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Read`} label="Read" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'OTHER')} type="radio" value="R" />
                                <CustomInput checked={`${data?.eType}` === 'W'} disabled={adminPermission?.ADMIN_ROLE === 'R'} id={`${data?.sKey}Write`} label="Write" name={`${data?.sKey}`} onClick={event => onChangePermission(event, data?.sKey, 'OTHER')} type="radio" value="W" />
                              </div>
                            </Card>
                          </Col>
                        )
                      })
                    }
                    </Row>
                  </Collapse>

                </div>
              </div>
            </div>
          </Fragment>
        </section>
      </main>
    </div>
  )
})

AddRole.propTypes = {
  addRoleFunc: PropTypes.func,
  updateRoleFunc: PropTypes.func,
  roleDetails: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  cancelLink: PropTypes.string,
  setIsEdit: PropTypes.func,
  name: PropTypes.string,
  setName: PropTypes.func
}

AddRole.displayName = AddRole
export default connect(null, null, null, { forwardRef: true })(AddRole)
