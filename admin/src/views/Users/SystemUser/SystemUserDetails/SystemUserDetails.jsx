/* eslint-disable no-unused-vars */
import React, { Fragment, forwardRef, useEffect, useRef, useState, useImperativeHandle } from 'react'
import { Button, Col, CustomInput, FormGroup, Input, InputGroupText, Label, Row, Collapse } from 'reactstrap'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useDispatch, useSelector, connect } from 'react-redux'
import Select from 'react-select'
import moment from 'moment'
import PropTypes from 'prop-types'

import profilePicture from '../../../../assets/images/upload-icon.svg'
import pencilIcon from '../../../../assets/images/pencil-line.svg'
import caretIcon from '../../../../assets/images/caret-bottom.svg'
import caretBottom from '../../../../assets/images/caret-top.svg'
import rightIcon from '../../../../assets/images/verify.svg'
import removeImg from '../../../../assets/images/ep-close.svg'
import closeIcon from '../../../../assets/images/red-close-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import { states, cities } from '../../../../helpers/country'
import { acceptFormat, isNumber, isPositive, modalMessageFunc, verifyEmail, verifyLength, verifyMobileNumber } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import { getSystemUserDetails } from '../../../../actions/systemusers'
import { addAdminDeposit, addAdminWithdraw, getBalanceDetails, getStates, updateUserDetails } from '../../../../actions/users'

const SystemUserDetails = forwardRef((props, ref) => {
  const { id } = useParams()
  const location = useLocation()
  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [userName, setUsername] = useState('')
  const [fullname, setFullname] = useState('')
  const [ErrFullName, setErrFullName] = useState('')
  const [email, setEmail] = useState('')
  const [State, setState] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState(0)
  const [MobNum, setMobNum] = useState(0)
  const [errEmail, setErrEmail] = useState('')
  const [errMobNum, setErrMobNum] = useState('')
  const [bankInformation, setBankInformation] = useState('')
  const [cash, setCash] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [MobNumVerified, setMobNumVerified] = useState(false)
  const [emailVerified, setemailVerified] = useState(false)
  const [Cancel, setCancel] = useState(false)
  const [status, setStatus] = useState(false)
  const [birthdate, setBirthdate] = useState('')
  const [birthDateErr, setBirthDateErr] = useState('')
  const [gender, setGender] = useState('')
  const [propic, setproPic] = useState('')
  const [userStatus, setUserStatus] = useState('')
  const [balance, setBalance] = useState('deposit')
  const [balanceType, setBalanceType] = useState('cash')
  const [DepositPassword, setDepositPassword] = useState('')
  const [ErrDepositPassword, setErrDepositPassword] = useState('')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')
  const [isEditUserDetails, setEditUserDetails] = useState(false)
  const [isEditAdminDeposit, setEditAdminDeposit] = useState(false)
  const [isEditAdminWithdraw, setEditAdminWithdraw] = useState(false)
  const [errCash, setErrCash] = useState('')
  const [errBonus, setErrBonus] = useState('')
  const [errImage, setErrImage] = useState('')
  const [withdrawType, setWithdrawType] = useState('withdraw')
  const [amount, setAmount] = useState(0)
  const [WithDrawPassword, setWithDrawPassword] = useState('')
  const [ErrWithdrawPassword, setErrWithdrawPassword] = useState('')
  const [errAmount, setErrAmount] = useState('')
  const [openCashModal, setOpenCashModal] = useState(true)
  const toggleCashModal = () => setOpenCashModal(!openCashModal)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const systemUserResStatus = useSelector(state => state.systemusers.resStatus)
  const systemUseResMessage = useSelector(state => state.systemusers.resMessage)
  const resStatus = useSelector(state => state.users.resStatus)
  const resMessage = useSelector(state => state.users.resMessage)
  const actionType = useSelector(state => state.users.type)
  const systemUserDetails = useSelector(state => state.systemusers.systemUserDetails)
  const BalanceDetails = useSelector(state => state.users.balanceDetails)
  const stateList = useSelector(state => state.users.stateList)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const [modalMessage, setModalMessage] = useState(false)
  const withdrawPermission = adminPermission?.WITHDRAWs
  const previousProps = useRef({
    resStatus, resMessage, systemUserDetails, BalanceDetails, stateList, State, systemUseResMessage, systemUserResStatus
  }).current

  useEffect(() => {
    if (id) {
      if ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) {
        dispatch(getSystemUserDetails(id, token))
        dispatch(getStates(token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) {
        dispatch(getBalanceDetails(id, token))
      }
    }
    dispatch(getUrl('media'))
    setLoading(true)
  }, [])

  // set states list
  useEffect(() => {
    if (states) {
      const arr = []
      states.forEach(data => {
        const obj = {
          label: data.state_name,
          value: data.id
        }
        arr.push(obj)
      })
      setStateOptions(arr)
    }
  }, [states])

  // use effect to set State filter list
  useEffect(() => {
    if (previousProps.State !== State) {
      const arr = cities.filter(data => State.value === data.state_id)
      const cityOps = []
      arr.forEach(data => {
        const obj = {
          label: data.city_name,
          value: data.id
        }
        cityOps.push(obj)
      })
      setCityOptions(cityOps)
    }
    return () => {
      previousProps.State = State
    }
  }, [State])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // use effect to handle setLoading
  useEffect(() => {
    if (previousProps.systemUserDetails !== systemUserDetails && previousProps.BalanceDetails !== BalanceDetails) {
      setLoading(false)
    } else if ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE === 'N') || (Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'N')) {
      setLoading(false)
    }
  }, [systemUserDetails, BalanceDetails])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setStatus(resStatus)
          if (actionType === 'UPDATE_USER_DETAILS') {
            setEditUserDetails(false)
          } else if (actionType === 'ADD_USER_DEPOSIT') {
            setEditAdminDeposit(false)
          } else if (actionType === 'ADD_USER_WITHDRAW') {
            setEditAdminWithdraw(false)
          }
        }
        setMessage(resMessage)
        setModalMessage(true)
        setLoading(false)
        dispatch(getBalanceDetails(id, token))
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // use effect set systemUserDetails
  useEffect(() => {
    if (previousProps.systemUserDetails !== systemUserDetails || (!systemUserResStatus && systemUseResMessage) || Cancel) {
      if (systemUserDetails) {
        setEmail(systemUserDetails.sEmail)
        setUsername(systemUserDetails.sUsername)
        setFullname(systemUserDetails.sName)
        setMobNum(systemUserDetails.sMobNum)
        setMobNumVerified(systemUserDetails.bIsMobVerified)
        setemailVerified(systemUserDetails.bIsEmailVerified)
        setproPic(systemUserDetails.sProPic)
        setGender(systemUserDetails.eGender)
        setBirthdate(systemUserDetails.dDob)
        setAddress(systemUserDetails.sAddress)
        setCity(systemUserDetails.iCityId ? { label: systemUserDetails.iCityId, value: '' } : '')
        setPincode(systemUserDetails.nPinCode)
        setState(systemUserDetails.iStateId ? { label: systemUserDetails.iStateId, value: '' } : '')
        setUserStatus(systemUserDetails.eStatus)
        setCancel(false)
      }
    }
    return () => {
      previousProps.systemUserDetails = systemUserDetails
    }
  }, [systemUserDetails, systemUseResMessage, systemUserResStatus, Cancel])

  // use effect set BalanceDetails
  useEffect(() => {
    if (previousProps.BalanceDetails !== BalanceDetails) {
      if (BalanceDetails) {
        setBankInformation({
          ...bankInformation,
          nTotalBonus: BalanceDetails.nTotalBonusEarned ? BalanceDetails.nTotalBonusEarned.toFixed(2) : 0,
          nTotalWin: BalanceDetails.nTotalWinningAmount ? BalanceDetails.nTotalWinningAmount.toFixed(2) : 0,
          nTotalCashPlay: BalanceDetails.nTotalPlayCash ? BalanceDetails.nTotalPlayCash.toFixed(2) : 0,
          nTotalDeposit: BalanceDetails.nTotalDepositAmount ? BalanceDetails.nTotalDepositAmount.toFixed(2) : 0,
          nCurrentBonus: BalanceDetails.nCurrentBonus ? BalanceDetails.nCurrentBonus.toFixed(2) : 0,
          nCurrentCash: BalanceDetails.nCurrentTotalBalance ? BalanceDetails.nCurrentTotalBalance.toFixed(2) : 0,
          nDeposit: BalanceDetails.nCurrentDepositBalance ? BalanceDetails.nCurrentDepositBalance.toFixed(2) : 0,
          nWinnings: BalanceDetails.nCurrentWinningBalance ? BalanceDetails.nCurrentWinningBalance.toFixed(2) : 0
        })
      }
    }
    return () => {
      previousProps.BalanceDetails = BalanceDetails
    }
  }, [BalanceDetails])

  // handleChange function to handle onChange event
  function handleChange (event, eType) {
    switch (eType) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrFullName('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrFullName('Required field')
        }
        setFullname(event.target.value)
        break
      case 'Email':
        if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value)) {
          setErrEmail('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrEmail('Required field')
        } else {
          setErrEmail('Enter a valid Email')
        }
        setEmail(event.target.value)
        break
      case 'MobNum':
        if (!event.target.value) {
          setErrMobNum('Required field')
        } else if (verifyMobileNumber(event.target.value)) {
          setErrMobNum('')
        } else if (!isNumber(event.target.value)) {
          setErrMobNum('Must be numbers')
        } else if (!verifyMobileNumber(event.target.value)) {
          setErrMobNum('Must be 10 digits')
        }
        setMobNum(event.target.value)
        break
      case 'Address':
        setAddress(event.target.value)
        break
      case 'City':
        setCity(event)
        break
      case 'Pincode':
        if (isNumber(event.target.value) || (!event.target.value)) {
          setPincode(event.target.value)
        }
        break
      case 'State':
        setState(event)
        setCity('')
        break
      case 'Gender':
        setGender(event.target.value)
        break
      case 'UserStatus':
        setUserStatus(event.target.value)
        break
      case 'Birthdate':
        if (moment(event.target.value).isAfter(moment())) {
          setBirthDateErr('Date should not be future date')
        } else if (moment().subtract('years', 18).isBefore(event.target.value)) {
          setBirthDateErr('User must be greater or equal to 18 years old')
        } else if (!verifyLength(moment(event.target.value).format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setBirthDateErr('Required field')
        } else {
          setBirthDateErr('')
        }
        setBirthdate(event.target.value)
        break
      case 'Status':
        setStatus(event.target.value === 'true')
        break
      case 'Balance':
        setBalance(event.target.value)
        break
      case 'Deposit_Type':
        setBalanceType(event.target.value)
        break
      case 'ProPic':
        if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0]) {
          setproPic({ imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'Cash':
        if (isNumber(event.target.value) && isPositive(event.target.value)) {
          setErrCash('')
        } else {
          setErrCash('Required field')
        }
        setCash(event.target.value)
        break
      case 'Bonus':
        if (isNumber(event.target.value) && isPositive(event.target.value)) {
          setErrBonus('')
        } else {
          setErrBonus('Required field')
        }
        setBonus(event.target.value)
        break
      case 'DepositPassword':
        if (verifyLength(event.target.value, 1)) {
          setErrDepositPassword('')
        } else {
          setErrDepositPassword('Required field')
        }
        setDepositPassword(event.target.value)
        break
      case 'WithdrawType':
        setWithdrawType(event.target.value)
        break
      case 'Amount':
        if (isNumber(event.target.value) && isPositive(event.target.value)) {
          setErrAmount('')
        } else {
          setErrAmount('Required field')
        }
        setAmount(event.target.value)
        break
      case 'WithdrawPassword':
        if (verifyLength(event.target.value, 1)) {
          setErrWithdrawPassword('')
        } else {
          setErrWithdrawPassword('Required field')
        }
        setWithDrawPassword(event.target.value)
        break
      case 'RemovePANImage':
        setproPic('')
        break
      default:
        break
    }
  }

  // function to changeProfileDetails
  function changeProfileData () {
    if (verifyEmail(email) && isNumber(MobNum) && !birthDateErr) {
      const updateUserData = {
        fullname, ID: id, propic, email, MobNum, gender, birthdate, address, city: city.value, pincode, State: State.value, userStatus, token
      }
      dispatch(updateUserDetails(updateUserData))
      setLoading(true)
    } else {
      if (!email) {
        setErrEmail('Required field')
      } else if (!verifyEmail(email)) {
        setErrEmail('Enter Proper Email')
      }
      if (MobNum.length !== 10) {
        setErrMobNum('Number must be 10 digits')
      }
      if (!MobNum) {
        setErrMobNum('Required field')
      } else if (!isNumber(MobNum)) {
        setErrMobNum('Enter only numbers')
      }
    }
  }

  function addAdminDepo () {
    if (isNumber(cash) && isNumber(bonus) && verifyLength(DepositPassword, 1)) {
      dispatch(addAdminDeposit(id, balance, balanceType, cash, bonus, DepositPassword, token))
      setBalance('deposit')
      setBalanceType('cash')
      setCash(0)
      setBonus(0)
      setDepositPassword('')
      setLoading(true)
    } else {
      if (!isNumber(cash)) {
        setErrCash('Required field')
      }
      if (!isNumber(bonus)) {
        setErrBonus('Required field')
      }
      if (!verifyLength(DepositPassword, 1)) {
        setErrDepositPassword('Required field')
      }
    }
  }

  function funcAddAdminWithdraw () {
    if (isNumber(amount) && verifyLength(WithDrawPassword, 1)) {
      dispatch(addAdminWithdraw(id, withdrawType, amount, WithDrawPassword, token))
      setWithdrawType('withdraw')
      setAmount(0)
      setWithDrawPassword('')
      setLoading(true)
    } else {
      if (!isNumber(amount)) {
        setErrAmount('Required field')
      }
      if (!verifyLength(WithDrawPassword, 1)) {
        setErrWithdrawPassword('Required field')
      }
    }
  }

  function onEditUserDetails () {
    if (!isEditUserDetails) {
      setEditUserDetails(true)
    }
  }

  function onEditAdminDeposit () {
    if (!isEditAdminDeposit) {
      setEditAdminDeposit(true)
    }
  }

  function onEditAdminWithdraw () {
    if (!isEditAdminWithdraw) {
      setEditAdminWithdraw(true)
    }
  }

  function cancelFunc (type) {
    if (type === 'profile') {
      setEditUserDetails(false)
      setErrEmail('')
      setErrMobNum('')
      setErrFullName('')
      setErrImage('')
    } else if (type === 'admin_deposit') {
      setEditAdminDeposit(false)
      setCash('')
      setBonus('')
      setDepositPassword('')
      setErrCash('')
      setErrBonus('')
      setErrDepositPassword('')
    } else if (type === 'admin_withdraw') {
      setEditAdminWithdraw(false)
      setAmount('')
      setWithDrawPassword('')
      setErrAmount('')
      setErrWithdrawPassword('')
    }
    setCancel(true)
  }

  function onRefresh () {
    dispatch(getSystemUserDetails(id, token))
    dispatch(getBalanceDetails(id, token))
    dispatch(getUrl('media'))
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))
  return (
    <>
      {loading && <Loading />}
      <main className="main-content d-flex">
        <AlertMessage
          close={close}
          message={message}
          modalMessage={modalMessage}
          status={status}
        />
        <section className="user-section">
          <Row className='p-4'>
            <Col className='p-0' lg={8} xl={8} md={12}>
              <div className='common-box-user'>
                <div className="float-center table-responsive-user">
                  <table className='table-systemUser text-center'>
                    <tbody>
                      <tr>
                        <th>Team Name</th>
                        <th >Mobile Verified?</th>
                        <th >Email Verified?</th>
                      </tr>
                      <tr>
                        <td>{userName}</td>
                        <td>
                          {MobNumVerified ? 'Yes' : 'No'}
                          {' '}
                          {MobNumVerified && <img alt="" src={rightIcon} />}
                        </td>
                        <td>
                          {emailVerified ? 'Yes' : 'No'}
                          {' '}
                          {emailVerified && <img alt="" src={rightIcon} />}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) &&
                (
                  <Fragment>
                    <div className="common-box-user">
                      <div className="align-items-start user-heading" onClick={() => toggleCashModal()}>
                        <h3>Cash/ Bonus Information</h3>
                        <div className='d-flex'>
                          <Button className='cash-bonus-button' state= {{ ...location.state, systemUserToPassbook: true, id: id }} tag={Link} to={{ pathname: '/users/passbook', search: `?searchValue=${id}` }}>Show Users Transactions </Button>
                          <span className='ml-3'>
                            <img alt="" src={openCashModal ? caretBottom : caretIcon} />
                            {' '}
                          </span>
                        </div>
                      </div>
                      <Collapse isOpen={openCashModal}>
                        <Row className='p-4'>
                          <Col className='pl-0' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="CurrentBonus">Available Bonus</Label>
                              <InputGroupText>{bankInformation.nCurrentBonus}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col className='pr-0' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="totalWon">Total Bonus</Label>
                              <InputGroupText>{bankInformation.nTotalBonus}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col className='pl-0 mt-3' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="winnings">Available Winnings</Label>
                              <InputGroupText>{bankInformation.nWinnings}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col className='pr-0 mt-3' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="totalWin">Total Winnings</Label>
                              <InputGroupText>{bankInformation.nTotalWin}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col className='pl-0 mt-3' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="Deposit">Available Deposit </Label>
                              <InputGroupText>{bankInformation.nDeposit}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col className='pr-0 mt-3' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="totalDeposit">Total Deposit</Label>
                              <InputGroupText>{bankInformation.nTotalDeposit}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col className='pl-0 mt-3' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="CurrentWin">Available Cash</Label>
                              <InputGroupText>{bankInformation.nCurrentCash}</InputGroupText>
                            </FormGroup>
                          </Col>
                          <Col className='pr-0 mt-3' xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for="totalWon">Total Play(Cash)</Label>
                              <InputGroupText>{bankInformation.nTotalCashPlay}</InputGroupText>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Collapse>
                    </div>
                  </Fragment>
                )
              }
              <Row className='mb-4'>
                <Col className='pl-0 admin-deposit-div' md={12} sm={12} xl={6}>
                  {
                ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT !== 'N')) &&
                (
                  <Fragment>
                    <div className="common-box-user">
                      <div className="align-items-start user-heading">
                        <h3>Admin Deposit</h3>
                        {((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT !== 'R')) && (
                        <div className={isEditAdminDeposit ? 'default-edit d-flex align-items-center' : 'user-edit-button'} >
                          {' '}
                          <div className='d-flex ' onClick={isEditAdminDeposit ? addAdminDepo : onEditAdminDeposit}>
                            {' '}
                            <img alt="" className='mr-2' src={isEditAdminDeposit ? '' : pencilIcon}/>
                            <Button className={isEditAdminDeposit ? 'user-Edit-button' : 'button'} >{isEditAdminDeposit ? 'Save' : 'Edit'}</Button>
                            {' '}

                          </div>
                            {isEditAdminDeposit && <Button className="ml-1 user-cancel-button" color="link" onClick={() => cancelFunc('admin_deposit')}>Cancel</Button>}
                        </div>
                        )}
                      </div>
                      <Row>
                        <Col className='p-4' md={12} xl={12} xs={12}>
                          <FormGroup className='d-flex user-radio-button'>
                            <Label className='edit-label-setting mb-0' for="adminDeposit">Type</Label>
                            <div className="d-flex inline-input">
                              <CustomInput checked={balanceType === 'cash'} disabled={!isEditAdminDeposit} id="cash" label="Cash" name="balanceType" onChange={event => handleChange(event, 'Deposit_Type')} type="radio" value="cash" />
                              <CustomInput checked={balanceType === 'bonus'} disabled={!isEditAdminDeposit} id="bonus" label="Bonus" name="balanceType" onChange={event => handleChange(event, 'Deposit_Type')} type="radio" value="bonus" />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='px-4' md={12} xl={12} xs={12}>
                          <FormGroup>
                            <Label className='edit-label-setting' for="Type">To Balance</Label>
                            <CustomInput className="form-control" disabled={!isEditAdminDeposit || balanceType === 'bonus'} id="balance" name="balance" onChange={event => handleChange(event, 'Balance')} type="select" value={balance}>
                              <option value="deposit">Deposit</option>
                              <option value="winning">Winning</option>
                            </CustomInput>
                          </FormGroup>
                        </Col>
                        {
                          balanceType === 'cash'
                            ? (
                              <Col className='mt-3 px-4' md={12} xl={12} xs={12}>
                                <FormGroup>
                                  <Label className='edit-label-setting' for="Cash">Cash</Label>
                                  <Input className={errCash ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminDeposit} id="Cash" onChange={event => handleChange(event, 'Cash')} placeholder="Enter Cash" type="number" value={cash} />
                                  <p className="error-text">{errCash}</p>
                                </FormGroup>
                              </Col>
                              )
                            : balanceType === 'bonus'
                              ? (
                                <Col className='mt-3 px-4' md={12} xl={12} xs={12}>
                                  <FormGroup>
                                    <Label className='edit-label-setting' for="Bonus">Bonus</Label>
                                    <Input className={errBonus ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminDeposit} id="Bonus" onChange={event => handleChange(event, 'Bonus')} placeholder="Enter Bonus" type="number" value={bonus} />
                                    <p className="error-text">{errBonus}</p>
                                  </FormGroup>
                                </Col>
                                )
                              : ''
                        }
                        <br />
                        <Col className='my-3 px-4' md={12} xl={12} xs={12}>
                          <FormGroup>
                            <Label className='edit-label-setting' for="DPassword">Password</Label>
                            <Input className={ErrDepositPassword ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminDeposit} id="DPassword" onChange={event => handleChange(event, 'DepositPassword')} placeholder="Enter Password" type="password" value={DepositPassword} />
                            <p className="error-text">{ErrDepositPassword}</p>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Fragment>
                )
              }
                </Col>
                <Col className='pr-0 admin-withdraw-div' md={12} sm={12} xl={6}>
                  {
                ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'N')) &&
                (
                  <Fragment>
                    <div className="common-box-user admin-withdraw">
                      <div className="align-items-start user-heading">
                        <h3>Admin Withdraw</h3>
                        {((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'R')) && (
                        <div className={isEditAdminWithdraw ? 'default-edit' : 'user-edit-button'}>
                          <Button className={isEditAdminWithdraw ? 'user-Edit-button' : 'button'} color="link" onClick={isEditAdminWithdraw ? funcAddAdminWithdraw : onEditAdminWithdraw}>
                            {!isEditAdminWithdraw && <img alt="" src={isEditAdminWithdraw ? '' : pencilIcon} />}
                            {' '}
                            {isEditAdminWithdraw ? 'Save' : 'Edit'}
                          </Button>
                          {isEditAdminWithdraw && <Button className="ml-1 user-cancel-button" color="link" onClick={() => cancelFunc('admin_withdraw')}>Cancel</Button>}
                        </div>
                        )}
                      </div>
                      <Row className='p-4'>
                        <Col className='p-0' md={12} xl={12} xs={12}>
                          <FormGroup className='d-flex user-radio-button'>
                            <Label className='edit-label-setting' for="adminWithdraw">From Balance</Label>
                            <div className="d-flex inline-input">
                              <CustomInput checked={withdrawType === 'withdraw'} disabled={!isEditAdminWithdraw} id="withdraw" label="Deposit" name="withdrawType" onChange={event => handleChange(event, 'WithdrawType')} type="radio" value="withdraw" />
                              <CustomInput checked={withdrawType === 'winning'} disabled={!isEditAdminWithdraw} id="winningWithdraw" label="Winning" name="withdrawType" onChange={event => handleChange(event, 'WithdrawType')} type="radio" value="winning" />
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col className=' px-4' md={12} xl={12} xs={12}>
                          <FormGroup>
                            <Label className='edit-label-setting' for="Amount">Amount</Label>
                            <Input className={errAmount ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminWithdraw} id="Amount" onChange={event => handleChange(event, 'Amount')} placeholder="Enter Amount" type="number" value={amount} />
                            <p className="error-text">{errAmount}</p>
                          </FormGroup>
                        </Col>

                        <Col className='my-3 px-4' md={12} xl={12} xs={12}>
                          <FormGroup>
                            <Label className='edit-label-setting' for="WPassword">Password</Label>
                            <Input className={ErrWithdrawPassword ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminWithdraw} id="WPassword" onChange={event => handleChange(event, 'WithdrawPassword')} placeholder="Enter Password" type="password" value={WithDrawPassword} />
                            <p className="error-text">{ErrWithdrawPassword}</p>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Fragment>
                )
              }
                </Col>
              </Row>

            </Col>
            <Col lg={4} xl={4} md={12}>
              {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) &&
                  (
                    <Fragment>
                      <div className="common-box-user p-4">
                        {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'R')) &&
                            (
                            <div className='d-flex justify-content-end'>
                              <div className='text-left edit-collapse'>
                                <span className={isEditUserDetails ? 'default-edit' : 'user-edit-button'}>
                                  {' '}
                                  <Button className={isEditUserDetails ? 'user-Edit-button' : 'button'} onClick={isEditUserDetails ? changeProfileData : onEditUserDetails}>
                                    {!isEditUserDetails && <img alt="" src={isEditUserDetails ? '' : pencilIcon} />}
                                    {isEditUserDetails ? 'Save' : 'Edit'}
                                  </Button>
                                </span>
                                {isEditUserDetails && <Button className='ml-1 user-cancel-button' color='link' onClick={() => cancelFunc('profile')}>{isEditUserDetails ? 'Cancel' : ''}</Button>}
                              </div>
                            </div>

                            )
                          }
                        <Row className="profile-block-two text-center">
                          <div className="profile-image" >
                            <img alt="userPic" className={propic ? 'system-user-profile-pic' : 'profile-pic'} src={propic ? propic?.imageUrl ? propic?.imageUrl : url + propic : profilePicture} />
                            {isEditUserDetails && propic && <div className='system-remove-img-label'><img onClick={event => handleChange(event, 'RemovePANImage')} src={removeImg} /></div>}
                            {!propic && <div className="file-btn2"><Input accept={acceptFormat} disabled={!isEditUserDetails} onChange={event => handleChange(event, 'ProPic')} type="file" /></div>}
                          </div>
                          <p className="error-text mr-4">{errImage}</p>
                        </Row>
                        <FormGroup className='mt-3'>
                          <Label className='edit-label-setting' for="fullName">Full Name</Label>
                          <Input className={ErrFullName ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id="fullName" onChange={event => handleChange(event, 'Name')} placeholder="Enter Full Name" type="text" value={fullname} />
                          <p className="error-text">{ErrFullName}</p>
                        </FormGroup>

                        <FormGroup className='custom-form-group-input mt-3'>
                          <Label className='edit-label-setting' for="email">Email</Label>
                          <Input className={errEmail ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id="email" onChange={event => handleChange(event, 'Email')} placeholder="Enter Email" type="text" value={email} />
                          {email && (emailVerified ? <img alt='Approve' className='custom-form-group-input-img' src={rightIcon} /> : <img alt='Reject' className='custom-form-group-input-img' src={closeIcon} />)}
                          <p className="error-text">{errEmail}</p>
                        </FormGroup>
                        <FormGroup className='custom-form-group-input mt-3'>
                          <Label className='edit-label-setting' for="phoneNumber">Mobile Number</Label>
                          <Input className={errMobNum ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id="mobnum" onChange={event => handleChange(event, 'MobNum')} placeholder="Enter Mobile Number" type="text" value={MobNum} />
                          {MobNum && (MobNumVerified ? <img alt='Approve' className='custom-form-group-input-img' src={rightIcon} /> : <img alt='Reject' className='custom-form-group-input-img' src={closeIcon} />)}
                          <p className="error-text">{errMobNum}</p>
                        </FormGroup>
                        <FormGroup className='mt-3'>
                          <Label className='edit-label-setting' for="birthdate">Birthdate</Label>
                          <Input className={errCash ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id="birthdate" onChange={event => handleChange(event, 'Birthdate')} placeholder="Enter Birthdate" type="date" value={moment(birthdate).format('YYYY-MM-DD')} />
                          <p className='error-text'>{birthDateErr}</p>
                        </FormGroup>
                        <FormGroup className='mt-3 user-radio-div'>
                          <Label className='edit-label-setting' for="phoneNumber">Gender</Label>
                          <div className="d-flex inline-input">
                            <CustomInput checked={gender !== 'F'} disabled={!isEditUserDetails} id="genderRadio1" label="Male" name="genderRadio" onClick={event => handleChange(event, 'Gender')} type="radio" value="M" />
                            <CustomInput checked={gender === 'F'} disabled={!isEditUserDetails} id="genderRadio2" label="Female" name="genderRadio" onClick={event => handleChange(event, 'Gender')} type="radio" value="F" />
                          </div>
                        </FormGroup>
                        <FormGroup className='mt-3 user-radio-div'>
                          <Label className='edit-label-setting' for="status">User Status</Label>
                          <div className="d-flex inline-input">
                            <CustomInput checked={userStatus === 'Y'} disabled={!isEditUserDetails} id="statusRadio1" label="Yes" name="statusRadio" onChange={event => handleChange(event, 'UserStatus')} type="radio" value="Y" />
                            <CustomInput checked={userStatus === 'N'} disabled={!isEditUserDetails} id="statusRadio2" label="No" name="statusRadio" onChange={event => handleChange(event, 'UserStatus')} type="radio" value="N" />
                          </div>
                        </FormGroup>
                        <FormGroup className='mt-3'>
                          <Label className='edit-label-setting' for="state">State</Label>
                          <Select
                            id="state"
                            isDisabled={!isEditUserDetails}
                            name="state"
                            onChange={selectedOption => handleChange(selectedOption, 'State')}
                            options={stateOptions}
                            placeholder="Select State"
                            value={State}
                          />
                        </FormGroup>
                        <FormGroup className='mt-3'>
                          <Label className='edit-label-setting' for="city">City</Label>
                          <Select
                            controlShouldRenderValue={cityOptions}
                            id="city"
                            isDisabled={!isEditUserDetails || !State}
                            name="city"
                            onChange={selectedOption => handleChange(selectedOption, 'City')}
                            options={cityOptions}
                            placeholder="Select City"
                            value={city}
                          />
                        </FormGroup>
                        <FormGroup className='mt-3'>
                          <Label className='edit-label-setting' for="address">Address</Label>
                          <Input disabled={!isEditUserDetails} id="address" onChange={event => handleChange(event, 'Address')} placeholder="Enter Address" type='textarea' value={address} />
                        </FormGroup>

                        <FormGroup className='mt-3'>
                          <Label className='edit-label-setting' for="pincode">Pincode</Label>
                          <Input disabled={!isEditUserDetails} id="pincode" onChange={event => handleChange(event, 'Pincode')} placeholder="Enter Pincode" type="tel" value={pincode} />
                        </FormGroup>
                      </div>
                    </Fragment>
                  )
                }
            </Col>
          </Row>
        </section>
      </main>
    </>
  )
})

SystemUserDetails.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}
SystemUserDetails.displayName = SystemUserDetails
export default connect(null, null, null, { forwardRef: true })(SystemUserDetails)
