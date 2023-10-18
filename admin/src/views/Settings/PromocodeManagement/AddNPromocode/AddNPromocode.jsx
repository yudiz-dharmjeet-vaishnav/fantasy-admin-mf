import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Row, Col, FormGroup, Input, CustomInput, Label, UncontrolledAlert, InputGroupText, UncontrolledPopover, PopoverBody, Form, UncontrolledTooltip } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import moment from 'moment'
import PropTypes from 'prop-types'

import infoIcon from '../../../../assets/images/info-icon.svg'

import Loading from '../../../../components/Loading'
import RequiredField from '../../../../components/RequiredField'

import { verifyLength, isNumber, isPositive, modalMessageFunc, alertClass } from '../../../../helpers/helper'
import { getAllLeagues } from '../../../../actions/league'
import { getUpcomingMatchList } from '../../../../actions/match'
import { addNPromocode, getPromocodeDetails, updatePromocode } from '../../../../actions/promocode'

const animatedComponents = makeAnimated()
const AddNPromocode = forwardRef((props, ref) => {
  const { setIsCreate, isCreate, setSubmitDisableButton } = props
  const { id } = useParams()
  const [Name, setName] = useState('')
  const [amount, setAmount] = useState(0)
  const [count, setCount] = useState(0)
  const [pLength, setPLength] = useState(0)
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [maxAllow, setMaxAllow] = useState(0)
  const [promoType, setPromoType] = useState('')
  const [MatchList, setMatchList] = useState([])
  const [Match, setMatch] = useState([])
  const [LeagueList, setLeagueList] = useState([])
  const [leagueInput, setLeagueInput] = useState('')
  const [League, setLeague] = useState([])
  const [SelectedMatchOption, setSelectedMatchOption] = useState([])
  const [SelectedLeagueOption, setSelectedLeagueOption] = useState([])
  const [errPromoType, setErrPromoType] = useState('')
  const [errMatch, setErrMatch] = useState('')
  const [errLeague, setErrLeague] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [errName, setErrName] = useState('')
  const [errAmount, setErrAmount] = useState('')
  const [errCount, setErrCount] = useState('')
  const [errPLength, setErrPLength] = useState('')
  const [errPrefix, setErrPrefix] = useState('')
  const [errSuffix, setErrSuffix] = useState('')
  const [errMinAmount, setErrMinAmount] = useState('')
  const [errMaxAmount, setErrMaxAmount] = useState('')
  const [errmaxAllow, setErrmaxAllow] = useState('')
  const [errStartDate, setErrStartDate] = useState('')
  const [errEndDate, setErrEndDate] = useState('')
  const [errdescription, setErrdescription] = useState('')
  const [Percentage, setPercentage] = useState('N')
  const [promocodeStatus, setPromocodeStatus] = useState('N')
  const [showInFront, setShowInFront] = useState('N')
  const [isMaxAllowForAllUsers, setIsMaxAllowForAllUsers] = useState('N')
  const [maxAllowPerUser, setMaxAllowPerUser] = useState(1)
  const [loading, setLoading] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [matchDetailActivePage, setMatchDetailActivePage] = useState(1)
  const [leagueDetailActivePage, setLeagueDetailActivePage] = useState(1)
  const [matchStart, setMatchStart] = useState(0)
  const [leagueStart, setLeagueStart] = useState(0)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  const promocodeDetails = useSelector(state => state?.promocode?.promocodeDetails)
  const resMessage = useSelector(state => state?.promocode?.resMessage)
  const resStatus = useSelector(state => state?.promocode?.resStatus)
  const sportsList = useSelector(state => state?.sports?.sportsList)
  const upcomingMatchList = useSelector(state => state?.match?.upcomingMatchList)
  const allLeagues = useSelector(state => state?.league?.allLeagues)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const previousProps = useRef({ resMessage, promocodeDetails, allLeagues, upcomingMatchList, leagueInput })?.current
  const [modalMessage, setModalMessage] = useState(false)
  const leagueResDisable = promocodeDetails && previousProps?.promocodeDetails !== promocodeDetails && promocodeDetails?.aLeagues && promocodeDetails?.aLeagues?.map(data => data?._id)
  const leagueDisable = League && League?.length >= 1 && League?.map(data => data?.value)
  const matchResDisable = promocodeDetails && previousProps?.promocodeDetails !== promocodeDetails && promocodeDetails?.aMatches && promocodeDetails?.aMatches?.map(data => data?._id)
  const matchDisable = Match && Match?.length >= 1 && Match?.map(data => data.value)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = promocodeDetails && (previousProps?.promocodeDetails !== promocodeDetails && promocodeDetails?.sName === Name && promocodeDetails?.eType === promoType && JSON?.stringify(matchDisable) === JSON?.stringify(matchResDisable) && JSON?.stringify(leagueDisable) === JSON?.stringify(leagueResDisable) &&
  promocodeDetails?.sInfo === description && promocodeDetails?.nAmount === parseInt(amount) && promocodeDetails?.nCount === parseInt(count) && promocodeDetails?.nLength === parseInt(pLength) && promocodeDetails?.sPrefix === prefix && promocodeDetails?.sSuffix === suffix && promocodeDetails?.nMinAmount === parseInt(minAmount) && promocodeDetails?.nMaxAmount === parseInt(maxAmount) &&
  promocodeDetails?.nMaxAllow === parseInt(maxAllow) && promocodeDetails?.nPerUserUsage === parseInt(maxAllowPerUser) && moment(promocodeDetails?.dStartTime).isSame(startDate) && moment(promocodeDetails?.dExpireTime)?.isSame(endDate) && (promocodeDetails?.bIsPercent === (Percentage === 'Y')) &&
  (promocodeDetails.eStatus === promocodeStatus) && (promocodeDetails?.bMaxAllowForAllUser === (isMaxAllowForAllUsers === 'Y'))) && (promocodeDetails?.bShow === (showInFront === 'Y'))

  useEffect(() => {
    if (id) {
      // dispatch action to get promocodedetails
      dispatch(getPromocodeDetails(id, token))
      setIsCreate(false)
      setLoading(true)
    }
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        setLoading(false)
        if (resStatus && isCreate) {
          navigate('/settings/promocode-management', { state: { message: resMessage } })
        } else {
          if (resStatus) {
            dispatch(getPromocodeDetails(id, token))
          }
        }
        setModalMessage(true)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage])

  useEffect(() => {
    setLeagueList([])
    const callSearchService = () => {
      dispatch(getAllLeagues(0, leagueInput, token))
    }
    if (leagueInput) {
      if (previousProps?.leagueInput !== leagueInput) {
        const debouncer = setTimeout(() => {
          callSearchService()
        }, 1000)
        return () => {
          clearTimeout(debouncer)
          previousProps.leagueInput = leagueInput
        }
      }
    }
    return () => {
      previousProps.leagueInput = leagueInput
    }
  }, [leagueInput])

  useEffect(() => {
    if (previousProps?.promoType !== promoType) {
      if (promoType === 'MATCH') {
        dispatch(getUpcomingMatchList(matchStart, token))
        dispatch(getAllLeagues(leagueStart, leagueInput, token))
        setLoading(true)
      }
    }
    return () => {
      previousProps.promoType = promoType
    }
  }, [promoType, sportsList])

  useEffect(() => {
    if (upcomingMatchList && allLeagues) {
      setLoading(false)
    }
    return () => {
      previousProps.upcomingMatchList = upcomingMatchList
      previousProps.allLeagues = allLeagues
    }
  }, [upcomingMatchList, allLeagues])

  useEffect(() => {
    if (previousProps?.upcomingMatchList !== upcomingMatchList) {
      if (upcomingMatchList) {
        !upcomingMatchList?.results && setErrMatch('')
        const arr = [...MatchList]
        if (upcomingMatchList?.results && upcomingMatchList?.results?.length !== 0) {
          upcomingMatchList?.results?.map((data) => {
            const obj = {
              value: data?._id,
              label:
  <>
    <p className='m-0'>
      {data?.sName}
      {' '}
      (
      {data?.eCategory}
      )
    </p>
    <p className='m-0'>{moment(data?.dStartDate)?.format('DD/MM/YYYY hh:mm:ss A')}</p>
  </>
            }
            arr?.push(obj)
            return arr
          })
          setMatchList(arr)
        }
      }
    }
    return () => {
      previousProps.upcomingMatchList = upcomingMatchList
    }
  }, [upcomingMatchList])

  useEffect(() => {
    if (previousProps?.allLeagues !== allLeagues) {
      if (allLeagues) {
        const arr = [...LeagueList]
        if (allLeagues?.results?.length !== 0) {
          allLeagues?.results?.map((leagueData) => {
            const obj = {
              value: leagueData?._id,
              label: leagueData?.sName + ' (' + leagueData?.eCategory + ')'
            }
            arr?.push(obj)
            return arr
          })
          setLeagueList(arr)
        }
      }
    }
    return () => {
      previousProps.allLeagues = allLeagues
    }
  }, [allLeagues])

  useEffect(() => {
    if (previousProps?.promocodeDetails !== promocodeDetails) {
      if (promocodeDetails) {
        setPromoType(promocodeDetails?.eType)
        setMatch(promocodeDetails?.aMatches && promocodeDetails?.aMatches?.length !== 0
          ? promocodeDetails?.aMatches?.map((data) => (
            {
              value: data?._id,
              label:
            <>
              <p className='m-0'>
                {data?.sName}
                {' '}
                (
                {data.eCategory}
                )
              </p>
              <p className='m-0'>{moment(data?.dStartDate)?.format('DD/MM/YYYY hh:mm:ss A')}</p>
            </>
            })
          )
          : [])
        setLeague(promocodeDetails?.aLeagues?.length !== 0
          ? promocodeDetails?.aLeagues.map((data) => (
            {
              value: data?._id,
              label: data?.sName + ' (' + data?.eCategory + ')'
            })
          )
          : [])
        setSelectedMatchOption(promocodeDetails?.aMatches?.length !== 0
          ? promocodeDetails?.aMatches?.map((data) => (
            {
              value: data?._id,
              label:
            <>
              <p className='m-0'>
                {data?.sName}
                {' '}
                (
                {data?.eCategory}
                )
              </p>
              <p className='m-0'>{moment(data?.dStartDate)?.format('DD/MM/YYYY hh:mm:ss A')}</p>
            </>
            })
          )
          : [])
        setSelectedLeagueOption(promocodeDetails?.aLeagues?.length !== 0
          ? promocodeDetails?.aLeagues?.map((data) => (
            {
              value: data?._id,
              label: data?.sName + ' (' + data?.eCategory + ')'
            })
          )
          : [])
        setName(promocodeDetails?.sName)
        setDescription(promocodeDetails?.sInfo)
        setAmount(promocodeDetails?.nAmount)
        setCount(promocodeDetails?.nCount)
        setPLength(promocodeDetails?.nLength)
        setPrefix(promocodeDetails?.sPrefix)
        setSuffix(promocodeDetails?.sSuffix)
        setMaxAmount(promocodeDetails?.nMaxAmount)
        setMinAmount(promocodeDetails?.nMinAmount)
        setMaxAllow(promocodeDetails?.nMaxAllow)
        setMaxAllowPerUser(promocodeDetails?.nPerUserUsage || 1)
        setStartDate(new Date(moment(promocodeDetails?.dStartTime)?.format()))
        setEndDate(new Date(moment(promocodeDetails?.dExpireTime)?.format()))
        setPromocodeStatus(promocodeDetails?.eStatus)
        setPercentage(promocodeDetails?.bIsPercent ? 'Y' : 'N')
        setShowInFront(promocodeDetails?.bShow ? 'Y' : 'N')
        setIsMaxAllowForAllUsers(promocodeDetails?.bMaxAllowForAllUser ? 'Y' : 'N')
        setLoading(false)
      }
    }
    return () => {
      previousProps.promocodeDetails = promocodeDetails
    }
  }, [promocodeDetails])

  function onLeagueSelect (selectedOption, type) {
    switch (type) {
      case 'League':
        if (selectedOption) {
          setSelectedLeagueOption(selectedOption)
          if (selectedOption?.length >= 1) {
            setErrLeague('')
          } else {
            setErrLeague('Required field')
          }
          setLeague(selectedOption)
        } else {
          setLeague([])
          setSelectedLeagueOption([])
        }
        break
      case 'Match':
        if (selectedOption) {
          setSelectedMatchOption(selectedOption)
          if (selectedOption?.length >= 1) {
            setErrMatch('')
          } else {
            setErrMatch('Required field')
          }
          setMatch(selectedOption)
        } else {
          setMatch([])
          setSelectedMatchOption([])
        }
        break
      default:
        break
    }
  }

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'PromoType':
        if (verifyLength(event?.target?.value, 1)) {
          setErrPromoType('')
        } else {
          setErrPromoType('Required field')
        }
        setPromoType(event?.target?.value)
        if (event?.target?.value === 'MATCH') {
          setMinAmount(0)
          setMaxAmount(0)
        }
        setMatch([])
        setLeague([])
        setSelectedMatchOption([])
        setSelectedLeagueOption([])
        errMinAmount && setErrMinAmount('')
        errMaxAmount && setErrMaxAmount('')
        break
      case 'Name':
        if (verifyLength(event?.target?.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event?.target?.value)
        break
      case 'Amount':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            setErrAmount('')
          } else {
            setErrAmount('Required field')
          }
          setAmount(event?.target?.value)
        }
        break
      case 'Count':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            setErrCount('')
          } else {
            setErrCount('Required field')
          }
          setCount(event?.target?.value)
        }
        break
      case 'PLength':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            setErrPLength('')
          } else {
            setErrPLength('Required field')
          }
          setPLength(event?.target?.value)
        }
        break
      case 'Prefix':
        if (verifyLength(event?.target?.value, 1)) {
          setErrPrefix('')
        } else {
          setErrPrefix('Required field')
        }
        setPrefix(event?.target?.value)
        break
      case 'Suffix':
        if (verifyLength(event?.target?.value, 1)) {
          setErrSuffix('')
        } else {
          setErrSuffix('Required field')
        }
        setSuffix(event?.target?.value)
        break
      case 'Min':
        if (isPositive(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            setErrMinAmount('')
          } else {
            setErrMinAmount('Required field')
          }
          setMinAmount(event?.target?.value)
          if (parseInt(maxAmount) && (parseInt(event?.target?.value) > parseInt(maxAmount))) {
            setErrMinAmount('Minimum amount should be less than Maximum amount!')
          } else {
            setErrMinAmount('')
            setErrMaxAmount('')
          }
        }
        break
      case 'Max':
        if (isPositive(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            setErrMaxAmount('')
          } else {
            setErrMaxAmount('Required field')
          }
          setMaxAmount(event?.target?.value)
          if (parseInt(minAmount) && (parseInt(minAmount) > parseInt(event?.target?.value))) {
            setErrMaxAmount('Maximum amount should be greater than Minimum amount!')
          } else {
            setErrMaxAmount('')
            setErrMinAmount('')
          }
        }
        break
      case 'maxAllow':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            setErrmaxAllow('')
          } else {
            setErrmaxAllow('Required field')
          }
          setMaxAllow(event?.target?.value)
        }
        break
      case 'MaxAllowPerUser':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          setMaxAllowPerUser(event?.target?.value)
        }
        break
      case 'Status':
        setPromocodeStatus(event?.target?.value)
        break
      case 'Percentage':
        setPercentage(event?.target?.value)
        break
      case 'StartDate':
        if (verifyLength(moment(event)?.format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setErrStartDate('')
        } else {
          setErrStartDate('Required field')
        }
        if (moment(event)?.isBefore(moment())) {
          setErrStartDate('Date should be future date')
        }
        setStartDate(event)
        if (moment(event)?.isSame(endDate)) {
          setErrStartDate('Date should be past date from end date!')
        } else {
          setErrEndDate('')
          setErrStartDate('')
        }
        break
      case 'EndDate':
        if (verifyLength(moment(event)?.format('DD/MM/YYYY hh:mm:ss A'), 1)) {
          setErrEndDate('')
        } else {
          setErrEndDate('Required field')
        }
        if (moment(event)?.isBefore(moment()) || moment(event)?.isBefore(startDate)) {
          setErrEndDate('Date should be future date')
        } else if (moment(event)?.isSame(startDate)) {
          setErrEndDate('Date should be future date from start date!')
        } else {
          setErrEndDate('')
          setErrStartDate('')
        }
        setEndDate(event)
        break
      case 'description':
        if (verifyLength(event?.target?.value, 1)) {
          setErrdescription('')
        } else {
          setErrdescription('Required field')
        }
        setDescription(event?.target?.value)
        break
      case 'MaxAllowForAllUsers':
        if (event?.target?.value === 'N') {
          setMaxAllowPerUser(1)
        }
        setIsMaxAllowForAllUsers(event?.target?.value)
        break
      case 'ShowInFront':
        setShowInFront(event?.target?.value)
        break
      default:
        break
    }
  }

  function onAdd (e) {
    let verify = false
    if (promoType === 'DEPOSIT') {
      verify = (verifyLength(Name, 1) && verifyLength(description, 1) && minAmount && maxAmount && parseInt(minAmount) <= parseInt(maxAmount) && (Percentage === 'Y' ? amount <= 100 : amount) && startDate && endDate && !errName && !errStartDate && !errEndDate && !errAmount && !errCount && !errdescription)
    } else if (promoType === 'MATCH') {
      verify = (SelectedMatchOption && SelectedMatchOption.length >= 1 && SelectedLeagueOption && SelectedLeagueOption?.length >= 1 && verifyLength(Name, 1) && verifyLength(description, 1) && (Percentage === 'Y' ? amount <= 100 : amount) && startDate && endDate && !errName && !errStartDate && !errEndDate && !errAmount && !errCount && !errdescription && !errMatch && !errLeague)
    } else if (promoType === 'NEWUSER') {
      verify = (verifyLength(Name, 1) && verifyLength(description, 1) && minAmount && maxAmount && parseInt(minAmount) <= parseInt(maxAmount) && (Percentage === 'Y' ? amount <= 100 : amount) && startDate && endDate && !errName && !errStartDate && !errEndDate && !errAmount && !errCount && !errdescription)
    }
    if (verify) {
      let startingDate, endingDate
      if (startDate && endDate) {
        startingDate = new Date(startDate)?.toISOString()
        endingDate = new Date(endDate)?.toISOString()
      }
      const selectedMatches = []
      SelectedMatchOption && SelectedMatchOption?.map((data) => {
        selectedMatches?.push(data?.value)
        return selectedMatches
      })
      const selectedLeagues = []
      SelectedLeagueOption && SelectedLeagueOption.map((data) => {
        selectedLeagues?.push(data?.value)
        return selectedLeagues
      })
      if (isCreate) {
        const addPromocodeData = {
          promoType, selectedMatches, selectedLeagues, Name, description, amount, count: Number(count), pLength: Number(pLength), prefix, suffix, minAmount, maxAmount, maxAllow, maxAllowPerUser, startingDate, endingDate, Percentage: Percentage === 'Y', promocodeStatus, isMaxAllowForAllUsers: isMaxAllowForAllUsers === 'Y', showInFront: showInFront === 'Y', token
        }
        dispatch(addNPromocode(addPromocodeData))
      } else {
        const updatePromocodeData = {
          promoType, selectedMatches, selectedLeagues, Name, description, amount, count: Number(count), pLength: Number(pLength), prefix, suffix, minAmount, maxAmount, maxAllow, maxAllowPerUser, startingDate, endingDate, Percentage: Percentage === 'Y', promocodeStatus, isMaxAllowForAllUsers: isMaxAllowForAllUsers === 'Y', showInFront: showInFront === 'Y', token
        }
        dispatch(updatePromocode(updatePromocodeData))
      }
      setLoading(true)
    } else {
      if (!verifyLength(Name, 1)) {
        setErrName('Required field')
      }
      if (!verifyLength(description, 1)) {
        setErrdescription('Required field')
      }
      if (!startDate) {
        setErrStartDate('Required field')
      }
      if (!endDate) {
        setErrEndDate('Required field')
      }
      if (!amount) {
        setErrAmount('Required field')
      }
      if (!count) {
        setErrCount('Required field')
      }
      if (!pLength) {
        setErrPLength('Required field')
      }
      if (!prefix) {
        setErrPrefix('Required field')
      }
      if (!suffix) {
        setErrSuffix('Required field')
      }
      if (promoType === 'DEPOSIT' && (parseInt(minAmount) > parseInt(maxAmount))) {
        setErrMaxAmount('Maximum amount should be greater than Minimum Amount')
      }
      if ((promoType === 'DEPOSIT' || promoType === '') && !minAmount) {
        setErrMinAmount('Required field')
      }
      if ((promoType === 'DEPOSIT' || promoType === '') && !maxAmount) {
        setErrMaxAmount('Required field')
      }
      if (!maxAllow) {
        setErrmaxAllow('Required field')
      }
      if (!promoType) {
        setErrPromoType('Required field')
      }
      if (promoType === 'MATCH' && SelectedMatchOption?.length === 0) {
        setErrMatch('Required field')
      }
      if (promoType === 'MATCH' && SelectedLeagueOption?.length === 0) {
        setErrLeague('Required field')
      }
      if (promoType === 'NEWUSER' && (parseInt(minAmount) > parseInt(maxAmount))) {
        setErrMaxAmount('Maximum amount should be greater than Minimum Amount')
      }
      if ((promoType === 'NEWUSER' || promoType === '') && !minAmount) {
        setErrMinAmount('Required field')
      }
      if ((promoType === 'NEWUSER' || promoType === '') && !maxAmount) {
        setErrMaxAmount('Required field')
      }
      if (Percentage === 'Y' && amount >= 100) {
        setErrAmount('Percentage must be between 0 and 100')
      }
    }
  }

  function onMatchPagination () {
    const length = Math?.ceil(upcomingMatchList?.total / 10)
    if (matchDetailActivePage < length) {
      const start = matchDetailActivePage * 10
      setMatchStart(start)
      dispatch(getUpcomingMatchList(start, token))
      setMatchDetailActivePage(matchDetailActivePage + 1)
    }
  }

  function onLeaguePagination () {
    const length = Math?.ceil(allLeagues?.total / 10)
    if (leagueDetailActivePage < length) {
      const start = leagueDetailActivePage * 10
      setLeagueStart(start)
      dispatch(getAllLeagues(start, leagueInput, token))
      setLeagueDetailActivePage(leagueDetailActivePage + 1)
    }
  }

  function handleInputChange (value) {
    setLeagueInput(value)
  }

  const ExampleCustomInput = forwardRef(({ value, onClick, placeHolder }, ref) => (
    <div className=' date-range'>
      <Input ref={ref} className={errEndDate && errStartDate ? 'league-placeholder-error' : 'league-placeholder'} onClick={onClick} placeholder={placeHolder} readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  useImperativeHandle(ref, () => ({
    onAdd
  }))
  return (
    <main className="main-content">
      {
        modalMessage && message &&
        (<UncontrolledAlert className={alertClass(status, close)} color="primary">{message}</UncontrolledAlert>)
      }
      {loading && <Loading />}
      <section className="common-form-block common-box common-detail">
        <Form>
          <Row>
            <Col xl={12} lg={12} md={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="promocodeType">
                  Promocode Type
                  {' '}
                  <span className="required-field">*</span>
                </Label>
                <CustomInput disabled={adminPermission?.PROMO === 'R'} type="select" name="promoType" id="promoType" className={errPromoType ? 'league-placeholder-error' : 'form-control'} value={promoType} onChange={event => handleChange(event, 'PromoType')}>
                  <option value=''>Select Type</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="MATCH">Match/Contest</option>
                  <option value="NEWUSER">New User</option>

                </CustomInput>
                <p className="error-text">{errPromoType}</p>
              </FormGroup>
            </Col>
          </Row>
          {promoType === 'MATCH' && (
          <Row className='mt-3'>
            <Col lg={12} md={12} xl={12} >
              <FormGroup>
                <Label className='edit-label-setting' for="LeagueName">
                  Match List
                  <RequiredField/>
                </Label>
                <Select
                  captureMenuScroll={true}
              // menuPosition="fixed"
                  className={errMatch ? 'league-placeholder-error' : 'promo-select'}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  id="Match"
                  isDisabled={adminPermission?.PROMO === 'R'}
                  isMulti={true}
                  menuPlacement="auto"
                  name="Match"
                  onChange={selectedOption => onLeagueSelect(selectedOption, 'Match')}
                  onMenuScrollToBottom={onMatchPagination}
                  options={MatchList}
                  placeholder="Select Match"
                  value={Match}
                />
                <p className="error-text">{errMatch}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {promoType === 'MATCH' && (
          <Row className='mt-3'>
            <Col lg={12} md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="LeagueName">
                  League List
                  <RequiredField/>
                </Label>
                <Select
                  captureMenuScroll={true}
              // menuPosition="fixed"
                  className={errLeague ? 'league-placeholder-error' : 'promo-select'}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  id="League"
                  isDisabled={adminPermission?.PROMO === 'R'}
                  isMulti={true}
                  menuPlacement="auto"
                  name="League"
                  onChange={selectedOption => onLeagueSelect(selectedOption, 'League')}
                  onInputChange={(value) => handleInputChange(value)}
                  onMenuScrollToBottom={onLeaguePagination}
                  options={LeagueList}
                  placeholder="Select League"
                  value={League}
                />
                <p className="error-text">{errLeague}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          <Row className='mt-3'>
            <Col lg={6} md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Name">
                  Promo Name
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errName ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PROMO === 'R'} id="Name" onChange={event => handleChange(event, 'Name')} placeholder="Enter Promo Name" type="text" value={Name} />
                <p className="error-text">{errName}</p>
              </FormGroup>
            </Col>
            <Col lg={6} md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Amount">
                  Promocode Counts
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errCount ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PROMO === 'R'} id="Amount" onChange={event => handleChange(event, 'Count')} placeholder="Enter Count" type="number" value={count} />
                <p className="error-text">{errCount}</p>
              </FormGroup>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col lg={12} md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="pLength">
                  Promocode Length
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errPLength ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PROMO === 'R'} id="pLength" onChange={event => handleChange(event, 'PLength')} placeholder="Enter Length" type="number" value={pLength} />
                <p className="error-text">{errPLength}</p>
              </FormGroup>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col lg={6} md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Prefix">
                  Prefix
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errPrefix ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PROMO === 'R'} id="Prefix" onChange={event => handleChange(event, 'Prefix')} placeholder="Enter Prefix" type="text" value={prefix} />
                <p className="error-text">{errPrefix}</p>
              </FormGroup>
            </Col>
            <Col lg={6} md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Suffix">
                  Suffix
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errSuffix ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PROMO === 'R'} id="Suffix" onChange={event => handleChange(event, 'Suffix')} placeholder="Enter Suffix" type="text" value={suffix} />
                <p className="error-text">{errSuffix}</p>
              </FormGroup>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col lg={6} md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Amount">
                  Amount/Percentage
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errAmount ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PROMO === 'R'} id="Amount" onChange={event => handleChange(event, 'Amount')} placeholder="Enter Amount" type="text" value={amount} />
                <p className="error-text">{errAmount}</p>
              </FormGroup>
            </Col>
            <Col lg={6} md={6} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="maxAllow">
                  Maximum Allow
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errmaxAllow ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.PROMO === 'R'} id="MaxAllowAllUsers" onChange={event => handleChange(event, 'maxAllow')} placeholder="Enter maximum allow" type="text" value={maxAllow} />
                <p className="error-text">{errmaxAllow}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col lg={6} md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="minPrice">
                  Min Price
                  {' '}
                  {promoType !== 'MATCH' && (<RequiredField/>)}
                </Label>
                {((adminPermission?.PROMO === 'R') || promoType === 'MATCH')
                  ? <InputGroupText>{minAmount}</InputGroupText>
                  : <Input className={errMinAmount ? 'league-placeholder-error' : 'league-placeholder'} disabled={(adminPermission?.PROMO === 'R') || promoType === 'MATCH'} id="minPrice" onChange={event => handleChange(event, 'Min')} placeholder="Enter Min Value" type="text" value={minAmount} />
             }
                <p className="error-text">{errMinAmount}</p>
              </FormGroup>
            </Col>
            <Col lg={6} md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="maxPrice">
                  Max Price
                  {' '}
                  {promoType !== 'MATCH' && (<RequiredField/>)}
                </Label>
                {
                ((adminPermission?.PROMO === 'R') || promoType === 'MATCH')
                  ? <InputGroupText>{maxAmount}</InputGroupText>
                  : <Input className={errMaxAmount ? 'league-placeholder-error' : 'league-placeholder'} disabled={(adminPermission?.PROMO === 'R') || promoType === 'MATCH'} id="maxPrice" onChange={event => handleChange(event, 'Max')} placeholder="Enter Max Value" type="text" value={maxAmount} />
              }
                <p className="error-text">{errMaxAmount}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='p-3 mt-2'>
            <div className='radio-button-div'>
              <Col lg={12} md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="MaxAllowForAllUsers">
                    Want to change promo usage allowance per user?
                    {' '}
                    <img className='custom-info' id='Promo' src={infoIcon} />
                    <UncontrolledTooltip className="bg-default-s" delay={0} placement="right-center" target="Promo">
                      <p>No: Can use promocode only 1 time</p>
                      <p>Yes: Can allow as many as you want in Maximum Allow(Per User) field</p>
                      <p>Note: This is for per user</p>
                    </UncontrolledTooltip>
                  </Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={isMaxAllowForAllUsers === 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="MaxAllowForAllUsers1"
                      label="Yes"
                      name="MaxAllowForAllUsers"
                      onChange={event => handleChange(event, 'MaxAllowForAllUsers')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={isMaxAllowForAllUsers !== 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="MaxAllowForAllUsers2"
                      label="No"
                      name="MaxAllowForAllUsers"
                      onChange={event => handleChange(event, 'MaxAllowForAllUsers')}
                      type="radio"
                      value="N"
                    />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>

          <Row className='mt-2'>
            <Col lg={12} md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="MaxAllowPerUser">
                  Maximum Allow(Per User)
                  {' '}
                  <img className='custom-info' id='MaxAllow' src={infoIcon} />
                  <UncontrolledPopover placement="bottom" target='MaxAllow' trigger="legacy">
                    <PopoverBody>
                      <p>Maximum allow will be considered per league</p>
                      <p>E.g. If maximum allow is 5 and there are two leagues, for both leagues maximum allow will be 5, 5(Total will be 10)</p>
                    </PopoverBody>
                  </UncontrolledPopover>
                </Label>
                {isMaxAllowForAllUsers === 'Y'
                  ? <Input disabled={(adminPermission?.PROMO === 'R') || isMaxAllowForAllUsers === 'N'} id="MaxAllowPerUser" onChange={event => handleChange(event, 'MaxAllowPerUser')} placeholder="Enter maximum allow per user" type="text" value={maxAllowPerUser} />
                  : <InputGroupText>{maxAllowPerUser}</InputGroupText>}
              </FormGroup>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col lg={6} md={12} xl={6}>
              <FormGroup className='d-flex flex-column'>
                <Label className='edit-label-setting' for="startDate">
                  Start Date & Time
                  {' '}
                  <RequiredField/>
                </Label>
                <DatePicker
                  customInput={<ExampleCustomInput placeHolder='Enter Start Date' />}
                  dateFormat="dd-MM-yyyy h:mm aa"
                  disabled={adminPermission?.PROMO === 'R'}
                  onChange={(date) => { handleChange(date, 'StartDate') }}
                  selected={startDate}
                  showTimeSelect
                  timeIntervals={15}
                  value={startDate}
                />
                <p className="error-text">{errStartDate}</p>
              </FormGroup>
            </Col>
            <Col lg={6} md={12} xl={6}>
              <FormGroup className='d-flex flex-column'>
                <Label className='edit-label-setting' for="endDate">
                  End Date & Time
                  {' '}
                  <RequiredField/>
                </Label>
                <DatePicker
                  customInput={<ExampleCustomInput placeHolder='Enter End Date' />}
                  dateFormat="dd-MM-yyyy h:mm aa"
                  disabled={adminPermission?.PROMO === 'R'}
                  onChange={(date) => { handleChange(date, 'EndDate') }}
                  selected={endDate}
                  showTimeSelect
                  timeIntervals={15}
                  value={endDate}
                />
                <p className="error-text">{errEndDate}</p>
              </FormGroup>
            </Col>
          </Row>
          <Row className='p-3 mt-2'>
            <div className='d-flex radio-button-div'>
              <Col lg={12} md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="Percentage">Percentage</Label>
                  <div className="d-flex inline-input">
                    <CustomInput
                      checked={Percentage === 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="PerRadio1"
                      label="Yes"
                      name="Percentage"
                      onChange={event => handleChange(event, 'Percentage')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={Percentage !== 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="PerRadio2"
                      label="No"
                      name="Percentage"
                      onChange={event => handleChange(event, 'Percentage')}
                      type="radio"
                      value="N"
                    />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>

          <Row className='p-3 mt-2'>
            <div className='radio-button-div '>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label for="Status">Show In Front</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={showInFront === 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="ShowInFrontRadio1"
                      label="Show"
                      name="ShowInFront"
                      onChange={event => handleChange(event, 'ShowInFront')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={showInFront !== 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="ShowInFrontRadio2"
                      label="Hide"
                      name="ShowInFront"
                      onChange={event => handleChange(event, 'ShowInFront')}
                      type="radio"
                      value="N"
                    />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>

          <Row className='p-3 mt-3'>
            <div className='d-flex radio-button-div'>
              <Col lg={12} md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="Status">Status</Label>
                  <div className="d-flex inline-input">
                    <CustomInput
                      checked={promocodeStatus === 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="StatusRadio1"
                      label="Active"
                      name="Status"
                      onChange={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={promocodeStatus !== 'Y'}
                      disabled={adminPermission?.PROMO === 'R'}
                      id="StatusRadio2"
                      label="In Active"
                      name="Status"
                      onChange={event => handleChange(event, 'Status')}
                      type="radio"
                      value="N"
                    />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>
          <Row className='mt-3'>
            <Col lg={12} md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="description">
                  Description
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errdescription ? 'league-placeholder-error ' : 'read-only-class'} disabled={adminPermission?.PROMO === 'R'} id="description" onChange={event => handleChange(event, 'description')} placeholder="Enter Description of promocode" type="textarea" value={description} />
                <p className="error-text">{errdescription}</p>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </section>
    </main>
  )
})

AddNPromocode.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  value: PropTypes.string,
  onClick: PropTypes.func,
  placeHolder: PropTypes.string,
  setIsCreate: PropTypes.func,
  isCreate: PropTypes.bool,
  setSubmitDisableButton: PropTypes.func,
  navigate: PropTypes.object

}

AddNPromocode.displayName = AddNPromocode
export default connect(null, null, null, { forwardRef: true })(AddNPromocode)
