import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'
import { Row, Col, FormGroup, Input, Label, CustomInput, Button, Modal, ModalBody, Alert, InputGroupText, ModalHeader, Collapse } from 'reactstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector, connect } from 'react-redux'
import Draggable from 'react-draggable'
import Select from 'react-select'
import moment from 'moment'
import PropTypes from 'prop-types'

import rightIcon from '../../../../assets/images/verify.svg'
import viewIcon from '../../../../assets/images/view-eye.svg'
import removeImg from '../../../../assets/images/ep-close.svg'
import wrongIcon from '../../../../assets/images/wrong-icon.svg'
import caretBottom from '../../../../assets/images/caret-top.svg'
import pencilIcon from '../../../../assets/images/pencil-line.svg'
import caretIcon from '../../../../assets/images/caret-bottom.svg'
import closeIcon from '../../../../assets/images/red-close-icon.svg'
import warningIcon from '../../../../assets/images/error-warning.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import { states, cities } from '../../../../helpers/country'
import { Aadhaar, PAN } from '../../../../helpers/KYCRejectReasons'
import { verifySpecialCharacter, withoutSpace, verifyLength, isNumber, verifyEmail, ifscCode, panCardNumber, verifyMobileNumber, verifyAadhaarNumber, isFloat, modalMessageFunc, isPincode, acceptFormat, withInitialSpace, WithZero } from '../../../../helpers/helper'
import { getUrl, getKycUrl } from '../../../../actions/url'
import { TypeList, AddUserNotification } from '../../../../actions/notification'
import { updatePanDetails, addPanDetails, updateAadhaarDetails, addAadhaarDetails, updateKYCStatus, getKycDetails } from '../../../../actions/kyc'
import { updateUserDetails, addAdminDeposit, getBankDetails, getBalanceDetails, addAdminWithdraw, getUserDetails } from '../../../../actions/users'
import RequiredField from '../../../../components/RequiredField'

const UserDetails = forwardRef((props, ref) => {
  const { id } = useParams()
  const navigate = useNavigate()
  // const location = useLocation()
  // this is bank Edit button comment for future edit bank Details
  // const [bankApproval, setBankApproval] = useState('N')
  const [userAccount, setUserAccount] = useState('N')
  const [stateOptions, setStateOptions] = useState([])
  const [cityOptions, setCityOptions] = useState([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [userName, setUsername] = useState('')
  const [errUsername, setErrUserName] = useState('')
  const [fullname, setFullname] = useState('')
  const [ErrFullName, setErrFullName] = useState('')
  const [email, setEmail] = useState('')
  const [State, setState] = useState('')
  const [type, setType] = useState('')
  const [errPanNo, setErrPanNo] = useState('')
  const [errPanName, setErrPanName] = useState('')
  const [statusType, setStatusType] = useState('')
  const [errAadhaarNo, setErrAadhaarNo] = useState('')
  const [modal, setModal] = useState(false)
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [pincodeErr, setPincodeErr] = useState('')
  const [MobNum, setMobNum] = useState(0)
  const [errEmail, setErrEmail] = useState('')
  const [errMobNum, setErrMobNum] = useState('')
  const [cash, setCash] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [MobNumVerified, setMobNumVerified] = useState(false)
  const [emailVerified, setemailVerified] = useState(false)
  const [Cancel, setCancel] = useState(false)
  const [status, setStatus] = useState(false)
  const [bankDetails, setBankDetails] = useState({})
  const [birthdate, setBirthdate] = useState('')
  const [birthDateErr, setBirthDateErr] = useState('')
  const [gender, setGender] = useState('')
  const [propic, setproPic] = useState('')
  const [userStatus, setUserStatus] = useState('')
  const [referralCode, setRefferalCode] = useState('')
  const [referrals, setReferrals] = useState(0)
  const [panDetails, setPanDetails] = useState({})
  const [aadhaarDetails, setAadhaarDetails] = useState({
    sNo: '',
    nNo: '',
    sFrontImage: '',
    sBackImage: ''
  })
  const [balance, setBalance] = useState('deposit')
  const [balanceType, setBalanceType] = useState('cash')
  const [DepositPassword, setDepositPassword] = useState('')
  const [ErrDepositPassword, setErrDepositPassword] = useState('')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')
  const [kycUrl, setKycUrl] = useState('')
  const [bankErrors, setBankErrors] = useState({
    sName: '',
    sBranch: '',
    sAccountHolderName: '',
    sAccountNo: '',
    sIFSC: ''
  })
  const [bankInformation, setBankInformation] = useState({
    nTotalBonus: '',
    nTotalWin: '',
    nTotalPlayCash: '',
    nTotalDeposit: '',
    nCurrentBonus: '',
    nCurrentCash: '',
    nDeposit: '',
    nWinnings: ''
  })
  const [preferenceInformation, setPreferenceInformation] = useState({
    bEmails: true,
    bPush: true,
    bSms: true,
    bSound: true,
    bVibration: true
  })
  const [isEditUserDetails, setEditUserDetails] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [isEditBankDetails, setEditBankDetails] = useState(false)
  const [isEditAdminDeposit, setEditAdminDeposit] = useState(false)
  const [isEditAdminWithdraw, setEditAdminWithdraw] = useState(false)
  const [isEditPanDetails, setEditPanDetails] = useState(false)
  const [addedPanDetails, setAddedPanDetails] = useState(false)
  const [addedKycDetails, setAddedKycDetails] = useState(false)
  const [isEditAadhaarDetails, setEditAadhaarDetails] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errPanImage, setErrPanImage] = useState('')
  const [errAadhaarImage, setErrAadhaarImage] = useState('')
  const [errTitle, setErrTitle] = useState('')
  const [errDescription, setErrDescription] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [errNotificationType, setErrNotificationType] = useState('')
  const [errCash, setErrCash] = useState('')
  const [errBonus, setErrBonus] = useState('')
  const [reason, setReason] = useState('')
  const [errReason, setErrReason] = useState('')
  const [errImage, setErrImage] = useState('')
  const [withdrawType, setWithdrawType] = useState('withdraw')
  const [amount, setAmount] = useState(0)
  const [WithDrawPassword, setWithDrawPassword] = useState('')
  const [ErrWithdrawPassword, setErrWithdrawPassword] = useState('')
  const [errAmount, setErrAmount] = useState('')
  const [openDocuments, setOpenDocuments] = useState(true)
  const [openCashModal, setOpenCashModal] = useState(true)
  const [bankModal, setBankModal] = useState(true)
  const [sendNotificationModal, setSendNotificationModal] = useState(true)
  const [referralModal, setReferralModal] = useState(false)
  const toggleReferralModal = () => setReferralModal(!referralModal)
  const toggleDocument = () => setOpenDocuments(!openDocuments)
  const toggleCashModal = () => setOpenCashModal(!openCashModal)
  const toggleBankModal = () => setBankModal(!bankModal)
  const toggleSendNotification = () => setSendNotificationModal(!sendNotificationModal)
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.users.resStatus)
  const resMessage = useSelector(state => state.users.resMessage)
  const actionType = useSelector(state => state.users.type)
  const usersDetails = useSelector(state => state.users.usersDetails)
  const BankDetails = useSelector(state => state.users.bankDetails)
  const BalanceDetails = useSelector(state => state.users.balanceDetails)
  const PreferenceDetails = useSelector(state => state.users.preferenceDetails)
  const kycDetails = useSelector(state => state.kyc.kycDetails)
  const kycResStatus = useSelector(state => state.kyc.resStatus)
  const kycResMessage = useSelector(state => state.kyc.resMessage)
  const kycActionType = useSelector(state => state.kyc.type)
  const updatedKyc = useSelector(state => state.kyc.updatedKyc)
  const getKycUrlLink = useSelector(state => state.url.getKycUrl)
  const notiResStatus = useSelector(state => state.notification.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const notiResMessage = useSelector(state => state.notification.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const typeList = useSelector(state => state.notification.typeList)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalPan, setModalOpen] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  // const [bankModal, setBankModal] = useState(false)
  // this is bank Edit button comment for future use edit bank Details

  // const bankWarning = () => {
  //   setBankModal(!bankModal)
  //   setBankDetails({
  //     ...bankDetails,
  //     sAccountHolderName: BankDetails && BankDetails.sAccountHolderName ? BankDetails.sAccountHolderName : '',
  //     sBankName: BankDetails && BankDetails.sBankName ? BankDetails.sBankName : '',
  //     sIFSC: BankDetails && BankDetails.sIFSC ? BankDetails.sIFSC : '',
  //     sAccountNo: BankDetails && BankDetails.sAccountNo ? BankDetails.sAccountNo : '',
  //     sBranch: BankDetails && BankDetails.sBranchName ? BankDetails.sBranchName : '',
  //     bIsChangeApprove: BankDetails && BankDetails.bIsBankApproved,
  //     bAllowUpdate: BankDetails?.bAllowUpdate
  //   })
  // }
  const togglepan = () => setModalOpen(!modalPan)
  const [modalAadhaarF, setModalAADHAARF] = useState(false)
  const toggleAadhaarF = () => setModalAADHAARF(!modalAadhaarF)
  const [modalAadhaarB, setModalAADHAARB] = useState(false)
  const toggleAadhaarB = () => setModalAADHAARB(!modalAadhaarB)
  const previousProps = useRef({
    resStatus, resMessage, notiResStatus, notiResMessage, kycResStatus, kycResMessage, BankDetails, PreferenceDetails, kycDetails, updatedKyc, usersDetails, BalanceDetails, State
  }).current

  // useEffect to dispatch action getUserDetails, bankDetails,balanceDetails,PreferenceDetails and KycDetails
  useEffect(() => {
    dispatch(TypeList(token))
    if (id) {
      // setId(id)
      if ((Auth && Auth === 'SUPER') || (adminPermission && adminPermission?.USERS !== 'N')) {
        dispatch(getUserDetails(id, token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.BANKDETAILS !== 'N')) {
        dispatch(getBankDetails(id, token))
      }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) {
        dispatch(getBalanceDetails(id, token))
      }
      // if ((Auth && Auth === 'SUPER') || (adminPermission?.PREFERENCES !== 'N')) {
      //   dispatch(getPreferenceDetails(id, token))
      // }
      if ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) {
        dispatch(getKycDetails(id, token))
      }
    }
    if (!getUrlLink && !url) {
      dispatch(getUrl('media'))
    }
    if (!getKycUrlLink && !kycUrl) {
      dispatch(getKycUrl('kyc'))
    }
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

  // handle to set State List
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
    if (getUrlLink && (!url)) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (getKycDetails && (!kycUrl)) {
      setKycUrl(getKycUrlLink)
    }
  }, [getKycUrlLink])

  // useEffect set to kycDetails and also handle kycResMessage and status
  useEffect(() => {
    if (previousProps.kycDetails !== kycDetails) {
      if (kycDetails) {
        if (kycDetails && kycDetails.oAadhaar && kycDetails.oPan) {
          setAddedPanDetails(true)
          setAddedKycDetails(true)
          setAadhaarDetails(kycDetails.oAadhaar)
          setPanDetails(kycDetails.oPan)
        } else if (kycDetails && kycDetails.oAadhaar) {
          setAddedKycDetails(true)
          setAadhaarDetails(kycDetails.oAadhaar)
        } else if (kycDetails && kycDetails.oPan) {
          if (kycDetails.oPan.eStatus === 'P' || kycDetails.oPan.eStatus === 'A') setAddedPanDetails(true)
          setPanDetails(kycDetails.oPan)
        }
        setCancel(false)
        setLoading(false)
      }
    }

    if ((!kycResStatus && kycResMessage)) {
      if (kycActionType === 'UPDATE_AADHAAR_DETAILS' || kycActionType === 'ADD_AADHAAR_DETAILS') {
        setAadhaarDetails({
          sNo: '',
          nNo: '',
          sFrontImage: '',
          sBackImage: ''
        })
      } else if (kycActionType === 'UPDATE_PAN_DETAILS' || kycActionType === 'ADD_PAN_DETAILS') {
        setPanDetails({
          sNo: '',
          sImage: '',
          sName: ''
        })
      }
      dispatch(getKycDetails(id, token))
      setLoading(false)
    }
    return () => {
      previousProps.kycDetails = kycDetails
    }
  }, [kycDetails, kycResMessage, kycResStatus])

  // useEffect to set updateKyc
  useEffect(() => {
    if (previousProps.updatedKyc !== updatedKyc) {
      if (updatedKyc && id) {
        dispatch(getKycDetails(id, token))
        setAadhaarDetails({})
        setPanDetails({})
        setLoading(false)
      }
    }
    return () => {
      previousProps.updatedKyc = updatedKyc
    }
  }, [updatedKyc])

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    }
  }, [copied])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // handle to set  PreferenceDetails, BankDetails, BalanceDetails, kycDetails
  useEffect(() => {
    if (previousProps.usersDetails !== usersDetails && previousProps.PreferenceDetails !== PreferenceDetails && previousProps.BankDetails !== BankDetails && previousProps.BalanceDetails !== BalanceDetails && (kycDetails && previousProps.kycDetails !== kycDetails)) {
      setLoading(false)
    }
  }, [usersDetails, PreferenceDetails, BankDetails, BalanceDetails, kycDetails])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setStatus(resStatus)
          if (actionType === 'ADD_BANK_DETAILS') {
            setEditBankDetails(false)
          } else if (actionType === 'UPDATE_USER_DETAILS') {
            setEditUserDetails(false)
          } else if (actionType === 'UPDATE_BANK_DETAILS') {
            setEditBankDetails(false)
          } else if (actionType === 'ADD_USER_DEPOSIT') {
            setEditAdminDeposit(false)
          } else if (actionType === 'ADD_USER_WITHDRAW') {
            setEditAdminWithdraw(false)
          }
        }
        setMessage(resMessage)
        setModalMessage(true)
        setLoading(false)
        dispatch(getUserDetails(id, token))
        dispatch(getBankDetails(id, token))
        dispatch(getBalanceDetails(id, token))
        // dispatch(getPreferenceDetails(id, token))
        dispatch(getKycDetails(id, token))
        dispatch(getUrl('media'))
        dispatch(getKycUrl('kyc'))
      }
    }

    if (previousProps.notiResMessage !== notiResMessage) {
      if (notiResMessage) {
        if (notiResStatus) {
          setStatus(notiResStatus)
        }
        setMessage(notiResMessage)
        setModalMessage(true)
        setLoading(false)
      }
    }

    // handle kyc resMessage
    if (previousProps.kycResMessage !== kycResMessage) {
      if (kycResMessage) {
        if (kycResStatus) {
          setStatus(kycResStatus)
          if (kycActionType === 'UPDATE_PAN_DETAILS' || kycActionType === 'ADD_PAN_DETAILS') {
            setEditPanDetails(false)
          } else if (kycActionType === 'UPDATE_AADHAAR_DETAILS' || kycActionType === 'ADD_AADHAAR_DETAILS') {
            setEditAadhaarDetails(false)
          }
          dispatch(getKycDetails(id, token))
        }
        setMessage(kycResMessage)
        setModalMessage(true)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
      previousProps.notiResMessage = notiResMessage
      previousProps.kycResMessage = kycResMessage
    }
  }, [resStatus, resMessage, notiResMessage, notiResStatus, kycResStatus, kycResMessage])

  // handle to set userDetails
  useEffect(() => {
    if (previousProps.usersDetails !== usersDetails || (!resStatus && resMessage) || Cancel) {
      if (usersDetails) {
        setUserAccount(usersDetails.bIsInternalAccount ? 'Y' : 'N')
        setEmail(usersDetails.sEmail)
        setUsername(usersDetails.sUsername)
        setFullname(usersDetails.sName)
        setMobNum(usersDetails.sMobNum)
        setMobNumVerified(usersDetails.bIsMobVerified)
        setemailVerified(usersDetails.bIsEmailVerified)
        setRefferalCode(usersDetails.sReferCode)
        setproPic(usersDetails.sProPic)
        setGender(usersDetails.eGender)
        setBirthdate(usersDetails.dDob)
        setAddress(usersDetails.sAddress ? usersDetails.sAddress : '')
        setPincode(usersDetails.nPinCode ? usersDetails.nPinCode : '')
        setUserStatus(usersDetails.eStatus)
        setReferrals(usersDetails.nReferrals ? usersDetails.nReferrals : 0)
        setCancel(false)
        const state = states.find(data => data.id === parseInt(usersDetails?.iStateId))
        setState(((usersDetails.iStateId && state)) ? { label: state.state_name || '', value: state.id || '' } : '')
        const city = cities.find(data => data.id === parseInt(usersDetails?.iCityId))
        setCity((usersDetails.iCityId && city) ? { label: city.city_name || '', value: city.id || '' } : '')
      }
    }
    return () => {
      previousProps.usersDetails = usersDetails
    }
  }, [usersDetails, resMessage, resStatus, Cancel])

  // handle to set  BalanceDetails
  useEffect(() => {
    if (previousProps.BalanceDetails !== BalanceDetails) {
      if (BalanceDetails) {
        setBankInformation({
          ...bankInformation,
          nTotalBonus: BalanceDetails.nTotalBonusEarned ? BalanceDetails.nTotalBonusEarned.toFixed(2) : 0,
          nTotalWin: BalanceDetails.nTotalWinningAmount ? BalanceDetails.nTotalWinningAmount.toFixed(2) : 0,
          nTotalPlayCash: BalanceDetails.nTotalPlayCash ? BalanceDetails.nTotalPlayCash.toFixed(2) : 0,
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

  // handle to set preferenceDetails
  useEffect(() => {
    if (previousProps.PreferenceDetails !== PreferenceDetails || Cancel || (!resStatus && resMessage)) {
      if (PreferenceDetails) {
        setPreferenceInformation({
          ...preferenceInformation,
          bEmails: PreferenceDetails.bEmails,
          bPush: PreferenceDetails.bPush,
          bSms: PreferenceDetails.bSms,
          bSound: PreferenceDetails.bSound,
          bVibration: PreferenceDetails.bVibration
        })
        setCancel(false)
      }
    }
    return () => {
      previousProps.PreferenceDetails = PreferenceDetails
    }
  }, [PreferenceDetails, resMessage, resStatus, Cancel])

  // handle to set BankDetails
  useEffect(() => {
    if (previousProps.BankDetails !== BankDetails || Cancel || (!resStatus && resMessage)) {
      if (BankDetails) {
        setBankDetails({
          ...bankDetails,
          sAccountHolderName: BankDetails && BankDetails.sAccountHolderName ? BankDetails.sAccountHolderName : '',
          sBankName: BankDetails && BankDetails.sBankName ? BankDetails.sBankName : '',
          sIFSC: BankDetails && BankDetails.sIFSC ? BankDetails.sIFSC : '',
          sAccountNo: BankDetails && BankDetails.sAccountNo ? BankDetails.sAccountNo : '',
          sBranch: BankDetails && BankDetails.sBranchName ? BankDetails.sBranchName : '',
          bIsChangeApprove: BankDetails && BankDetails.bIsBankApproved,
          bAllowUpdate: BankDetails?.bAllowUpdate
        })
        setCancel(false)
      }
    }
    return () => {
      previousProps.BankDetails = BankDetails
    }
  }, [BankDetails, resMessage, resStatus, Cancel])

  useEffect(() => {
    if (typeList) {
      if (typeList && typeList.length !== 0) {
        setNotificationType(typeList[0]._id)
      }
    }
  }, [typeList])

  // handleChange function to handle onChange event
  function handleChange (event, eType) {
    switch (eType) {
      case 'RemoveImage':
        setproPic('')
        break
      case 'RemovePANImage':
        setPanDetails({ ...panDetails, sImage: '' })
        break
      case 'RemoveAadhaarFront':
        setAadhaarDetails({ ...aadhaarDetails, sFrontImage: '' })
        break
      case 'RemoveAadhaarBack':
        setAadhaarDetails({ ...aadhaarDetails, sBackImage: '' })
        break
      case 'UserAccount':
        setUserAccount(event.target.value)
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrFullName('')
        } else if (!verifyLength(event.target.value, 1)) {
          setErrFullName('Required field')
        }
        setFullname(event.target.value)
        break
      case 'Email':
        if (verifyLength(event.target.value, 1) && verifyEmail(event.target.value) && verifyEmail(event.target.value)) {
          setErrEmail('')
        } else if (!verifyEmail(event.target.value)) {
          setErrEmail('Enter Proper Email')
        }
        setEmail(event.target.value)
        break
      case 'userName':
        if (verifyLength(event.target.value, 5) && event.target.value.length <= 16 && !withoutSpace(event.target.value) && verifySpecialCharacter(event.target.value)) {
          setErrUserName('')
        } else {
          if (withoutSpace(event.target.value)) {
            setErrUserName('Team Name must be alpha-numeric.')
          } else if (!verifyLength(event.target.value, 5)) {
            setErrUserName('Team Name must of minimum of 5 character')
          } else if (!verifySpecialCharacter(event.target.value)) {
            setErrUserName('Team Name must be alpha-numeric.')
          } else if (event.target.value.length > 16) {
            setErrUserName('Team Name must be maximum of 15 characters')
          }
        }
        setUsername(event.target.value)
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
      case 'PreferenceEmail':
        setPreferenceInformation({ ...preferenceInformation, bEmails: event.target.value === 'Y' })
        break
      case 'PreferencePush':
        setPreferenceInformation({ ...preferenceInformation, bPush: event.target.value === 'Y' })
        break
      case 'PreferenceSMS':
        setPreferenceInformation({ ...preferenceInformation, bSms: event.target.value === 'Y' })
        break
      case 'PreferenceSound':
        setPreferenceInformation({ ...preferenceInformation, bSound: event.target.value === 'Y' })
        break
      case 'PreferenceVibration':
        setPreferenceInformation({ ...preferenceInformation, bVibration: event.target.value === 'Y' })
        break
      case 'PreferencePushNoti':
        setPreferenceInformation({ ...preferenceInformation, bPush: event.target.value === 'Y' })
        break
      case 'City':
        setCity(event)
        break
      case 'Pincode':
        if (!isNaN(event.target.value) || (!event.target.value)) {
          if (isPincode(event.target.value)) {
            setPincodeErr('Please enter proper Pincode!')
          } else {
            setPincodeErr('')
          }
          setPincode(event.target.value && parseInt(event.target.value))
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
      case 'AccHolderName':
        if (verifyLength(event.target.value, 1)) {
          setBankErrors({ ...bankErrors, sAccountHolderName: '' })
        } else {
          setBankErrors({ ...bankErrors, sAccountHolderName: 'Required field' })
        }
        setBankDetails({ ...bankDetails, sAccountHolderName: event.target.value })
        break
      case 'BankChangeApproval':
        setBankDetails({ ...bankDetails, bIsChangeApprove: event.target.value === 'true' })
        break
      case 'BankName':
        if (verifyLength(event.target.value, 1)) {
          setBankErrors({ ...bankErrors, sBankName: '' })
        } else {
          setBankErrors({ ...bankErrors, sBankName: 'Required field' })
        }
        setBankDetails({ ...bankDetails, sBankName: event.target.value })
        break
      case 'IFSCCode':
        if (verifyLength(event.target.value, 1) && !ifscCode(event.target.value)) {
          setBankErrors({ ...bankErrors, sIFSC: '' })
        } else {
          setBankErrors({ ...bankErrors, sIFSC: 'IFSC is not correct' })
        }
        setBankDetails({ ...bankDetails, sIFSC: (event.target.value).toUpperCase() })
        break
      case 'AccNo':
        if (isNumber(event.target.value)) {
          setBankErrors({ ...bankErrors, sAccountNo: '' })
        } else if (!event.target.value) {
          setBankErrors({ ...bankErrors, sAccountNo: 'Required field' })
        } else if (!isNumber(event.target.value)) {
          setBankErrors({ ...bankErrors, sAccountNo: 'Must be number' })
        }
        setBankDetails({ ...bankDetails, sAccountNo: event.target.value })
        break
      case 'Branch':
        if (verifyLength(event.target.value, 1)) {
          setBankErrors({ ...bankErrors, sBranch: '' })
        } else {
          setBankErrors({ ...bankErrors, sBranch: 'Required field' })
        }
        setBankDetails({ ...bankDetails, sBranch: event.target.value })
        break
      case 'KYC_Pan':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrPanImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrPanImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setPanDetails({ ...panDetails, sImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          setEditPanDetails(true)
          setErrPanImage('')
        }
        break
      case 'KYC_Pan_DocNo':
        if (!panCardNumber(event.target.value)) {
          setErrPanNo('')
        } else {
          setErrPanNo('Enter Proper PanCard Number')
        }
        setPanDetails({ ...panDetails, sNo: (event.target.value).toUpperCase() })
        break
      case 'KYC_Pan_Name':
        if (verifyLength(event.target.value, 1)) {
          setErrPanName('')
        } else {
          setErrPanName('Required field')
        }
        setPanDetails({ ...panDetails, sName: event.target.value })
        break
      case 'KYC_IDProof_front':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrAadhaarImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrAadhaarImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAadhaarDetails({ ...aadhaarDetails, sFrontImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          aadhaarDetails && aadhaarDetails.sBackImage && aadhaarDetails.sBackImage.imageUrl && setErrAadhaarImage('')
          setErrAadhaarImage('')
        }
        break
      case 'KYC_IDProof_Back':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrAadhaarImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrAadhaarImage('Please select a file less than 5MB')
        } else if (event.target.files[0] && event.target.files[0].type.includes('image')) {
          setAadhaarDetails({ ...aadhaarDetails, sBackImage: { imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] } })
          aadhaarDetails && aadhaarDetails.sFrontImage && aadhaarDetails.sFrontImage.imageUrl && setErrAadhaarImage('')
          setErrAadhaarImage('')
        }
        break
      case 'KYC_AADHAAR_NO':
        if (!event.target.value) {
          setErrAadhaarNo('Required field')
        } else if (verifyAadhaarNumber(event.target.value)) {
          setErrAadhaarNo('')
        } else if (!isNumber(event.target.value)) {
          setErrAadhaarNo('Must be numbers')
        } else if (!verifyAadhaarNumber(event.target.value)) {
          setErrAadhaarNo('Length Must be 12')
        }
        setAadhaarDetails({ ...aadhaarDetails, nNo: event.target.value })
        break
      case 'Balance':
        setBalance(event.target.value)
        break
      case 'Deposit_Type':
        setBalanceType(event.target.value)
        break
      case 'ProPic':
        if (event.target.files[0]?.type?.includes('image/gif')) {
          setErrImage('Gif not allowed!')
        } else if ((event.target.files[0]?.size / 1024 / 1024).toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event.target.files[0]) {
          setproPic({ imageUrl: URL.createObjectURL(event.target.files[0]), file: event.target.files[0] })
          setErrImage('')
        }
        break
      case 'title':
        if (!event?.target?.value) {
          setErrTitle('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          setErrTitle('No Initial Space Allowed')
        } else {
          setErrTitle('')
        }
        setTitle(event.target.value.trimStart())
        break
      case 'description':
        if (!event?.target?.value) {
          setErrDescription('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          setErrDescription('No Initial Space Allowed')
        } else {
          setErrDescription('')
        }
        setDescription(event.target.value.trimStart())
        break
      case 'Cash':
        if (!event.target.value) {
          setErrCash('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrCash('Enter number only')
          } else {
            setErrCash('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrCash('')
        } if (WithZero(event?.target?.value)) {
          setErrCash('Required field')
        }
        setCash(event.target.value)
        break
      case 'Bonus':
        if (!event.target.value) {
          setErrBonus('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrBonus('Enter number only')
          } else {
            setErrBonus('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrBonus('')
        }
        if (WithZero(event?.target?.value)) {
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
        if (!event.target.value) {
          setErrAmount('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrAmount('Enter number only')
          } else {
            setErrAmount('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrAmount('')
        } else if (WithZero(event?.target?.value)) {
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
      case 'Type':
        if (verifyLength(event.target.value, 1)) {
          setErrNotificationType('')
        } else {
          setErrNotificationType('Required field')
        }
        setNotificationType(event.target.value)
        break
      case 'Reason':
        if (!event.target.value) {
          setErrReason('Please select reason')
        } else {
          setErrReason('')
        }
        setReason(event.target.value)
        break
      default:
        break
    }
  }

  // function handle changeProfileData
  function changeProfileData () {
    if (isNumber(MobNum) && !birthDateErr && verifyEmail(email) && !errEmail && !errMobNum) {
      const updateUserData = {
        userName, userAccount, fullname, ID: id, propic, email, MobNum, gender, birthdate, address, city: city.value, pincode, State: State.value, userStatus, token
      }
      dispatch(updateUserDetails(updateUserData))
      setErrImage('')
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
      if (moment(birthdate).isAfter(moment())) {
        setBirthDateErr('Date should not be future date')
      }
    }
  }

  // function handle adminDeposit
  function addAdminDepo () {
    if (balanceType === 'cash' ? (isFloat(cash) && !WithZero(cash)) : true && (balanceType === 'bonus' ? (!WithZero(bonus) && isFloat(bonus)) : true) && DepositPassword && !errCash && !errBonus) {
      dispatch(addAdminDeposit(id, balance, balanceType, cash, bonus, DepositPassword, token))
      setBalance('deposit')
      setBalanceType('cash')
      setCash(0)
      setBonus(0)
      setDepositPassword('')
      setLoading(true)
    } else {
      if (balanceType === 'cash' && !cash && WithZero(cash)) {
        setErrCash('Required field')
      }
      if (balanceType === 'bonus' && !bonus && WithZero(bonus)) {
        setErrBonus('Required field')
      }
      if (!verifyLength(DepositPassword, 1)) {
        setErrDepositPassword('Required field')
      }
    }
  }

  // function handle adminWithdraw
  function funcAddAdminWithdraw () {
    if (isFloat(amount) && !WithZero(amount)) {
      dispatch(addAdminWithdraw(id, withdrawType, amount, WithDrawPassword, token))
      setWithdrawType('withdraw')
      setAmount(0)
      setWithDrawPassword('')
      setLoading(true)
    } else {
      if (!amount || WithZero(amount)) {
        setErrAmount('Required field')
      }
      if (!verifyLength(WithDrawPassword, 1)) {
        setErrWithdrawPassword('Required field')
      }
    }
  }

  // bank Detail Function for use in future

  // function changeBankDetails () {
  //   if (verifyLength(bankDetails.sBankName, 1) && verifyLength(bankDetails.sBranch, 1) && verifyLength(bankDetails.sAccountHolderName, 1) && verifyLength(bankDetails.sIFSC, 1) && verifyLength(bankDetails.sAccountNo, 1) && !ifscCode(bankDetails.sIFSC)) {
  //     if (BankDetails && BankDetails.sAccountNo) {
  //       dispatch(UpdateBankDetails(bankDetails, Id, token))
  //     } else {
  //       dispatch(AddBankDetails(bankDetails, Id, token))
  //     }
  //     setLoading(true)
  //     setBankModal(false)
  //   } else {
  //     setBankErrors({
  //       sBankName: !verifyLength(bankDetails.sBankName, 1) ? 'Required field' : '',
  //       sBranch: !verifyLength(bankDetails.sBranch, 1) ? 'Required field' : '',
  //       sAccountHolderName: !verifyLength(bankDetails.sAccountHolderName, 1) ? 'Required field' : '',
  //       sAccountNo: !bankDetails.sAccountNo ? 'Required field' : !isNumber(bankDetails.sAccountNo) ? 'Must be number' : '',
  //       sIFSC: !verifyLength(bankDetails.sIFSC, 1) ? 'Required field' : ifscCode(bankDetails.sIFSC) ? 'IFSC is not correct' : ''
  //     })
  //   }
  // }

  function onEditUserDetails () {
    if (!isEditUserDetails) {
      setEditUserDetails(true)
    }
  }

  // bank Details Relate Comment For use in anytime

  // function onEditBankDetails () {
  //   if (!isEditBankDetails) {
  //     setEditBankDetails(true)
  //   }
  // }

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

  function onSendNotification () {
    if (withInitialSpace(title) && verifyLength(title, 1) && verifyLength(description, 1) && notificationType && !errTitle && !errDescription) {
      dispatch(AddUserNotification(id, title, description, notificationType, token))
      setLoading(true)
      setTitle('')
      setDescription('')
      if (typeList) {
        if (typeList && typeList.length !== 0) {
          setNotificationType(typeList[0]._id)
        }
      }
    } else {
      if (!verifyLength(title, 1)) {
        setErrTitle('Required field')
      } else if (withInitialSpace(title)) {
        setErrTitle('No Initial Space Allowed')
      }
      if (!verifyLength(description, 1)) {
        setErrDescription('Required field')
      }
    }
  }

  function warningWithConfirmMessage (eType, statustype) {
    const Status = (eType === 'Verify' ? 'A' : eType === 'Reject' ? 'R' : '')
    setStatusType(statustype)
    setType(eType)
    if (Status === 'R') {
      setModal(true)
    } else {
      setModalWarning(true)
    }
  }

  function onImageError () {

  }

  function onEditPanDetails () {
    if (isEditPanDetails) {
      if (panDetails && panDetails.sImage && panDetails.sNo && !errPanNo && addedPanDetails && kycDetails && kycDetails.oPan) {
        if (id) {
          dispatch(updatePanDetails(id, panDetails.sImage, panDetails.sNo, panDetails.sName, token))
          setErrPanImage('')
          setLoading(true)
          setType('')
        }
      } else {
        if (panDetails && panDetails.sImage && panDetails.sNo && !errPanNo && !addedPanDetails) {
          if (id) {
            dispatch(addPanDetails(id, panDetails.sImage, panDetails.sNo, panDetails.sName, token))
            setErrPanImage('')
            setLoading(true)
            setType('')
          }
        } else {
          if (!panDetails.sNo) {
            setErrPanNo('Pan No is Required')
          }
          if (!panDetails.sImage) {
            setErrPanImage('Image Required')
          }
          if (!panDetails.sName) {
            setErrPanName('Name Required')
          }
        }
      }
    } else {
      setEditPanDetails(true)
    }
  }

  function onEditAadhaarDetails () {
    if (isEditAadhaarDetails) {
      if (aadhaarDetails && aadhaarDetails.sFrontImage && aadhaarDetails.sBackImage && aadhaarDetails.nNo && addedKycDetails) {
        if (id) {
          if (aadhaarDetails.sBackImage.imageUrl && aadhaarDetails.sFrontImage.imageUrl && addedKycDetails) {
            dispatch(updateAadhaarDetails(id, aadhaarDetails.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
            setErrAadhaarImage('')
          }
          setLoading(true)
          setType('')
        }
      } else {
        if (aadhaarDetails.sBackImage && aadhaarDetails.sFrontImage && !addedKycDetails) {
          if (id) {
            dispatch(addAadhaarDetails(id, aadhaarDetails.sFrontImage, aadhaarDetails.sBackImage, aadhaarDetails.nNo, token))
            setErrAadhaarImage('')
            setLoading(true)
            setType('')
          }
        } else {
          if (!isNumber(aadhaarDetails.nNo)) {
            setErrAadhaarNo('Required field')
          }
          if (!aadhaarDetails.sBackImage || !aadhaarDetails.sFrontImage) {
            setErrAadhaarImage('Both images are required')
          }
        }
      }
    } else {
      setEditAadhaarDetails(true)
    }
  }

  function handleModalClose () {
    setModal(false)
  }

  function copyToClipboard () {
    if (usersDetails && usersDetails.sReferCode) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(usersDetails.sReferCode).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        })
          .catch(() => console.log('error'))
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = usersDetails.sReferCode
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        return new Promise(function () {
          if (document.execCommand('copy')) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }
          textArea.remove()
        })
      }
    }
  }

  function onUpdateStatus () {
    const eStatus = (type === 'Verify' ? 'A' : 'R')
    if (id) {
      dispatch(updateKYCStatus(id, eStatus, statusType, reason, token))
      setLoading(true)
    }
    if (type === 'Verify') {
      toggleWarning()
    } else {
      setModal(false)
      setReason('')
    }
  }

  function cancelFunc (type) {
    if (type === 'profile') {
      setEditUserDetails(false)
      setErrEmail('')
      setErrMobNum('')
      setErrFullName('')
      setErrImage('')
    } else if (type === 'bank') {
      setEditBankDetails(false)
      setBankErrors({
        sBankName: '',
        sBranch: '',
        sAccountHolderName: '',
        sAccountNo: '',
        sIFSC: ''
      })
    } else if (type === 'admin_deposit') {
      setEditAdminDeposit(false)
      setCash(0)
      setBonus(0)
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
    } else if (type === 'kyc_pan') {
      setEditPanDetails(false)
      setErrPanImage('')
      setErrPanNo('')
      panDetails.sNo = ''
      panDetails.sImage = ''
      panDetails.sName = ''
    } else if (type === 'kyc_aadhaar') {
      setEditAadhaarDetails(false)
      setErrAadhaarImage('')
      setErrAadhaarNo('')
      aadhaarDetails.sNo = ''
      aadhaarDetails.nNo = ''
      aadhaarDetails.sFrontImage = ''
      aadhaarDetails.sBackImage = ''
    }
    setCancel(true)
  }

  function onRefresh () {
    dispatch(getUserDetails(id, token))
    dispatch(getBankDetails(id, token))
    dispatch(getBalanceDetails(id, token))
    // dispatch(getPreferenceDetails(id, token))
    dispatch(getKycDetails(id, token))
    dispatch(getUrl('media'))
    dispatch(getKycUrl('kyc'))
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  // bank Approval Function use

  // function bankChangeApprovalWarning () {
  //   setBankApproval(!bankDetails.bIsChangeApprove)
  //   setBankDetails({ ...bankDetails, bIsChangeApprove: !bankDetails.bIsChangeApprove })
  //   setBankModal(true)
  // }

  return (
    <>
      {loading && <Loading />}
      {usersDetails?.eStatus === 'D' && (
      <>
        <div className='delete-user-div'>
          {' '}
          <p className='delete-user w-100' title={usersDetails?.sReason}>
            {' '}
            <span> Deleted User </span>
            <br/>
            {' '}
            {usersDetails?.sReason && `(${usersDetails.sReason})`}
          </p>
        </div>
      </>
      )}
      <main className='main-content d-flex'>

        <AlertMessage
          close={close}
          message={message}
          modalMessage={modalMessage}
          status={status}
        />
        {copied && <Alert color='primary'>Copied into a Clipboard</Alert>}
        <section className='user-section'>
          <div className=' d-flex justify-content-between '>
            <div className='d-flex justify-content-end align-items-center' />
          </div>
          <Row className='p-4'>
            <Col className='p-0' lg={8} md={12}>
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) &&
                (
                  <Fragment>
                    <div className='common-box-user'>
                      <h3 className='user-heading' onClick={toggleDocument}>
                        Documents
                        {' '}
                        <span>
                          {' '}
                          <img alt="" src={openDocuments ? caretBottom : caretIcon} />
                        </span>
                      </h3>
                      <Collapse isOpen={openDocuments}>

                        <Row >
                          <Col lg={6} md={12} xl={6}>
                            {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'N')) &&
                          (
                          <div className=' document-header  align-items-start p-4'>
                            <h3>
                              PAN
                              {panDetails && panDetails.eStatus === 'A'
                                ? (
                                  <span className='ml-3 verify-text'>
                                    <img alt="" src={rightIcon} />
                                    {' '}
                                    (Verified)
                                  </span>
                                  )
                                : panDetails.eStatus === 'R' ? <span className='danger-text ml-2'>(Rejected)</span> : ''}
                            </h3>
                            {((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'R')) && (
                            <div className={kycDetails?.eStatus === 'D' ? 'hide-Edit-button' : 'd-flex align-items-center'} hidden={['P', 'A'].includes(kycDetails && kycDetails.oPan && kycDetails.oPan.eStatus)}>
                              <div className={isEditPanDetails ? 'default-edit' : 'user-edit-button'} hidden={['P', 'A'].includes(kycDetails && kycDetails.oPan && kycDetails.oPan.eStatus)} onClick={onEditPanDetails}>
                                {' '}
                                <img alt="" className='pr-2 image-user-edit' src={isEditPanDetails ? '' : pencilIcon} />
                                {' '}
                                <Button className={isEditPanDetails ? 'user-Edit-button' : 'button'} hidden={['P', 'A'].includes(kycDetails && kycDetails.oPan && kycDetails.oPan.eStatus)}>{isEditPanDetails ? 'Save' : 'Edit'}</Button>
                                {' '}
                              </div>
                              {isEditPanDetails && <Button className='ml-1 user-cancel-button' color='link' onClick={() => cancelFunc('kyc_pan')}>Cancel</Button>}
                            </div>
                            )}
                          </div>
                          )
                        }
                            {/* <div className='document-list'> */}
                            <div className='document-list'>
                              <div className='item'>
                                <Row >
                                  <Col className='mb-4' lg={12} md={6} xl={6}>
                                    <FormGroup >
                                      <Label className='edit-label-setting' for='PANName'>Name as per PAN</Label>
                                      <Input className={errPanName ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditPanDetails} id='PANName' onChange={event => handleChange(event, 'KYC_Pan_Name')} placeholder='Name as per PAN' type='text' value={panDetails?.sName || ''} />
                                      {errPanName && <p className='error-text'>{errPanName}</p>}
                                    </FormGroup>
                                  </Col>
                                  <Col className='mb-4' lg={12} md={6} xl={6}>
                                    <FormGroup>
                                      <Label className='edit-label-setting' for='document1No'>PAN</Label>
                                      <Input className={errPanNo ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditPanDetails} id='document1No' onChange={event => handleChange(event, 'KYC_Pan_DocNo')} placeholder='Enter PAN' type='text' value={panDetails && panDetails.sNo ? panDetails.sNo : ''} />
                                      {errPanNo && <p className='error-text'>{errPanNo}</p>}
                                    </FormGroup>
                                  </Col>
                                  <Col className='d-flex align-self-center' lg={12} md={6} xl={6}>
                                    {panDetails && panDetails.eStatus === 'A' && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && (
                                    <Button className='danger-btn' color='link' onClick={() => warningWithConfirmMessage('Reject', 'PAN')}>
                                      <img alt='Reject' src={wrongIcon} />
                                      <span>Reject</span>
                                    </Button>
                                    )}
                                  </Col>
                                  <Col className='mb-3' lg={12} md={12} xl={12}>
                                    <div className='theme-image'>
                                      <div className='theme-photo text-center'>
                                        <div className={panDetails?.sImage ? 'theme-img' : 'theme-img-default'}>
                                          {panDetails && panDetails?.sImage ? <img alt='pancard' className='custom-img' onError={ev => onImageError(ev, 'document')} src={panDetails?.sImage?.imageUrl ? panDetails.sImage.imageUrl : panDetails.sImage} /> : <img alt='pancard' className={panDetails.sImage ? 'custom-img' : 'custom-img-default'} onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />}
                                          {isEditPanDetails && panDetails?.sImage && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemovePANImage')} src={removeImg} /></div>}
                                          <div className='lable-Upload-Image' hidden={panDetails?.sImage}>Upload Image</div>
                                        </div>
                                        {(isEditPanDetails && !panDetails?.sImage) ? <CustomInput accept={acceptFormat} disabled={!isEditPanDetails} hidden={panDetails && (panDetails.eStatus === 'A' || panDetails.eStatus === 'P')} id='exampleCustomFileBrowser' name='customFile' onChange={event => handleChange(event, 'KYC_Pan')} type='file' /> : '' }
                                        <Button className='view-btn-user ml-3' color='link' hidden={!(panDetails && panDetails.sImage)} onClick={() => setModalOpen(true)}>
                                          {' '}
                                          <img alt='View' src={viewIcon} />
                                          {' '}
                                          View
                                          {' '}
                                        </Button>
                                      </div>
                                    </div>
                                    {errPanImage && <p className='error-text'>{errPanImage}</p>}

                                    {panDetails && panDetails.eStatus === 'R'
                                      ? (
                                        <p className={`danger-text ml-2' ${panDetails?.sRejectReason ? 'mt-3' : ' '}`}>
                                          Reason:
                                          {' '}
                                          {panDetails && panDetails.sRejectReason}
                                          {' '}
                                        </p>
                                        )
                                      : ''}
                                    {((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && (
                                    <Row className='py-4 kyc-button'>
                                      <Col className='pl-0 approve' md={6} xl={6}>
                                        {panDetails && panDetails.eStatus === 'P' && <Button className='success-btn-user w-100' color='link' onClick={() => warningWithConfirmMessage('Verify', 'PAN')}><span>Approve</span></Button>}
                                      </Col>
                                      <Col className='pr-0 reject' md={6} xl={6}>
                                        {panDetails && panDetails.eStatus === 'P' && <Button className='danger-btn-user w-100' color='link' onClick={() => warningWithConfirmMessage('Reject', 'PAN')}><span>Reject</span></Button>}
                                      </Col>
                                    </Row>
                                    )}
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </Col>
                          <Col lg={6} md={12} xl={6}>
                            <Row>
                              {
                                  ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) &&
                                  (
                                    <Fragment>
                                      <div className='document-header w-100 p-4'>
                                        <h3>
                                          Aadhaar
                                          {' '}
                                          {aadhaarDetails && aadhaarDetails.eStatus === 'A'
                                            ? (
                                              <span className='ml-2 verify-text'>
                                                <img alt="" src={rightIcon} />
                                                {' '}
                                                (Verified)
                                              </span>
                                              )
                                            : aadhaarDetails.eStatus === 'R' ? <span className='danger-text ml-2'>(Rejected)</span> : ''}
                                        </h3>
                                        {((Auth && Auth === 'SUPER') || (adminPermission?.KYC !== 'R')) && (
                                          <div className={isEditAadhaarDetails ? 'default-edit' : 'user-edit-button'} hidden={ ['D'].includes(kycDetails && kycDetails?.eStatus) ? ['D'].includes(kycDetails && kycDetails?.eStatus) : ['P', 'A'].includes(kycDetails && kycDetails.oAadhaar && kycDetails.oAadhaar.eStatus)}>
                                            <Button className={isEditAadhaarDetails ? 'user-Edit-button' : 'button'} hidden={['P', 'A'].includes(kycDetails && kycDetails.oAadhaar && kycDetails.oAadhaar.eStatus)} onClick={onEditAadhaarDetails}>
                                              <img alt="" src={isEditAadhaarDetails ? '' : pencilIcon} />
                                              {' '}
                                              {isEditAadhaarDetails ? 'Save' : 'Edit'}
                                            </Button>
                                            {isEditAadhaarDetails && <Button className='ml-2 user-cancel-button' onClick={() => cancelFunc('kyc_aadhaar')} >Cancel</Button>}
                                          </div>
                                        )}
                                      </div>
                                    </Fragment>
                                  )
                                  }
                              <Col className='pb-4' lg={12} md={12} xl={12}>
                                <FormGroup>
                                  <Label className='edit-label-setting' for='document2No'>Aadhaar Number</Label>
                                  <div className='d-flex justify-content-between '>
                                    <Input className={errAadhaarNo ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAadhaarDetails} id='document2No' onChange={event => handleChange(event, 'KYC_AADHAAR_NO')} placeholder='Enter Aadhaar Number' type='text' value={aadhaarDetails && aadhaarDetails.nNo ? aadhaarDetails.nNo : ''} />
                                  </div>
                                  {errAadhaarNo && <p className='error-text'>{errAadhaarNo}</p>}
                                </FormGroup>
                              </Col>
                              <div className='document-list'>
                                <div className='item'>
                                  {((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && (
                                  <Col className='d-flex align-self-center' lg={12} md={6} xl={6}>
                                    {aadhaarDetails && aadhaarDetails.eStatus === 'A' && (
                                    <Button className='danger-btn' color='link' onClick={() => warningWithConfirmMessage('Reject', 'AADHAAR')}>
                                      <img alt='Reject' src={wrongIcon} />
                                      <span>Reject</span>
                                    </Button>
                                    )}
                                  </Col>
                                  )}
                                </div>
                              </div>
                            </Row>

                            <div className='document-list'>
                              <Row>
                                <Col className='mb-3' md={12} xl={6}>
                                  <div className='adhar-Img'>
                                    <div className='theme-image-2' >
                                      <div className='theme-photo text-center'>
                                        <div className={aadhaarDetails.sFrontImage ? 'theme-img' : 'theme-img-default'}>
                                          {aadhaarDetails && aadhaarDetails.sFrontImage ? <img alt='aadhaarfront' className='custom-img' onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} /> : <img alt='aadhaarcardFront' className={aadhaarDetails?.sFrontImage ? 'custom-img' : 'custom-img-default'} onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />}
                                          {isEditAadhaarDetails && aadhaarDetails?.sFrontImage && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveAadhaarFront')} src={removeImg} /></div>}
                                          <div className='side-label'>Upload Front Image</div>

                                          {isEditAadhaarDetails ? <CustomInput accept={acceptFormat} disabled={!isEditAadhaarDetails} hidden={aadhaarDetails && (aadhaarDetails.eStatus === 'A' || aadhaarDetails.eStatus === 'P')} id='exampleCustomFileBrowser1' name='customFile1' onChange={event => handleChange(event, 'KYC_IDProof_front')} type='file'/> : ''}
                                        </div>
                                        <Button className='view-btn-user ml-3' color='link' hidden={!(aadhaarDetails && aadhaarDetails.sFrontImage)} onClick={() => setModalAADHAARF(true)}>
                                          {' '}
                                          <img alt='View' src={viewIcon} />
                                          {' '}
                                          View
                                          {' '}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                                </Col>
                                <Col className='pb-3' md={12} xl={6}>
                                  <div className='adhar-Img'>
                                    <div className='theme-image-2'>
                                      <div className='theme-photo text-center'>
                                        <div className={aadhaarDetails?.sBackImage ? 'theme-img' : 'theme-img-default'}>
                                          {aadhaarDetails && aadhaarDetails.sBackImage ? <img alt='aadhaarback' className='custom-img' onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} /> : <img alt='aadhaarcardFront' className={aadhaarDetails?.sBackImage ? 'custom-img' : 'custom-img-default'} onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />}
                                          {isEditAadhaarDetails && aadhaarDetails?.sBackImage && ((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveAadhaarBack')} src={removeImg} /></div>}
                                          <div className='side-label'>Upload Back Image</div>
                                          {isEditAadhaarDetails ? <CustomInput accept={acceptFormat} disabled={!isEditAadhaarDetails} hidden={aadhaarDetails && (aadhaarDetails.eStatus === 'A' || aadhaarDetails.eStatus === 'P')} id='exampleCustomFileBrowser2' label='Edit' name='customFile2' onChange={event => handleChange(event, 'KYC_IDProof_Back')} type='file' /> : ''}
                                        </div>
                                      </div>
                                      {aadhaarDetails?.sBackImage && (
                                      <Button className='view-btn-user d-flex align-items-center justify-content-center w-100 ml-3' color='link' hidden={!(aadhaarDetails && aadhaarDetails?.sBackImage)} onClick={() => setModalAADHAARB(true)}>
                                        {' '}
                                        <img alt='View' src={viewIcon} />
                                        {' '}
                                        View
                                          {' '}
                                      </Button>
                                      )}
                                    </div>
                                  </div>
                                  {errAadhaarImage && <p className='error-text'>{errAadhaarImage}</p>}
                                </Col>
                              </Row>
                            </div>
                            <div className='item mt-1 mb-2'>
                              {aadhaarDetails && aadhaarDetails.eStatus === 'R'
                                ? (
                                  <p className='danger-text ml-2'>
                                    Reason:
                                    {' '}
                                    {kycDetails && kycDetails.oAadhaar && kycDetails.oAadhaar.sRejectReason}
                                    {' '}
                                  </p>
                                  )
                                : ''}
                              {((Auth && Auth === 'SUPER') || (adminPermission?.KYC === 'W')) && (
                              <Fragment>
                                <Row className='px-4'>
                                  <Col className='pl-0' md={6} xl={6}>
                                    {aadhaarDetails && aadhaarDetails.eStatus === 'P' && <Button className='success-btn-user aadhaar-approve w-100' color='link' onClick={() => warningWithConfirmMessage('Verify', 'AADHAAR')}><span>Approve </span></Button>}
                                  </Col>
                                  <Col className='pr-0' md={6} xl={6}>
                                    {aadhaarDetails && aadhaarDetails.eStatus === 'P' && <Button className='danger-btn-user aadhaar-approve w-100' color='link' onClick={() => warningWithConfirmMessage('Reject', 'AADHAAR')}><span>Reject</span></Button>}
                                  </Col>
                                </Row>
                              </Fragment>
                              )}
                            </div>
                          </Col>
                          {/* </div> */}
                        </Row>
                      </Collapse>
                    </div>
                  </Fragment>
                )
              }
              <Col className='p-0' lg={12} md={12} xl={12}>
                <Fragment>

                  {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.BALANCE !== 'N')) &&
                  (
                    <Fragment>
                      <div className='common-box-user'>
                        <div className='align-items-start fdc-480 mb-20px-480 user-heading' onClick={toggleCashModal}>
                          <h3>Cash/ Bonus Information</h3>
                          <div className='cash-bonus-header'>
                            <Button className='cash-bonus-button' state= {{ userToPassbook: true, id: id }} tag={Link} to={{ pathname: '/users/passbook', search: `?searchValue=${id}` }}>
                              {' '}
                              <span> Show Users Transactions </span>
                            </Button>
                            <span className='ml-2'><img alt="" src={openCashModal ? caretBottom : caretIcon} /></span>
                          </div>
                        </div>
                        <Collapse isOpen={openCashModal}>

                          <Row className='p-4'>
                            <Col className='pl-0' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Available Bonus</Label>
                                <InputGroupText>{bankInformation.nCurrentBonus}</InputGroupText>
                              </FormGroup>
                            </Col>
                            <Col className='pr-0' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Total Bonus</Label>
                                <InputGroupText>{bankInformation.nTotalBonus}</InputGroupText>
                              </FormGroup>
                            </Col>
                            <Col className='pl-0 mt-3' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Available Winnings</Label>
                                <InputGroupText>{bankInformation.nWinnings}</InputGroupText>
                              </FormGroup>
                            </Col>
                            <Col className='pr-0 mt-3' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Total Winnings</Label>
                                <InputGroupText>{bankInformation.nTotalWin}</InputGroupText>
                              </FormGroup>
                            </Col>
                            <Col className='pl-0 mt-3' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Available Deposit </Label>
                                <InputGroupText>{bankInformation.nDeposit}</InputGroupText>
                              </FormGroup>
                            </Col>
                            <Col className='pr-0 mt-3' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Total Deposit</Label>
                                <InputGroupText>{bankInformation.nTotalDeposit}</InputGroupText>
                              </FormGroup>
                            </Col>
                            <Col className='pl-0 mt-3' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Available Cash</Label>
                                <InputGroupText>{bankInformation.nCurrentCash}</InputGroupText>
                              </FormGroup>
                            </Col>
                            <Col className='pr-0 mt-3' xs={6}>
                              <FormGroup>
                                <Label className='edit-label-setting'>Total Play(Cash)</Label>
                                <InputGroupText>{bankInformation.nTotalPlayCash}</InputGroupText>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Collapse>

                      </div>
                    </Fragment>
                  )
                }
                  {
                ((Auth && Auth === 'SUPER') || (adminPermission?.BANKDETAILS !== 'N')) && (
                  <Fragment>
                    <div className='common-box-user'>
                      <div className='align-items-start user-heading' onClick={toggleBankModal}>
                        <h3>Bank Details</h3>

                        {/* Edit Button bank Detail */}
                        {/* {((Auth && Auth === 'SUPER') || (adminPermission?.BANKDETAILS === 'W')) && <div><Button onClick={isEditBankDetails ? changeBankDetails : onEditBankDetails} color='link'>{isEditBankDetails ? 'Save' : 'Edit'}</Button>
                {isEditBankDetails && <Button className='ml-3' onClick={() => cancelFunc('bank')} color='link'>Cancel</Button>}</div>} */}

                        <span>
                          {' '}
                          <img alt="" src={bankModal ? caretBottom : caretIcon} />
                        </span>
                      </div>
                      <Collapse isOpen={bankModal}>

                        <Row className='p-4 ban-details'>
                          <Col className='pl-0 col-left' md={12} xl={6} xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='accountHolderName'>Account Holder Name</Label>
                              <InputGroupText>{bankDetails.sAccountHolderName || 'Not Added'}</InputGroupText>

                              {/* bank account placeHolder  Editable */}
                              {/* <Input disabled type='text' id='accountHolderName' placeholder='Enter Account Holder Name' value={bankDetails.sAccountHolderName} onChange={event => handleChange(event, 'AccHolderName')} />
                              <p className='error-text'>{bankErrors && bankErrors.sAccountHolderName}</p> */}

                            </FormGroup>
                          </Col>
                          <Col className='pr-0 account-number col-right' md={12} xl={6} xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='bankAccountNumber'>Account Number</Label>
                              <InputGroupText>{bankDetails.sAccountNo || 'Not Added'}</InputGroupText>

                              {/* bank Account number  Editable */}
                              {/* <Input disabled type='text' placeholder='Enter Bank Account Number' value={bankDetails.sAccountNo} onChange={event => handleChange(event, 'AccNo')} />
                              <p className='error-text'>{bankErrors && bankErrors.sAccountNo}</p> */}

                            </FormGroup>
                          </Col>
                          <Col className='mt-3 pl-0 col-left' md={12} xl={4} xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='bankName'>Bank Name</Label>
                              <InputGroupText>{bankDetails.sBankName || 'Not Added'}</InputGroupText>

                              {/* bank name  Editable */}
                              {/* <Input disabled type='text' id='bankName' placeholder='Enter Bank Name' value={bankDetails.sBankName} onChange={event => handleChange(event, 'BankName')} />
                              <p className='error-text'>{bankErrors && bankErrors.sBankName}</p> */}

                            </FormGroup>
                          </Col>
                          <Col className='mt-3 col-right' md={12} xl={4} xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='branch'>Branch</Label>
                              <InputGroupText>{bankDetails.sBranch || 'Not Added'}</InputGroupText>

                              {/* branch name Field Editable */}
                              {/* <Input disabled type='text' id='branch' placeholder='Enter Branch' value={bankDetails.sBranch} onChange={event => handleChange(event, 'Branch')} />
                              <p className='error-text'>{bankErrors && bankErrors.sBranch}</p> */}

                            </FormGroup>
                          </Col>
                          <Col className='mt-3 col-left pr-0' md={12} xl={4} xs={6}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='ifsc'>IFSC</Label>
                              <InputGroupText>{bankDetails.sIFSC || 'Not Added'}</InputGroupText>
                              {/* ifsc field editable */}
                              {/* <Input disabled type='text' id='ifsc' placeholder='Enter IFSC Code' value={bankDetails.sIFSC} onChange={event => handleChange(event, 'IFSCCode')} />
                              <p className='error-text'>{bankErrors && bankErrors.sIFSC}</p> */}

                            </FormGroup>
                          </Col>

                          {/* Bank Approval switch Button */}

                          {/* BankDetails && BankDetails.sAccountNo && BankDetails.sAccountHolderName && BankDetails.sBankName && BankDetails.bAllowUpdate
                            ? <Col xs={12}>
                            <FormGroup className='d-flex justify-content-between mb-0'>
                              <Label for='bankChangeApproval'>Bank Change Approval?</Label>
                              <CustomInput
                                type='switch'
                                id='bankChangeApproval'
                                name='bankChangeApproval'
                                onClick={(event) => bankChangeApprovalWarning(event.target.value)}
                                checked={bankDetails.bIsChangeApprove}
                                disabled={((adminPermission?.BANKDETAILS === 'R') && (!BankDetails.bAllowUpdate))}
                              />
                            </FormGroup>
                          </Col>
                          : '' */}
                        </Row>
                      </Collapse>
                    </div>
                  </Fragment>
                )
                }
                  <Row className='mb-4'>
                    <Col className='pl-0 admin-deposit-div' md={12} sm={12} xl={6}>
                      {
                  ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT === 'W')) &&
                  (
                    <Fragment>
                      <div className='common-box-user'>
                        {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.DEPOSIT === 'W')) &&
                            (
                              <div className='align-items-start user-heading'>
                                <h3>Admin Deposit</h3>
                                <div className={isEditAdminDeposit ? 'default-edit d-flex align-item-center' : 'user-edit-button'} hidden={ ['D'].includes(kycDetails && kycDetails?.eStatus)}>
                                  <div className='d-flex align-items-center' onClick={isEditAdminDeposit ? addAdminDepo : onEditAdminDeposit}>
                                    {(!isEditAdminDeposit &&
                                    <img alt="" className='mr-2' src={pencilIcon}/>
                                      )}
                                    {' '}
                                    <Button className={isEditAdminDeposit ? 'user-Edit-button' : 'button'} >{isEditAdminDeposit ? 'Save' : 'Edit'}</Button>
                                  </div>
                                  {isEditAdminDeposit && <Button className='ml-1 user-cancel-button' color='link' onClick={() => cancelFunc('admin_deposit')}>Cancel</Button>}

                                </div>
                              </div>
                            )
                          }
                        <Row>
                          <Col className='p-4' md={12} xl={12} xs={12}>
                            <FormGroup className='d-flex user-radio-button'>
                              <Label className='edit-label-setting mb-0' for='adminDeposit'>Type</Label>
                              <div className='d-flex inline-input'>
                                <CustomInput checked={balanceType === 'cash'} disabled={!isEditAdminDeposit} id='cash' label='Cash' name='balanceType' onChange={event => handleChange(event, 'Deposit_Type')} type='radio' value='cash' />
                                <CustomInput checked={balanceType === 'bonus'} disabled={!isEditAdminDeposit} id='bonus' label='Bonus' name='balanceType' onChange={event => handleChange(event, 'Deposit_Type')} type='radio' value='bonus' />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col className='px-4' md={12} xl={12} xs={12}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='Type'>To Balance</Label>
                              <CustomInput className='form-control' disabled={!isEditAdminDeposit || balanceType === 'bonus'} id='balance' name='balance' onChange={event => handleChange(event, 'Balance')} type='select' value={balance}>
                                <option value='deposit'>Deposit</option>
                                <option value='winning'>Winning</option>
                              </CustomInput>
                            </FormGroup>
                          </Col>
                          {
                            balanceType === 'cash'
                              ? (
                                <Col className='mt-3 px-4' md={12} xl={12} xs={12}>
                                  <FormGroup>
                                    <Label className='edit-label-setting' for='Cash'>Cash</Label>
                                    <Input className={errCash ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminDeposit} id='Cash' onChange={event => handleChange(event, 'Cash')} placeholder='Enter Cash' type='number' value={cash} />
                                    <p className='error-text'>{errCash}</p>
                                  </FormGroup>
                                </Col>
                                )
                              : balanceType === 'bonus'
                                ? (
                                  <Col className='mt-3 px-4' md={12} xl={12} xs={12}>
                                    <FormGroup>
                                      <Label className='edit-label-setting' for='Bonus'>Bonus</Label>
                                      <Input className={errBonus ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminDeposit} id='Bonus' onChange={event => handleChange(event, 'Bonus')} placeholder='Enter Bonus' type='number' value={bonus} />
                                      <p className='error-text'>{errBonus}</p>
                                    </FormGroup>
                                  </Col>
                                  )
                                : ''
                          }
                          <br />
                          <Col className='my-3 px-4' md={12} xl={12} xs={12}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='DPassword'>Password</Label>
                              <Input className={ErrDepositPassword ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminDeposit} id='DPassword' onChange={event => handleChange(event, 'DepositPassword')} placeholder='Enter Password' type='password' value={DepositPassword} />
                              <p className='error-text'>{ErrDepositPassword}</p>
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
                  ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW === 'W')) &&
                  (
                    <Fragment>
                      <div className='common-box-user admin-withdraw'>
                        {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.WITHDRAW !== 'R')) &&
                            (
                              <div className='align-items-start user-heading'>
                                <h3>Admin Withdraw</h3>
                                <div className={isEditAdminWithdraw ? 'default-edit  d-flex align-item-center' : 'user-edit-button'} hidden={ ['D'].includes(kycDetails && kycDetails?.eStatus)}>
                                  <div className='d-flex align-items-center' onClick={isEditAdminWithdraw ? funcAddAdminWithdraw : onEditAdminWithdraw}>
                                    {(!isEditAdminWithdraw &&
                                    <img alt="" className='mr-2' src={pencilIcon}/>
                                       )}
                                    {' '}
                                    <Button className={isEditAdminWithdraw ? 'user-Edit-button' : 'button'} >{isEditAdminWithdraw ? 'Save' : 'Edit'}</Button>
                                  </div>
                                  {isEditAdminWithdraw && <Button className='ml-1 user-cancel-button' color='link' onClick={() => cancelFunc('admin_withdraw')}>Cancel</Button>}
                                </div>
                              </div>
                            )
                          }
                        <Row className='p-4'>
                          <Col className='p-0' md={12} xl={12} xs={12}>
                            <FormGroup className='d-flex user-radio-button align-items-center'>
                              <Label className='edit-label-setting m-0' for='adminWithdraw'>From Balance</Label>
                              <div className='d-flex inline-input'>
                                <CustomInput checked={withdrawType === 'withdraw'} disabled={!isEditAdminWithdraw} id='withdraw' label='Deposit' name='withdrawType' onChange={event => handleChange(event, 'WithdrawType')} type='radio' value='withdraw' />
                                <CustomInput checked={withdrawType === 'winning'} disabled={!isEditAdminWithdraw} id='winningWithdraw' label='Winning' name='withdrawType' onChange={event => handleChange(event, 'WithdrawType')} type='radio' value='winning' />
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col className=' px-4' md={12} xl={12} xs={12}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='Amount'>Amount</Label>
                              <Input className={errAmount ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminWithdraw} id='Amount' onChange={event => handleChange(event, 'Amount')} placeholder='Enter Amount' type='number' value={amount} />
                              <p className='error-text'>{errAmount}</p>
                            </FormGroup>
                          </Col>

                          <Col className='my-3 px-4' md={12} xl={12} xs={12}>
                            <FormGroup>
                              <Label className='edit-label-setting' for='WPassword'>Password</Label>
                              <Input className={ErrWithdrawPassword ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditAdminWithdraw} id='WPassword' onChange={event => handleChange(event, 'WithdrawPassword')} placeholder='Enter Password' type='password' value={WithDrawPassword} />
                              <p className='error-text'>{ErrWithdrawPassword}</p>
                            </FormGroup>
                          </Col>

                        </Row>
                      </div>
                    </Fragment>
                  )
                }
                    </Col>
                  </Row>

                </Fragment>
              </Col>

              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'N')) &&
                (
                  <Fragment>
                    <div className='common-box-user'>
                      <div className='align-items-start user-heading' onClick={toggleSendNotification}>
                        <h3>Send Notification</h3>
                        <img alt="" src={sendNotificationModal ? caretBottom : caretIcon} />
                      </div>
                      <Collapse isOpen={sendNotificationModal}>

                        <FormGroup className='p-4'>
                          <Label className='edit-label-setting' for='NotificationTitle'>
                            Title
                            {' '}
                            <RequiredField/>
                          </Label>
                          <Input
                            className={errTitle ? 'league-placeholder-error' : 'league-placeholder'}
                            disabled={adminPermission?.NOTIFICATION === 'R'}
                            onChange={event => handleChange(event, 'title')}
                            placeholder='Enter Title'
                            type='text'
                            value={title}
                          />
                          <p className='error-text'>{errTitle}</p>
                        </FormGroup>
                        <FormGroup className='px-4'>
                          <Label className='edit-label-setting' for='notificationDescription'>
                            Description
                            {' '}
                            <RequiredField/>
                          </Label>
                          <Input
                            className={errDescription ? 'league-placeholder-error' : 'league-placeholder'}
                            disabled={adminPermission?.NOTIFICATION === 'R'}
                            onChange={event => handleChange(event, 'description')}
                            placeholder='Enter Description'
                            type='textarea'
                            value={description}
                          />
                          <p className='error-text'>{errDescription}</p>
                        </FormGroup>
                        <FormGroup className='px-4 mt-4'>
                          <Label className='edit-label-setting' for='typeSelect'>
                            Notification Type
                            {' '}
                            <RequiredField/>
                          </Label>
                          <CustomInput
                            className={errNotificationType ? 'league-placeholder-error' : 'form-control'}
                            disabled={adminPermission?.NOTIFICATION === 'R'}
                            id='typeSelect'
                            name='typeSelect'
                            onChange={event => handleChange(event, 'Type')}
                            type='select'
                            value={notificationType}
                          >
                            {typeList && typeList.length !== 0 && typeList.map(Data => (
                              <option key={Data._id} value={Data._id}>
                                {' '}
                                {Data.sHeading}
                                {' '}
                              </option>
                            ))}
                          </CustomInput>
                          <p className='error-text'>{errNotificationType}</p>
                        </FormGroup>
                        {
                        ((Auth && Auth === 'SUPER') || (adminPermission?.NOTIFICATION !== 'R')) &&
                        (
                          <div className='p-4'>
                            <Button className='theme-btn w-100 ' onClick={onSendNotification} type='submit'>Send</Button>
                          </div>
                        )
                      }
                      </Collapse>
                    </div>
                  </Fragment>
                )
              }
            </Col>

            <Col className='admin-user-div' lg={4} xl={4}>
              {
                ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'N')) &&
                (
                  <Fragment>
                    <div className='common-box-user p-4'>

                      {
                          ((Auth && Auth === 'SUPER') || (adminPermission?.USERS !== 'R')) &&
                          (
                            <Fragment>
                              <div className='d-flex justify-content-between'>
                                <h2 className='user-heading-name'>User Information</h2>
                                <div className='edit-collapse d-flex align-items-center'>
                                  <div className={isEditUserDetails ? 'default-edit' : 'user-edit-button'} hidden={ ['D'].includes(kycDetails && kycDetails?.eStatus)} onClick={isEditUserDetails ? changeProfileData : onEditUserDetails}>
                                    <img alt="" className='mr-2' src={isEditUserDetails ? '' : pencilIcon}/>
                                    {' '}
                                    <Button className={isEditUserDetails ? 'user-Edit-button' : 'button'}>{isEditUserDetails ? 'Save' : 'Edit'}</Button>
                                  </div>
                                  {isEditUserDetails && <Button className='ml-1 user-cancel-button' color='link' onClick={() => cancelFunc('profile')}>{isEditUserDetails ? 'Cancel' : ''}</Button>}
                                </div>
                              </div>
                            </Fragment>
                          )
                        }
                      <div className='profile-block text-center'>
                        <div className='profile-image'>
                          <img alt='userPic' className={propic ? 'system-user-profile-pic' : 'profile-pic'} onError={ev => onImageError(ev, 'propic')} src={(propic && url) ? propic?.imageUrl ? propic?.imageUrl : url + propic : documentPlaceholder} />
                          {!propic && <div className='file-btn'><Input accept={acceptFormat} disabled={!isEditUserDetails} onChange={event => handleChange(event, 'ProPic')} type='file' /></div>}
                          {propic && ((Auth && Auth === 'SUPER') || (adminPermission?.USERS === 'W')) && <div className='remove-img-label-user' hidden={!isEditUserDetails} onClick={event => handleChange(event, 'RemoveImage')}><img src={removeImg} /></div>}
                        </div>
                        <p className='error-text mr-4'>{errImage}</p>
                        {errImage && <p className='error-text mr-4'>{errImage}</p>}
                        <h3 className='mt-2'>{fullname}</h3>
                      </div>
                      <FormGroup className='userSwitch'>
                        <Label className='edit-label-setting m-0' for='account'>Internal Account</Label>
                        <CustomInput checked={userAccount === 'Y'} disabled={!isEditUserDetails} id='accountRadio1' name='account' onChange={event => handleChange(event, 'UserAccount')} type='switch' value= {userAccount === 'N' ? 'Y' : 'N'} />

                      </FormGroup>
                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='fullName'>Full Name</Label>
                        <Input className={ErrFullName ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id='fullName' onChange={event => handleChange(event, 'Name')} placeholder='Enter Full Name' type='text' value={fullname} />
                        <p className='error-text'>{ErrFullName}</p>
                      </FormGroup>
                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='userName'>Team Name</Label>
                        <Input className={errUsername ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id='userName' onChange={event => handleChange(event, 'userName')} placeholder='Enter Team Name' type='text' value={userName} />
                        <p className='error-text'>{errUsername}</p>
                      </FormGroup>
                      <FormGroup className='custom-form-group-input mt-3'>
                        <Label className='edit-label-setting' for='email'>Email</Label>
                        <Input className={errEmail ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id='email' onChange={event => handleChange(event, 'Email')} placeholder='Enter Email' type='text' value={email} />
                        {email && (emailVerified ? <img alt='Approve' className='custom-form-group-input-img' src={rightIcon} /> : <img alt='Reject' className='custom-form-group-input-img' src={closeIcon} />)}
                        <p className='error-text'>{errEmail}</p>
                      </FormGroup>
                      <FormGroup className='custom-form-group-input mt-3'>
                        <Label className='edit-label-setting' for='phoneNumber'>Mobile Number</Label>
                        <Input className={errMobNum ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id='mobnum' onChange={event => handleChange(event, 'MobNum')} placeholder='Enter Mobile Number' type='text' value={MobNum} />
                        {MobNum && (MobNumVerified ? <img alt='Approve' className='custom-form-group-input-img' src={rightIcon} /> : <img alt='Reject' className='custom-form-group-input-img' src={closeIcon} />)}
                        <p className='error-text'>{errMobNum}</p>
                      </FormGroup>
                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='birthdate'>Birthdate</Label>
                        <Input className={birthDateErr ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id='birthdate' onChange={event => handleChange(event, 'Birthdate')} placeholder='Enter Birthdate' type='date' value={birthdate ? moment(birthdate).format('YYYY-MM-DD') : ''} />
                        <p className='error-text'>{birthDateErr}</p>
                      </FormGroup>
                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='platform'>Platform</Label>
                        <InputGroupText disabled id='platform' type='text'>{usersDetails?.ePlatform === 'W' ? 'Web' : usersDetails?.ePlatform === 'A' ? 'Android' : usersDetails?.ePlatform === 'I' ? 'iOS' : 'Not Available'}</InputGroupText>
                      </FormGroup>
                      <FormGroup className='mt-3 user-radio-div'>
                        <Label className='edit-label-setting' for='phoneNumber'>Gender</Label>
                        <div className='d-flex inline-input mt-2 '>
                          <CustomInput checked={gender === 'M'} disabled={!isEditUserDetails} id='genderRadio1' label='Male' name='genderRadio' onClick={event => handleChange(event, 'Gender')} type='radio' value='M' />
                          <CustomInput checked={gender === 'F'} disabled={!isEditUserDetails} id='genderRadio2' label='Female' name='genderRadio' onClick={event => handleChange(event, 'Gender')} type='radio' value='F' />
                          <CustomInput checked={gender === 'O'} disabled={!isEditUserDetails} id='genderRadio3' label='Other' name='genderRadio' onClick={event => handleChange(event, 'Gender')} type='radio' value='O' />
                        </div>
                      </FormGroup>
                      <FormGroup className='mt-3 user-radio-div'>
                        <Label className='edit-label-setting' for='status'>User Status</Label>
                        <div className='d-flex inline-input mt-2'>
                          <CustomInput checked={userStatus === 'Y'} disabled={!isEditUserDetails} id='statusRadio1' label='Active' name='statusRadio' onClick={event => handleChange(event, 'UserStatus')} type='radio' value='Y' />
                          <CustomInput checked={userStatus === 'N'} disabled={!isEditUserDetails} id='statusRadio2' label='Block' name='statusRadio' onClick={event => handleChange(event, 'UserStatus')} type='radio' value='N' />
                        </div>
                      </FormGroup>
                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='state'>State</Label>
                        <Select
                          id='state'
                          isDisabled={!isEditUserDetails}
                          name='state'
                          onChange={selectedOption => handleChange(selectedOption, 'State')}
                          options={stateOptions}
                          placeholder='Select State'
                          value={State}
                        />
                      </FormGroup>
                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='city'>City</Label>
                        <Select
                          controlShouldRenderValue={cityOptions}
                          id='city'
                          isDisabled={!isEditUserDetails || !State}
                          name='city'
                          onChange={selectedOption => handleChange(selectedOption, 'City')}
                          options={cityOptions}
                          placeholder='Select City'
                          value={city}
                        />
                      </FormGroup>
                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='address'>Address</Label>
                        <Input disabled={!isEditUserDetails} id='address' onChange={event => handleChange(event, 'Address')} placeholder='Enter Address' type='textarea' value={address} />
                      </FormGroup>

                      <FormGroup className='mt-3'>
                        <Label className='edit-label-setting' for='pincode'>Pincode</Label>
                        <Input className={pincodeErr ? 'league-placeholder-error' : 'league-placeholder'} disabled={!isEditUserDetails} id='pincode' onChange={event => handleChange(event, 'Pincode')} placeholder='Enter Pincode' type='text' value={pincode} />
                        <p className='error-text'>{pincodeErr}</p>
                      </FormGroup>
                    </div>
                  </Fragment>
                )
              }

              <div className='common-box-user'>
                <div className='d-flex justify-content-between  user-referral-div user-heading' onClick={toggleReferralModal}>
                  <h3 className='cash-bonus-header user-referral'>Referral Information</h3>
                  <div className='cash-bonus-header'>
                    {referrals
                      ? (
                        <Button className='referral-code' onClick={() => navigate(`/users/user-referred-list/${id}`)}>
                          Total Refer -
                          {' '}
                          {referrals}
                        </Button>
                        )
                      : (
                        <b className='mr-2 referral-code'>
                          Total Refer -
                          {' '}
                          {referrals}
                        </b>
                        )}
                    <img alt="" src={referralModal ? caretBottom : caretIcon} />
                  </div>
                </div>
                <Collapse isOpen={referralModal}>
                  <Row className='d-flex justify-content-center align-items-end p-4'>
                    <Col className='pl-0' md={9} xl={9} xs={9}>
                      <div className='w-100 d-flex justify-content-between align-items-center'>
                        <Label className='edit-label-setting' for='referralCode'>Referral Code</Label>
                      </div>
                      <FormGroup>
                        <InputGroupText>{referralCode || 'NA'}</InputGroupText>
                      </FormGroup>
                    </Col>
                    <Col className='p-0' md={3} xl={3} xs={3}>
                      <Button className='user-copy-button w-100' onClick={copyToClipboard}>Copy</Button>
                    </Col>
                  </Row>
                </Collapse>
              </div>
            </Col>
          </Row>
        </section>
        <Draggable>
          <Modal className='modal-reject' isOpen={modalPan} toggle={togglepan}>
            <ModalHeader toggle={togglepan}> Pan Details</ModalHeader>
            <ModalBody className='text-center'>
              <div className='pan-details '>
                <div className='text-left'>
                  <h3>Name as per PAN :</h3>
                  <h3>
                    {' '}
                    {panDetails?.sName}
                  </h3>
                </div>
                <div className='text-right'>
                  <h3>PAN :</h3>
                  <h3>
                    {panDetails?.sNo}
                    {' '}
                  </h3>
                </div>

              </div>
              <div className='doc-img2-img'>
                <div className='img-div'>
                  {
                  panDetails && panDetails.sImage ? <img alt='pancard' className={panDetails.sImage ? 'custom-img' : 'custom-img-default'} onError={ev => onImageError(ev, 'document')} src={panDetails.sImage && panDetails.sImage.imageUrl ? panDetails.sImage.imageUrl : panDetails.sImage} /> : <img alt='pancard' onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
                }
                </div>
              </div>

            </ModalBody>
          </Modal>
        </Draggable>
        <Draggable>
          <Modal className='modal-reject' isOpen={modalAadhaarF} toggle={toggleAadhaarF}>
            <ModalHeader toggle={toggleAadhaarF}>Aadhaar Details</ModalHeader>
            <ModalBody className='text-center'>
              <div className='aadhar-details'>
                <h3>Aadhaar Number :</h3>
                <h3>
                  {aadhaarDetails?.nNo}
                  {' '}
                </h3>
              </div>
              <div className='doc-img2-img'>
                <div className='img-div'>

                  {
                  aadhaarDetails && aadhaarDetails.sFrontImage ? <img alt='pancard' className='kyc-img' onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sFrontImage && aadhaarDetails.sFrontImage.imageUrl ? aadhaarDetails.sFrontImage.imageUrl : aadhaarDetails.sFrontImage} /> : <img alt='aadhaarcardFront' onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
                }
                </div>
              </div>

            </ModalBody>
          </Modal>
        </Draggable>
        <Draggable>
          <Modal className='modal-reject' isOpen={modalAadhaarB} toggle={toggleAadhaarB}>
            <ModalHeader toggle={toggleAadhaarB}>Aadhaar Details</ModalHeader>
            <ModalBody className='text-center'>
              <div className='aadhar-details'>
                <h3>Aadhaar Number :</h3>
                <h3>
                  {aadhaarDetails?.nNo}
                  {' '}
                </h3>
              </div>
              <div className='doc-img2-img'>
                <div className='img-div'>
                  {
                  aadhaarDetails && aadhaarDetails.sBackImage ? <img alt='pancard' className='kyc-img' onError={ev => onImageError(ev, 'document')} src={aadhaarDetails.sBackImage && aadhaarDetails.sBackImage.imageUrl ? aadhaarDetails.sBackImage.imageUrl : aadhaarDetails.sBackImage} /> : <img alt='aadhaarcardFront' className={Image ? 'custom-img' : 'custom-img-default'} onError={ev => onImageError(ev, 'document')} src={documentPlaceholder} />
                }
                </div>
              </div>
            </ModalBody>
          </Modal>
        </Draggable>
        <Modal className='modal-confirm' isOpen={modalWarning} toggle={toggleWarning}>
          <ModalBody className='text-center'>
            <img alt='check' className='info-icon' src={warningIcon} />
            <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
            <Row className='row-12'>
              <Col>
                <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={toggleWarning} type='submit'>Cancel</Button>
              </Col>
              <Col>
                <Button className='theme-btn danger-btn full-btn' onClick={onUpdateStatus} type='submit'>{`${type} It`}</Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal className='modal-confirm-bot' isOpen={modal} toggle={handleModalClose}>
          <ModalHeader toggle={handleModalClose}>Reason for Reject</ModalHeader>
          <ModalBody >
            <Col className='p-0 mt-4' md='12'>
              <FormGroup className='px-4'>
                <CustomInput
                  className={errReason ? 'league-placeholder-error' : 'league-placeholder'}
                  id="rejectReason"
                  name="rejectReason"
                  onChange={(event) => handleChange(event, 'Reason')}
                  type="select"
                  value={reason}
                >
                  <option value="">Select reason for rejection</option>
                  {statusType === 'AADHAAR'
                    ? Aadhaar && Aadhaar.length !== 0 && Aadhaar.map((data, i) => {
                      return (
                        <option key={i} value={data}>{data}</option>
                      )
                    })
                    : statusType === 'PAN'
                      ? PAN && PAN.length !== 0 && PAN.map((data, i) => {
                        return (
                          <option key={i} value={data}>{data}</option>
                        )
                      })
                      : ''
                  }
                </CustomInput>
                <p className='error-text'>{errReason}</p>
              </FormGroup>
            </Col>
            <div className='p-4' />
            <Button className='btn-cancel full-btn' disabled={!reason} onClick={() => onUpdateStatus()} type='submit'>SEND</Button>
          </ModalBody>
        </Modal>
      </main>
    </>
  )
})

UserDetails.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}
UserDetails.displayName = UserDetails
export default connect(null, null, null, { forwardRef: true })(UserDetails)
