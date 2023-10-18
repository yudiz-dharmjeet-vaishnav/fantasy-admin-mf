import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'
import { Row, Col, FormGroup, Input, CustomInput, Label, Button, InputGroupText, Modal, ModalBody, Form, InputGroup, UncontrolledTooltip, ModalHeader } from 'reactstrap'
import { useDispatch, useSelector, connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import makeAnimated from 'react-select/animated'
import Select from 'react-select'
import PropTypes from 'prop-types'

import infoIcon from '../../../assets/images/info-icon.svg'
import rupeesIcon from '../../../assets/images/rupees-icon.svg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import RequiredField from '../../../components/RequiredField'

import { verifyLength, isNumber, isPositive, isFloat, modalMessageFunc } from '../../../helpers/helper'
import { settingForValidation } from '../../../actions/setting'
import { getFilterCategory, getListOfCategory } from '../../../actions/leaguecategory'
import { copyLeague, getGameCategory, getLeagueDetails, getLeagueAnalytics } from '../../../actions/league'

const animatedComponents = makeAnimated()
const AddLeague = forwardRef((props, ref) => {
  const {
    AddNewLeague,
    priceBreakUpPage,
    UpdateLeague,
    setIsCreate,
    isCreate,
    leagueAnalyticsModalOpen,
    toggleMessage,
    toggleModal,
    modalOpen,
    setUpdateDisableButton,
    setModalOpen,
    setLeagueLoading,
    leagueLoading
  } = props

  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(0)
  const [LeagueName, setLeagueName] = useState('')
  const [Position, setPosition] = useState('')
  const [errPosition, seterrPosition] = useState('')
  const [LoyaltyPoint, setLoyaltyPoint] = useState('')
  const [LeagueCategory, setLeagueCategory] = useState('')
  const [GameCategory, setGameCategory] = useState('')
  const [FilterCategory, setFilterCategory] = useState('')
  const [minEntry, setminEntry] = useState(0)
  const [maxEntry, setmaxEntry] = useState(0)
  const [entryFee, setEntryFee] = useState(0)
  const [botCreate, setBotCreate] = useState('N')
  const [minTeamCount, setMinTeamCount] = useState(0)
  const [TeamJoinLimit, setTeamJoinLimit] = useState(1)
  const [winnersCount, setwinnersCount] = useState(0)
  const [TotalPayout, setTotalPayout] = useState(0)
  const [DeductPercent, setDeducePercent] = useState(0)
  const [BonusUtil, setBonusUtil] = useState(0)
  const [errLeagueName, setErrLeagueName] = useState('')
  const [errGameCategory, setErrGameCategory] = useState('')
  const [errFilterCategory, setErrFilterCategory] = useState('')
  const [errLeagueCategory, setErrLeagueCategory] = useState('')
  const [errTeamJoinLimit, setErrTeamJoinLimit] = useState('')
  const [errwinnersCount, setErrwinnersCount] = useState('')
  const [errminEntry, setErrminEntry] = useState('')
  const [errmaxEntry, setErrmaxEntry] = useState('')
  const [errMinTeamCount, setErrMinTeamCount] = useState('')
  const [errPrice, seterrPrice] = useState('')
  const [errTotalPayout, seterrTotalPayout] = useState('')
  const [errDeducePercent, seterrDeducePercent] = useState('')
  const [errBonusUtil, seterrBonusUtil] = useState('')
  const [ConfirmLeague, setConfirmLeague] = useState('N')
  const [multipleEntry, setmultipleEntry] = useState('N')
  const [unlimitedJoin, setUnlimitedJoin] = useState('N')
  const [minCashbackTeam, setMinCashbackTeam] = useState(0)
  const [cashBackAmount, setCashBackAmount] = useState(0)
  const [cashbackType, setCashbackType] = useState('')
  const [errCashbackTeam, setErrCashbackTeam] = useState('')
  const [errCashbackAmount, setErrCashbackAmount] = useState('')
  const [errCashbackType, setErrCashbackType] = useState('')
  const [autoCreate, setautoCreate] = useState('N')
  const [poolPrize, setpullPrize] = useState('N')
  const [cashbackEnabled, setCashbackEnabled] = useState('N')
  const [copyBotPerTeam, setCopyBotPerTeam] = useState(0)
  const [copyBotPerTeamErr, setCopyBotPerTeamErr] = useState('')
  const [active, setactive] = useState('N')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [sportsType, setSportsType] = useState([])
  const [options, setOptions] = useState([])
  const [sportsErr, setSportsErr] = useState('')
  const [selectedOption, setSelectedOption] = useState([])
  const [leagueId, setLeagueId] = useState('')
  const [sameCopyBotTeam, setSameCopyBotTeam] = useState(0)
  const [sameCopyBotTeamErr, setSameCopyBotTeamErr] = useState('')
  const [autoFillSpots, setAutoFillSpots] = useState(0)
  const [autoFillSpotsErr, setAutoFillSpotsErr] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token)
  const LeagueDetails = useSelector((state) => state.league.LeagueDetails)
  const LeagueCategoryList = useSelector((state) => state.leaguecategory.LeaguecategoryList)
  const GameCategoryList = useSelector((state) => state.league.GamecategoryList)
  const FilterList = useSelector((state) => state.leaguecategory.FiltercategoryList)
  const validation = useSelector((state) => state.setting.validation)
  const resStatus = useSelector((state) => state.league.resStatus)
  const resMessage = useSelector((state) => state.league.resMessage)
  const addedLeague = useSelector((state) => state.league.addedLeague)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const Auth = useSelector(
    (state) => state.auth.adminData && state.auth.adminData.eType
  )
  const LeagueAnalytics = useSelector(
    (state) => state.league.LeagueAnalyticsList
  )
  const previousProps = useRef({
    resStatus,
    resMessage,
    LeagueDetails
  }).current

  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const updateDisable = LeagueDetails && previousProps.LeagueDetails !== LeagueDetails && LeagueDetails?.bAutoCreate === (autoCreate === 'Y') && LeagueDetails?.bBotCreate === (botCreate === 'Y') &&
                        LeagueDetails?.bCashbackEnabled === (cashbackEnabled === 'Y') && LeagueDetails?.bConfirmLeague === (ConfirmLeague === 'Y') && LeagueDetails?.bMultipleEntry === (multipleEntry === 'Y') && LeagueDetails?.bPoolPrize === (poolPrize === 'Y') &&
                        LeagueDetails?.bUnlimitedJoin === (unlimitedJoin === 'Y') && LeagueDetails?.eCashbackType === cashbackType && LeagueDetails?.eCategory === GameCategory && LeagueDetails?.eStatus === active && LeagueDetails?.iFilterCatId === FilterCategory &&
                        LeagueDetails?.iLeagueCatId === LeagueCategory && LeagueDetails?.nBonusUtil === parseInt(BonusUtil) && LeagueDetails?.nCashbackAmount === parseInt(cashBackAmount) && LeagueDetails?.nCopyBotsPerTeam === parseInt(copyBotPerTeam) &&
                        LeagueDetails?.nDeductPercent === parseInt(DeductPercent) && LeagueDetails?.nLoyaltyPoint === parseInt(LoyaltyPoint) && LeagueDetails?.nMax === parseInt(maxEntry) && LeagueDetails?.nMin === parseInt(minEntry) && LeagueDetails?.nMinCashbackTeam === parseInt(minCashbackTeam) &&
                        LeagueDetails.nMinTeamCount === parseInt(minTeamCount) && LeagueDetails?.nPosition === parseInt(Position) && LeagueDetails?.nPrice === parseInt(entryFee) && LeagueDetails?.nTeamJoinLimit === parseInt(TeamJoinLimit) && LeagueDetails?.nTotalPayout === parseInt(TotalPayout) && LeagueDetails?.nWinnersCount === parseInt(winnersCount) &&
                        LeagueDetails?.iFilterCatId === FilterCategory && LeagueDetails?.iLeagueCatId === LeagueCategory && LeagueDetails?.sName === LeagueName && LeagueDetails?.nSameCopyBotTeam === parseInt(sameCopyBotTeam) && LeagueDetails?.nAutoFillSpots === autoFillSpots

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      setLoading(true)
    } else {
      setIsCreate(true)
      // dispatch action to get list of category, games category, filter category
      dispatch(getListOfCategory(token))
      dispatch(getGameCategory(token))
      dispatch(getFilterCategory(token))
    }
    dispatch(settingForValidation('PUBC', token))
  }, [])

  useEffect(() => {
    setUpdateDisableButton(updateDisable)
  }, [updateDisable])

  //  set legaueCategoryList
  useEffect(() => {
    if ((isEdit && LeagueCategoryList) || (!resStatus && resMessage)) {
      const index = LeagueCategoryList?.findIndex(
        (list) => list._id === LeagueCategory
      )
      index >= 0
        ? setLeagueCategory(LeagueCategoryList[index]._id)
        : setLeagueCategory('')
    }
  }, [LeagueCategoryList])

  //  set gameCategoryList
  useEffect(() => {
    if ((isEdit && GameCategoryList) || (!resStatus && resMessage)) {
      const index = GameCategoryList?.findIndex(
        (list) => list?.sKey === GameCategory
      )
      index >= 0
        ? setGameCategory(GameCategoryList[index].sKey)
        : setGameCategory('')
    }
  }, [GameCategoryList])

  //  set filterCategoryList
  useEffect(() => {
    if ((isEdit && FilterList) || (!resStatus && resMessage)) {
      const index = FilterList?.findIndex(
        (list) => list._id === FilterCategory
      )
      index >= 0
        ? setFilterCategory(FilterList[index]._id)
        : setFilterCategory('')
    }
  }, [FilterList, FilterCategory])

  //  set validate min-max field
  useEffect(() => {
    if (previousProps.validation !== validation && validation) {
      setMinValue(validation.nMin)
      setMaxValue(validation.nMax)
      setLoading(false)
    }
    return () => {
      previousProps.validation = validation
    }
  }, [validation])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          navigate(
            `${priceBreakUpPage}/${addedLeague && addedLeague._id}`,
            { state: { message: resMessage } }
          )
        } else {
          if (resStatus) {
            setIsEdit(false)
          } else if (!isCreate) {
            dispatch(getLeagueDetails(id, token))
            dispatch(getLeagueAnalytics(id, token))
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

  // use effect to set league details
  useEffect(() => {
    if (LeagueDetails) {
      if (
        previousProps.LeagueDetails !== LeagueDetails ||
        (!resStatus && resMessage)
      ) {
        dispatch(getListOfCategory(token))
        dispatch(getGameCategory(token))
        dispatch(getFilterCategory(token))
        setTeamJoinLimit(LeagueDetails.nTeamJoinLimit)
        setwinnersCount(LeagueDetails.nWinnersCount)
        setLoyaltyPoint(LeagueDetails.nLoyaltyPoint)
        setLeagueName(LeagueDetails.sName)
        setLeagueCategory(LeagueDetails.iLeagueCatId)
        setFilterCategory(LeagueDetails.iFilterCatId)
        setminEntry(LeagueDetails.nMin)
        setmaxEntry(LeagueDetails.nMax)
        setEntryFee(LeagueDetails.nPrice)
        setTotalPayout(LeagueDetails.nTotalPayout)
        setDeducePercent(LeagueDetails.nDeductPercent)
        setBonusUtil(LeagueDetails.nBonusUtil)
        setConfirmLeague(LeagueDetails.bConfirmLeague === true ? 'Y' : 'N')
        setmultipleEntry(LeagueDetails.bMultipleEntry === true ? 'Y' : 'N')
        setUnlimitedJoin(LeagueDetails.bUnlimitedJoin === true ? 'Y' : 'N')
        setautoCreate(LeagueDetails.bAutoCreate === true ? 'Y' : 'N')
        setactive(LeagueDetails.eStatus)
        setpullPrize(LeagueDetails.bPoolPrize === true ? 'Y' : 'N')
        setPosition(LeagueDetails.nPosition)
        setGameCategory(LeagueDetails.eCategory)
        setMinCashbackTeam(LeagueDetails.nMinCashbackTeam)
        setCashBackAmount(LeagueDetails.nCashbackAmount)
        setCashbackType(LeagueDetails.eCashbackType)
        setMinTeamCount(LeagueDetails.nMinTeamCount)
        setBotCreate(LeagueDetails.bBotCreate === true ? 'Y' : 'N')
        setCashbackEnabled(LeagueDetails.bCashbackEnabled === true ? 'Y' : 'N')
        setCopyBotPerTeam(LeagueDetails.nCopyBotsPerTeam)
        setAutoFillSpots(LeagueDetails?.nAutoFillSpots || 0)
        setLoading(false)
        setSameCopyBotTeam(LeagueDetails?.nSameCopyBotTeam || 0)
      }
    }
    return () => {
      previousProps.LeagueDetails = LeagueDetails
      previousProps.resMessage = resMessage
      previousProps.resStatus = resStatus
    }
  }, [LeagueDetails, resStatus, resMessage])

  // handleChange function to handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'LeagueName':
        if (verifyLength(event.target.value, 1)) {
          setErrLeagueName('')
        } else {
          setErrLeagueName('Required field')
        }
        setLeagueName(event.target.value)
        break
      case 'LeagueCategory':
        if (event.target.value) {
          setErrLeagueCategory('')
        } else {
          setErrLeagueCategory('Required field')
        }
        setLeagueCategory(event.target.value)
        break
      case 'GameCategory':
        if (event.target.value) {
          setErrGameCategory('')
        } else {
          setErrGameCategory('Required field')
        }
        setGameCategory(event.target.value)
        break
      case 'FilterCategory':
        if (event.target.value) {
          setErrFilterCategory('')
        } else {
          setErrFilterCategory('Required field')
        }
        setFilterCategory(event.target.value)
        break
      case 'Position':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            seterrPosition('')
          } else {
            seterrPosition('Required field')
          }
          setPosition(event.target.value)
        }
        break
      case 'LoyaltyPoint':
        if (isNumber(event.target.value) || !event.target.value) {
          setLoyaltyPoint(event.target.value)
        }
        break
      case 'minEntry':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrminEntry('')
          } else {
            setErrminEntry('Required field')
          }
          setminEntry(event.target.value)
          if (parseInt(event.target.value) < parseInt(minValue)) {
            setErrminEntry(`Must be greater than ${minValue}`)
          } else if (
            maxEntry &&
            parseInt(event.target.value) > parseInt(maxEntry)
          ) {
            setErrminEntry('Minimum entry should be less than Maximum entry!')
          } else {
            setErrminEntry('')
            setErrmaxEntry('')
          }
        }
        break
      case 'maxEntry':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrmaxEntry('')
          } else {
            setErrmaxEntry('Required field')
          }
          setmaxEntry(event.target.value)
          if (parseInt(event.target.value) > parseInt(maxValue)) {
            setErrmaxEntry(`Must be less than ${maxValue}`)
          } else if (
            minEntry &&
            parseInt(minEntry) > parseInt(event.target.value)
          ) {
            setErrmaxEntry(
              'Maximum entry should be greater than Minimum entry!'
            )
          } else {
            setErrmaxEntry('')
          }
        }
        break
      case 'entryFee':
        if (!event.target.value) {
          seterrPrice('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            seterrPrice('Value must be number!')
          } else {
            seterrPrice('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          seterrPrice('')
        }
        setEntryFee(event.target.value)
        break
      case 'AutoFillSpots':
        if (isNumber(event.target.value)) {
          setAutoFillSpotsErr('')
        } else {
          setAutoFillSpotsErr('Value must be positive!')
        }
        setAutoFillSpots(event.target.value)
        break
      case 'poolPrize':
        setpullPrize(event.target.value)
        if (unlimitedJoin === 'Y') {
          event.target.value === 'N' && setUnlimitedJoin('N')
        }
        break
      case 'TeamJoinLimit':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value && multipleEntry === 'Y') {
            parseInt(event.target.value) < 2
              ? setErrTeamJoinLimit('Value must be greater than 2')
              : setErrTeamJoinLimit('')
          } else if (event.target.value > 0) {
            setErrTeamJoinLimit('')
          } else if (event.target.value === '') {
            setErrTeamJoinLimit('Required field')
          }
          setTeamJoinLimit(event.target.value)
        }
        break
      case 'winnersCount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value > 0) {
            setErrwinnersCount('')
          } else {
            setErrwinnersCount('Required field')
          }
          setwinnersCount(event.target.value)
        }
        break
      case 'TotalPayout':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value >= 0) {
            seterrTotalPayout('')
          } else {
            seterrTotalPayout('Required field')
          }
          setTotalPayout(event.target.value)
        }
        break
      case 'DeductPercent':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value >= 0 && event.target.value <= 100) {
            seterrDeducePercent('')
          } else if (event.target.value >= 100) {
            seterrBonusUtil('Value must be less than 100')
          } else {
            seterrDeducePercent('Required field')
          }
          setDeducePercent(event.target.value)
        }
        break
      case 'BonusUtil':
        if (isNumber(event.target.value) || !event.target.value) {
          if (event.target.value >= 0 && event.target.value <= 100) {
            seterrBonusUtil('')
          } else if (event.target.value >= 100) {
            seterrBonusUtil('Value must be less than 100')
          } else {
            seterrBonusUtil('Required field')
          }
          setBonusUtil(event.target.value)
        }
        break
      case 'ConfirmLeague':
        setConfirmLeague(event.target.value)
        break
      case 'multipleEntry':
        if (event.target.value === 'Y') {
          setmultipleEntry(event.target.value)
          if (TeamJoinLimit > 1) {
            setErrTeamJoinLimit('')
          }
          if (minCashbackTeam > 1) {
            setErrCashbackTeam('')
          }
        } else {
          setmultipleEntry(event.target.value)
          setTeamJoinLimit(1)
          setErrTeamJoinLimit('')
          if (minCashbackTeam > 1) {
            setErrCashbackTeam('Team must be less than 2')
          }
        }
        break
      case 'unlimitedJoin':
        setUnlimitedJoin(event.target.value)
        break
      case 'autoCreate':
        setautoCreate(event.target.value)
        break
      case 'active':
        setactive(event.target.value)
        break
      case 'cashbackEnabled':
        if (event.target.value === 'N') {
          setCashbackType('')
          setMinCashbackTeam(0)
          setCashBackAmount(0)
          setErrCashbackAmount('')
          setErrCashbackTeam('')
          setErrCashbackType('')
        }
        setCashbackEnabled(event.target.value)
        break
      case 'MinCashbackTeam':
        if (isNumber(event.target.value) || !event.target.value) {
          if (multipleEntry === 'N' && event.target.value > 1) {
            setErrCashbackTeam('Team must be less than 2')
          } else {
            setErrCashbackTeam('')
          }
          setMinCashbackTeam(event.target.value)
          if (!event.target.value) {
            setCashBackAmount(0)
            setCashbackType('')
          }
          if (event.target.value > 0 && !cashBackAmount) {
            setErrCashbackAmount('Required field')
          } else {
            setErrCashbackAmount('')
          }
          if (event.target.value > 0 && !cashbackType) {
            setErrCashbackType('Required field')
          } else {
            setErrCashbackType('')
          }
        }
        break
      case 'CashbackAmount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (isNumber(event.target.value)) {
            setErrCashbackAmount('')
          } else {
            setErrCashbackAmount('Required field')
          }
          setCashBackAmount(event.target.value)
        }
        break
      case 'CashbackType':
        if (minCashbackTeam && event.target.value === '') {
          setErrCashbackType('Required field')
        } else {
          setErrCashbackType('')
        }
        setCashbackType(event.target.value)
        break
      case 'MinTeamCount':
        if (isNumber(event.target.value) || !event.target.value) {
          if (!event.target.value) {
            setErrMinTeamCount('')
          } else if (event.target.value < parseInt(minEntry)) {
            setErrMinTeamCount('Must be greater than min entry')
          } else if (event.target.value > parseInt(maxEntry)) {
            setErrMinTeamCount('Must be less than max entry')
          } else {
            setErrMinTeamCount('')
          }
          setMinTeamCount(event.target.value)
        }
        break
      case 'BotCreate':
        if (event.target.value === 'N') {
          setCopyBotPerTeam(0)
          setMinTeamCount(0)
          setCopyBotPerTeamErr('')
          setErrMinTeamCount('')
          setBotCreate(event.target.value)
        } else {
          setBotCreate(event.target.value)
          setCopyBotPerTeam(3)
        }
        break
      case 'CopyBotPerTeam':
        if (isNumber(event.target.value) || !event.target.value) {
          setCopyBotPerTeam(event.target.value)
        }
        break
      case 'SameCopyBotTeam':
        if (isNumber(event.target.value)) {
          setSameCopyBotTeamErr('')
        } else {
          setSameCopyBotTeamErr('Value must be positive!')
        }
        setSameCopyBotTeam(event.target.value)
        break
      default:
        break
    }
  }

  // onSubmit function for validate the fields and to dispatch action
  function onAdd (e) {
    if (verifyLength(FilterCategory, 1) && verifyLength(LeagueCategory, 1) && verifyLength(GameCategory, 1) && LeagueName.trim().length && (parseInt(minEntry) >= parseInt(minValue)) && (parseInt(maxEntry) <= parseInt(maxValue)) && verifyLength(LeagueName, 1) && isNumber(Position) && isPositive(minEntry) && isPositive(maxEntry) && (parseInt(minEntry) <= parseInt(maxEntry)) && isFloat(entryFee) && isNumber(TotalPayout) && isPositive(TeamJoinLimit) && isPositive(winnersCount) && (BonusUtil >= 0 && BonusUtil <= 100) && (DeductPercent >= 0 && DeductPercent <= 100) && !errLeagueName && !errPosition && !errTeamJoinLimit && !errCashbackTeam && !errCashbackAmount && !errCashbackType && !copyBotPerTeamErr && sameCopyBotTeam >= 0 && autoFillSpots >= 0) {
      if (isCreate) {
        const addNewLeagueData = {
          LeagueName, maxEntry, minEntry, Price: parseInt(entryFee), TotalPayout, DeductPercent, BonusUtil, ConfirmLeague, multipleEntry, autoCreate, poolPrize, Position, active, GameCategory, LeagueCategory, FilterCategory, TeamJoinLimit, winnersCount, LoyaltyPoint, unlimitedJoin, minCashbackTeam, cashBackAmount, cashbackType: cashBackAmount <= 0 ? 'C' : cashbackType, minTeamCount, botCreate, cashbackEnabled, copyBotPerTeam: parseInt(copyBotPerTeam), sameCopyBotTeam: parseInt(sameCopyBotTeam), autoFillSpots: parseInt(autoFillSpots)
        }
        AddNewLeague(addNewLeagueData)
      } else {
        const updateNewLeagueData = {
          LeagueName, maxEntry, minEntry, Price: parseInt(entryFee), TotalPayout, DeductPercent, BonusUtil, ConfirmLeague, multipleEntry, autoCreate, poolPrize, Position, active, GameCategory, LeagueCategory, FilterCategory, TeamJoinLimit, winnersCount, LoyaltyPoint, unlimitedJoin, minCashbackTeam, cashBackAmount, cashbackType: cashBackAmount <= 0 ? 'C' : cashbackType, minTeamCount, botCreate, cashbackEnabled, copyBotPerTeam: parseInt(copyBotPerTeam), sameCopyBotTeam: parseInt(sameCopyBotTeam), autoFillSpots: parseInt(autoFillSpots)
        }
        UpdateLeague(updateNewLeagueData)
      }
      setLoading(true)
    } else {
      if (copyBotPerTeam < 0) {
        setCopyBotPerTeamErr('Value must be positive')
      }
      if (parseInt(minEntry) < parseInt(minValue)) {
        setErrminEntry(`Must be greater than ${minValue}`)
      }
      if (parseInt(maxEntry) > parseInt(maxValue)) {
        setErrmaxEntry(`Must be less than ${maxValue}`)
      }
      if (!LeagueName.trim().length) {
        setErrLeagueName('Only white spaces are not allowed')
      }
      if (!LeagueCategory) {
        setErrLeagueCategory('Required field')
      }
      if (!GameCategory) {
        setErrGameCategory('Required field')
      }
      if (!FilterCategory) {
        setErrFilterCategory('Required field')
      }
      if (!TotalPayout) {
        seterrTotalPayout('Required field')
      }
      if (!verifyLength(LeagueName, 1)) {
        setErrLeagueName('Required field')
      }
      if (!isNumber(Position)) {
        seterrPosition('Required field')
      }
      if (parseInt(minEntry) > parseInt(maxEntry)) {
        setErrmaxEntry('Maximum entry should be greater than Minimum entry')
      }
      if (!isPositive(minEntry)) {
        setErrminEntry('Required field')
      }
      if (!isPositive(maxEntry)) {
        setErrmaxEntry('Required field')
      }
      if (!entryFee) {
        seterrPrice('Required field')
      } else if (!isFloat(entryFee)) {
        if (isNaN(parseFloat(entryFee))) {
          seterrPrice('Value must be number!')
        } else {
          seterrPrice('Must be 2 floating point value only')
        }
      }
      if (!isPositive(TeamJoinLimit)) {
        setErrTeamJoinLimit('Required field')
      }
      if (!isPositive(winnersCount)) {
        setErrwinnersCount('Required field')
      }
      if (BonusUtil >= 100) {
        seterrBonusUtil('Value must be less than 100')
      }
      if (!(DeductPercent >= 0 && DeductPercent <= 100)) {
        seterrDeducePercent('Required field')
      }
      if (multipleEntry === 'Y' && parseInt(TeamJoinLimit) === 0) {
        setErrTeamJoinLimit('Value must be greater than 0')
      } else if (multipleEntry === 'Y' && parseInt(TeamJoinLimit) < 2) {
        setErrTeamJoinLimit('Value must be greater than 1')
      }
      if (multipleEntry === 'N' && minCashbackTeam > 1) {
        setErrCashbackTeam('Team must be less than 2')
      }
      if (minCashbackTeam && !cashBackAmount) {
        setErrCashbackAmount('Required field')
      }
      if (minCashbackTeam && !cashbackType) {
        setErrCashbackType('Required field')
      }
      if (!isNumber(sameCopyBotTeam)) {
        setSameCopyBotTeamErr('Value must be positive!')
      }
      if (!isNumber(autoFillSpots)) {
        setAutoFillSpotsErr('Value must be Positive!')
      }
    }
  }

  // useeffect to set filter gameCategoryList
  useEffect(() => {
    if (GameCategoryList || LeagueDetails?.eCategory) {
      const arr = []
      if (GameCategoryList?.length !== 0) {
        GameCategoryList?.map((data) => {
          const obj = {
            value: data?.sKey,
            label: data?.sName
          }
          data?.sName !== LeagueDetails?.eCategory?.toUpperCase() &&
            arr.push(obj)
          return arr
        })
        setOptions(arr)
      }
    }
  }, [GameCategoryList, LeagueDetails])

  function openModalFunc () {
    setLeagueId(id)
    setModalOpen(true)
  }

  function onHandleChange (selected) {
    if (selected) {
      setSelectedOption(selected)
      if (selected.length >= 1) {
        setSportsErr('')
      } else {
        setSportsErr('Required field')
      }
      setSportsType(selected)
    } else {
      setSportsType([])
    }
  }

  // dispatch action to copy league to other sports
  function copyLeagueFunc (e) {
    e.preventDefault()
    const selected = []
    selectedOption?.map((data) => {
      selected.push(data.value)
      return selected
    })
    dispatch(copyLeague(leagueId, selected, token))
    setLoading(true)
    setSportsType([])
    toggleMessage()
  }

  //  set legaueAnalytics
  useEffect(() => {
    if (LeagueAnalytics) {
      setLeagueLoading(false)
    }
  }, [LeagueAnalytics])

  useImperativeHandle(ref, () => ({
    onAdd,
    openModalFunc
  }))

  return (
    <main className="main-content">
      <section className="common-box common-detail">
        <AlertMessage
          close={close}
          message={message}
          modalMessage={modalMessage}
          status={status}
        />
        {loading && <Loading />}
        <div className="title d-flex justify-content-between align-items-center fdc-480 align-start-480" />
        <Row className="mt-3">
          <Col md={12} xl={12}>
            <Fragment>
              <div className="common-box-leagues">
                <Row>
                  <Col md={12} xl={4} >
                    <FormGroup>
                      <Label className='lable-league' for="LeagueName">
                        {' '}
                        League Name
                        {' '}
                        <RequiredField/>
                      </Label>
                      <Input
                        className={errLeagueName ? 'league-placeholder-error ' : 'league-placeholder'}
                        disabled={adminPermission?.LEAGUE === 'R'}
                        id="LeagueName"
                        onChange={event => handleChange(event, 'LeagueName')}
                        placeholder="Enter League Name"
                        type="text"
                        value={LeagueName}
                      />
                      <p className="error-text">{errLeagueName}</p>
                    </FormGroup>
                  </Col>
                  <Col md={6} xl={4}>
                    <FormGroup className='form-group-league'>
                      <Label className='lable-league' for="LeagueCategory">
                        {' '}
                        League Category
                        {' '}
                        <RequiredField/>
                      </Label>
                      <CustomInput className={errLeagueCategory ? 'league-placeholder-error' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="LeagueCategory" onChange={event => handleChange(event, 'LeagueCategory')} placeholder="Enter League Category" type="select" value={LeagueCategory}>
                        <option value=''>Select League Category</option>
                        {
                          LeagueCategoryList && LeagueCategoryList.length >= 1 && LeagueCategoryList.map(data => (
                            <option key={data._id} value={data._id}>{data.sTitle}</option>
                          ))
                        }
                      </CustomInput>
                      <p className="error-text">{errLeagueCategory}</p>
                    </FormGroup>
                  </Col>
                  <Col md={6} xl={4}>
                    <FormGroup className='form-group-league'>
                      <Label className='lable-league' for="gameCategory">
                        {' '}
                        Game Category
                        {' '}
                        <RequiredField/>
                      </Label>
                      <CustomInput className={errGameCategory ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="GameCategory" onChange={event => handleChange(event, 'GameCategory')} placeholder="Enter Game Category" type="select" value={GameCategory}>
                        <option value=''>Select Game Category</option>
                        {
                          GameCategoryList && GameCategoryList.length >= 0 && GameCategoryList.map((data, index) => (
                            <option key={index} value={data?.sKey}>{data?.sName}</option>
                          ))
                        }
                      </CustomInput>
                      <p className="error-text">{errGameCategory}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-2' md={6} xl={6} >
                    <FormGroup className='form-group-league'>
                      <Label className='lable-league' for="FilterCategory">
                        {' '}
                        Filter Category
                        {' '}
                        <RequiredField/>
                      </Label>
                      <CustomInput className={errFilterCategory ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="FilterCategory" onChange={event => handleChange(event, 'FilterCategory')} placeholder="Enter Filter Category" type="select" value={FilterCategory}>
                        <option value=''>Select Filter Category</option>
                        {
                          FilterList && FilterList.length >= 0 && FilterList.map(data => (
                            <option key={data._id} value={data._id}>{data.sTitle}</option>
                          ))
                        }
                      </CustomInput>
                      <p className="error-text">{errFilterCategory}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-2' md={6} xl={6}>
                    <FormGroup className='form-group-league'>
                      <Label className='lable-league' for="LoyaltyPoint"> Loyalty Point </Label>
                      <Input className='league-placeholder' disabled={adminPermission?.LEAGUE === 'R'} id="LoyaltyPoint" onChange={event => handleChange(event, 'LoyaltyPoint')} placeholder="Enter Loyalty Point" type="number" value={LoyaltyPoint} />
                    </FormGroup>
                  </Col>
                  <Col className='match-details-radio mt-2' md={6} xl={6}>
                    <FormGroup className='radio-div'>
                      <Label className='lable-league mb-3' for="ConfirmLeague">Confirm League?</Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={ConfirmLeague === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="ConfirmLeague1"
                          label="Yes"
                          name="ConfirmLeagueRadio"
                          onClick={event => handleChange(event, 'ConfirmLeague')}
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={ConfirmLeague !== 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="ConfirmLeague2"
                          label="No"
                          name="ConfirmLeagueRadio"
                          onClick={event => handleChange(event, 'ConfirmLeague')}
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className='match-details-radio mt-2' md={6} xl={6}>
                    <FormGroup className='radio-div'>
                      <Label className='lable-league mb-3' for="autoCreate">Auto Create?</Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={autoCreate === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="autoCreate1"
                          label="Yes"
                          name="autoCreate"
                          onClick={event => handleChange(event, 'autoCreate')}
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={autoCreate !== 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="autoCreate2"
                          label="No"
                          name="autoCreate"
                          onClick={event => handleChange(event, 'autoCreate')}
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Fragment>
          </Col>
          <Col className='pl-4' md={6} mt={4} xl={3}>
            <Fragment>
              <div className="common-box-leagues mt-4 ">
                <Row>
                  <Col className='match-details-radio' xl={12}>
                    <FormGroup className='radio-div'>
                      <Label className='lable-league mb-3' for="multipleEntry">Multiple Entry?</Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={multipleEntry === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="multipleEntry1"
                          label="Yes"
                          name="multipleEntry"
                          onClick={(event) =>
                            handleChange(event, 'multipleEntry')
                          }
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={multipleEntry !== 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="multipleEntry2"
                          label="No"
                          name="multipleEntry"
                          onClick={(event) =>
                            handleChange(event, 'multipleEntry')
                          }
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' xl={12}>
                    <FormGroup>
                      <Label className='lable-league' for="TeamJoinLimit">Team Join Limit</Label>
                      <Input
                        disabled={
                          multipleEntry === 'N' ||
                          adminPermission?.LEAGUE === 'R'
                        }
                        id="TeamJoinLimit"
                        onChange={(event) =>
                          handleChange(event, 'TeamJoinLimit')
                        }
                        placeholder="Enter Team Join Limit"
                        type="number"
                        value={TeamJoinLimit}
                      />
                      <p className="error-text">{errTeamJoinLimit}</p>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Fragment>
          </Col>

          <Col className='px-4' md={6} mt={4} xl={9}>
            <Fragment>
              <div className="common-box-leagues mt-4">
                <Row>
                  <Col className='match-details-radio' md={12}>
                    <FormGroup className='radio-div'>
                      <Label className='lable-league mb-3' for="CashbackEnabled">Cashback Enabled?</Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={cashbackEnabled === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="cashback1"
                          label="Yes"
                          name="cashback"
                          onChange={(event) =>
                            handleChange(event, 'cashbackEnabled')
                          }
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={cashbackEnabled !== 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="cashback2"
                          label="No"
                          name="cashback"
                          onChange={(event) =>
                            handleChange(event, 'cashbackEnabled')
                          }
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={12} xl={4}>
                    <FormGroup className='form-group-league mt-3'>
                      <Label className='lable-league' for="MinCashbackTeam">
                        {' '}
                        Min No of Team for Cashback
                        {' '}
                      </Label>
                      <Input
                        disabled={
                          adminPermission?.LEAGUE === 'R' ||
                          cashbackEnabled === 'N'
                        }
                        id="MinCashbackTeam"
                        onChange={(event) =>
                          handleChange(event, 'MinCashbackTeam')
                        }
                        placeholder="Enter Min Cashback Team"
                        type="number"
                        value={minCashbackTeam}
                      />
                      <p className="error-text">{errCashbackTeam}</p>
                    </FormGroup>
                  </Col>

                  <Col md={12} xl={4}>
                    <FormGroup className='form-group-league mt-3'>
                      <Label className='lable-league' for="CashbackAmount"> Cashback Amount </Label>
                      <InputGroup>
                        {minCashbackTeam
                          ? (
                            <>
                              <InputGroupText>
                                <img alt="repee" src={rupeesIcon} />
                              </InputGroupText>
                              {' '}
                              <Input disabled={(adminPermission?.LEAGUE === 'R') || (cashbackEnabled === 'N' && !minCashbackTeam)} id="CashbackAmount" onChange={event => handleChange(event, 'CashbackAmount')} placeholder="Enter Cashback Amount" type="number" value={cashBackAmount} />
                            </>
                            )
                          : (
                            <>
                              <InputGroupText className='input-group-text'><img alt="repee" src={rupeesIcon} /></InputGroupText>
                              {' '}
                              <Input id="CashbackAmount" onChange={event => handleChange(event, 'CashbackAmount')} placeholder="Enter Cashback Amount" type="number" value={cashBackAmount || 0} />
                            </>
                            )
                        }
                      </InputGroup>
                      <p className="error-text">{errCashbackAmount}</p>

                    </FormGroup>
                  </Col>
                  <Col md={12} xl={4}>
                    <FormGroup className='form-group-league mt-3'>
                      <Label className='lable-league' for="CashbackType"> Cashback Type </Label>
                      <CustomInput className={!minCashbackTeam ? 'bgColor' : ''} disabled={(adminPermission?.LEAGUE === 'R') || (cashbackEnabled === 'N' && !minCashbackTeam)} id="CashbackType" onChange={event => handleChange(event, 'CashbackType')} type="select" value={cashbackType}>
                        <Fragment>
                          <option value=''>Select Cashback Type</option>
                          <option value='C'>Cash</option>
                          <option value='B'>Bonus</option>
                        </Fragment>
                      </CustomInput>
                      <p className="error-text">{errCashbackType}</p>
                    </FormGroup>
                  </Col>
                </Row>

              </div>
            </Fragment>
          </Col>

          <Col className='px-4' md={12}>
            <Fragment>
              <div className="common-box-leagues mt-4">
                <Row>
                  <Col md={6} xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="minEntry">
                        Min Entry
                        {' '}
                        <RequiredField/>
                      </Label>
                      <Input className={errminEntry ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="minEntry" onChange={event => handleChange(event, 'minEntry')} placeholder="Enter Min-Entry" type='number' value={minEntry} />
                      <p className="error-text">{errminEntry}</p>
                    </FormGroup>
                  </Col>
                  <Col md={6} xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="maxEntry">
                        {' '}
                        Max Entry
                        {' '}
                        <RequiredField/>
                      </Label>
                      <Input className={errmaxEntry ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="maxEntry" onChange={event => handleChange(event, 'maxEntry')} placeholder="Enter Max-Entry" type='number' value={maxEntry} />
                      <p className="error-text">{errmaxEntry}</p>
                    </FormGroup>
                  </Col>
                  <Col className='league-entry' md={6} xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="entryFee">
                        {' '}
                        Entry Fee
                        {' '}
                        <RequiredField/>
                        {' '}
                      </Label>
                      <InputGroup>
                        <InputGroupText>
                          <img alt="rupees" src={rupeesIcon} />
                        </InputGroupText>
                        <Input className={errPrice ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="entryFee" onChange={event => handleChange(event, 'entryFee')} placeholder="Enter Entry Fee" type="number" value={entryFee} />
                      </InputGroup>
                      <p className="error-text">{errPrice}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' md={6} xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="Total-Payout">
                        {' '}
                        Total Payout
                        {' '}
                        <RequiredField/>
                      </Label>
                      <Input className={errTotalPayout ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="Total-Payout" onChange={event => handleChange(event, 'TotalPayout')} placeholder="Enter Total Payout" type="number" value={TotalPayout} />
                      <p className="error-text">{errTotalPayout}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' md={6} xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="BonusUtil"> Bonus Util (%) </Label>
                      <Input className={errBonusUtil ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="BonusUtil" onChange={event => handleChange(event, 'BonusUtil')} placeholder="Enter Bonus Util" type="number" value={BonusUtil} />
                      <p className="error-text">{errBonusUtil}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' md={6} xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="winnersCount">
                        Winners Count
                        {' '}
                        <RequiredField/>
                      </Label>
                      <Input className={errwinnersCount ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="winnersCount" onChange={event => handleChange(event, 'winnersCount')} placeholder="Enter Winner's Count " type="number" value={winnersCount} />
                      <p className="error-text">{errwinnersCount}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' md={6} xl={6}>
                    <FormGroup>
                      <Label className='lable-league' for="Position">
                        {' '}
                        Position
                        {' '}
                        <RequiredField/>
                      </Label>
                      <Input className={errPosition ? 'league-placeholder-error ' : 'league-placeholder'} disabled={adminPermission?.LEAGUE === 'R'} id="Position" onChange={event => handleChange(event, 'Position')} placeholder="Enter Position" type="number" value={Position} />
                      <p className="error-text">{errPosition}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' md={6} xl={6}>
                    <FormGroup>
                      <Label for="AutoFillSpots"> Auto Fill Spots </Label>
                      <Input disabled={adminPermission?.LEAGUE === 'R'} id="AutoFillSpots" onChange={event => handleChange(event, 'AutoFillSpots')} placeholder="Enter Auto Fill Spots" type="number" value={autoFillSpots} />
                      <p className="error-text">{autoFillSpotsErr}</p>
                    </FormGroup>
                  </Col>

                  <Col className='match-details-radio mt-3' md={12} >
                    <FormGroup className='radio-div'>
                      <Label className='lable-league' for="active">Status</Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={active === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="active1"
                          label="Active"
                          name="active"
                          onClick={event => handleChange(event, 'active')}
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={active !== 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="active2"
                          label="In Active"
                          name="active"
                          onClick={event => handleChange(event, 'active')}
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Fragment>
          </Col>

          <Col className="league-common-box mt-4 px-4" md={12}>
            <Fragment >
              <div className="common-box-leagues">
                <Row>
                  <Col className='match-details-radio' md={6} xl={6}>
                    <FormGroup className='radio-div'>
                      <Label className='lable-league' for="poolPrize">
                        Pool Prize?
                        <img
                          className="custom-info pb-1"
                          id="prize"
                          src={infoIcon}
                          width={18}
                        />
                        <UncontrolledTooltip className="bg-default-prize-breakup" delay={0} placement="right-center" target="prize" >
                          <h3>Pool Prize</h3>
                          <p className='first-p'>If pool prize is turned on, the prize breakup amount will be measured in percentage instead of real money.</p>
                          <p className='second-p'>Formula -</p>
                          <p className='third-p'> nTotalPayout = (nPrice * totalUsers * 100) / ((nDeductPercent || 0) + 100)</p>
                          <p className='third-p'>winning Amount = (nTotalPayout * nPrize) / 100) / (nRankTo - nRankFrom + 1)</p>
                          <p className='fourth-p'>Note - If multiple users get the same rank, then the win amount will be divided between them.</p>
                        </UncontrolledTooltip>
                      </Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={poolPrize === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="pullPrize1"
                          label="Yes"
                          name="poolPrize"
                          onClick={(event) => handleChange(event, 'poolPrize')}
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={poolPrize !== 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="pullPrize2"
                          label="No"
                          name="poolPrize"
                          onClick={(event) => handleChange(event, 'poolPrize')}
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className='match-details-radio' md={6} xl={6}>
                    <FormGroup className='radio-div'>
                      <Label className='lable-league' for="unlimitedJoin">Unlimited Join?</Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={unlimitedJoin === 'Y'}
                          disabled={
                            adminPermission?.LEAGUE === 'R' || poolPrize === 'N'
                          }
                          id="unlimitedJoin1"
                          label="Yes"
                          name="unlimitedJoin"
                          onClick={(event) =>
                            handleChange(event, 'unlimitedJoin')
                          }
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={unlimitedJoin !== 'Y'}
                          disabled={
                            adminPermission?.LEAGUE === 'R' || poolPrize === 'N'
                          }
                          id="unlimitedJoin2"
                          label="No"
                          name="unlimitedJoin"
                          onClick={(event) =>
                            handleChange(event, 'unlimitedJoin')
                          }
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' md={12}>
                    <FormGroup>
                      <Label className='lable-league' for="DeductPercent"> Deduct Percent (%)</Label>
                      <Input
                        disabled={poolPrize === 'N'}
                        id="DeductPercent"
                        onChange={(event) =>
                          handleChange(event, 'DeductPercent')
                        }
                        placeholder="Enter DeductPercent"
                        type="number"
                        value={DeductPercent}
                      />
                      <p className="error-text">{errDeducePercent}</p>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Fragment>
          </Col>

          <Col className='league-common-box mt-4 mb-4 px-4' md={12}>
            <Fragment>
              <div className="common-box-leagues">
                <Row>
                  <Col className='match-details-radio' xl={12}>
                    <FormGroup className='radio-div'>
                      <Label className='lable-league' for="BotCreate">Bot Create?</Label>
                      <div className="d-flex inline-input">
                        <CustomInput
                          checked={botCreate === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="BotCreate1"
                          label="Yes"
                          name="BotCreate"
                          onClick={event => handleChange(event, 'BotCreate')}
                          type="radio"
                          value="Y"
                        />
                        <CustomInput
                          checked={botCreate !== 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id="BotCreate2"
                          label="No"
                          name="BotCreate"
                          onClick={event => handleChange(event, 'BotCreate')}
                          type="radio"
                          value="N"
                        />
                      </div>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="MinTeamCount">Min no of team for Bot</Label>
                      {botCreate === 'Y'
                        ? <Input disabled={adminPermission?.LEAGUE === 'R'} id="MinCashbackTeam" onChange={event => handleChange(event, 'MinTeamCount')} placeholder="Enter min no. of team count" type="number" value={minTeamCount} />
                        : <InputGroupText>{minTeamCount || 0}</InputGroupText>}
                      <p className='error-text'>{errMinTeamCount}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="CopyBotPerTeam">Copy bots per Team (Default value will be 3)</Label>
                      {botCreate === 'Y'
                        ? <Input disabled={botCreate === 'N' || (adminPermission?.LEAGUE === 'R')} id="CopyBotPerTeam" onChange={event => handleChange(event, 'CopyBotPerTeam')} placeholder="Enter copy bot per user" type="number" value={copyBotPerTeam} />
                        : <InputGroupText>{copyBotPerTeam || 0}</InputGroupText>}
                      {' '}
                      <p className='error-text'>{copyBotPerTeamErr}</p>
                    </FormGroup>
                  </Col>
                  <Col className='mt-3' xl={4}>
                    <FormGroup>
                      <Label className='lable-league' for="SameCopyBotTeam"> Number for Same Copy Bot Team </Label>
                      {botCreate === 'Y'
                        ? <Input disabled={adminPermission?.LEAGUE === 'R'} id="SameCopyBotTeam" onChange={event => handleChange(event, 'SameCopyBotTeam')} placeholder="Enter number for same copy bot team" type="number" value={sameCopyBotTeam} />
                        : <InputGroupText>{sameCopyBotTeam || 0}</InputGroupText>}
                      <p className="error-text">{sameCopyBotTeamErr}</p>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Fragment>
          </Col>
        </Row>
      </section>

      <Modal className="modal-confirm-bot" isOpen={modalOpen} toggle={toggleMessage}>
        <ModalHeader className='popup-modal-header modal-title-head' toggle={toggleMessage}>Copy League</ModalHeader>
        <ModalBody className="text-center">
          <Form>
            <Row>
              <Col className='copy-text' md={12} xl={12}>
                <FormGroup>
                  <p>Choose the sport for which you want to replicate this league structure</p>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className='copy-select' md={12} xl={12}>
                <FormGroup className='select-label'>
                  <Label>
                    Select Sports
                    <RequiredField/>
                  </Label>
                  <Select
                    captureMenuScroll={true}
                    // menuPosition="fixed"
                    className={sportsErr ? 'league-placeholder-error' : 'select-s-type'}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    id="SportsType"
                    isMulti={true}
                    menuPlacement="auto"
                    name="SportsType"
                    onChange={(selected) => onHandleChange(selected)}
                    options={options}
                    placeholder="Select Sports"
                    value={sportsType}
                  />
                  <p className="error-text">{sportsErr}</p>
                </FormGroup>
              </Col>
            </Row>

            {((Auth && Auth === 'SUPER') ||
              adminPermission?.LEAGUE !== 'R') && (
                <Row className="buttons">
                  <Col className='p-0' md={12} xl={12}>
                    <Button
                      className="theme-btn success-btn full-btn"
                      disabled={sportsType?.length === 0}
                      onClick={(e) => copyLeagueFunc(e)}
                      type="submit"
                    >
                      Copy League
                    </Button>
                  </Col>
                </Row>
            )}
          </Form>
        </ModalBody>
      </Modal>

      {
        leagueLoading
          ? <Loading />
          : (
              LeagueAnalytics && (
              <Modal className="modal-league-analytics" isOpen={leagueAnalyticsModalOpen} toggle={toggleModal}>
                <ModalHeader className='popup-modal-header modal-title-head w-100' toggle={toggleModal}>
                  <div className='total-text-prize-popup d-flex justify-content-between align-items-center w-100'>
                    <h3>  League Analytics </h3>
                    <span>
                      {' '}
                      Total:
                      {LeagueAnalytics?.nTotal}
                    </span>
                  </div>

                </ModalHeader>
                <ModalBody className="text-center modal-prize-popup p-4 " >
                  <Row>
                    <Col className='mt-2' md={6} xl={4}>
                      <div className="table-col">
                        <Label className='table-lable'>
                          {' '}
                          <b>Bonus Utilisation</b>
                        </Label>
                        <hr />
                        <Row className='table-row'>
                          <Col className='col-heading'>Average</Col>
                          <Col className='col-des'>
                            <b>
                              { LeagueAnalytics?.oBonusUtilisation?.nAvg ? (+LeagueAnalytics?.oBonusUtilisation?.nAvg).toFixed(2) : 0}
                            </b>
                          </Col>
                        </Row>
                        <Row className='table-row'>
                          <Col className='col-heading'>
                            Total
                          </Col>
                          <Col className='col-des'>
                            <b>
                              {LeagueAnalytics?.oBonusUtilisation?.nTotal || 0}
                            </b>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col className='mt-2' md={6} xl={4}>
                      <div className='table-col'>
                        <Label className='table-lable'>
                          {' '}
                          <b> Cancelled </b>
                        </Label>
                        <hr />
                        <Row className='table-row'>
                          <Col className='col-heading'>Total</Col>
                          <Col className='col-des'>
                            <b>{LeagueAnalytics?.oCancelled?.nTotal}</b>
                          </Col>
                        </Row>
                        <Row className='table-row'>
                          <Col className='col-heading'>
                            {' '}
                            Ratio
                          </Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oCancelled?.sRatio}
                            </b>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                    <Col className='mt-2' md={6} xl={4}>
                      <div className='table-col'>
                        <Label className='table-lable'>
                          {' '}
                          <b> Entry Fee </b>
                        </Label>
                        <hr />
                        <Row className='table-row'>
                          <Col className='col-heading'>Average</Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oEntryFee?.nAvg?.toFixed(2) || 0}
                              {' '}
                            </b>
                          </Col>
                        </Row>
                        <Row className='table-row'>
                          <Col className='col-heading'>
                            {' '}
                            Total
                          </Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oEntryFee?.nTotal || 0}
                            </b>
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col className='mt-4' md={6} xl={4}>
                      <div className="table-col">
                        <Label className='table-lable'>
                          {' '}
                          <b> Live </b>
                          {' '}
                        </Label>
                        <hr />
                        <Row className='table-row'>
                          <Col className='col-heading'>Total</Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oLive?.nTotal}
                              {' '}
                            </b>
                          </Col>
                        </Row>
                        <Row className='table-row'>
                          <Col className='col-heading'> Ratio </Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oLive?.sRatio}
                              {' '}
                            </b>
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col className='mt-4' md={6} xl={4}>
                      <div className='table-col-parti'>
                        <Label className='table-lable'>
                          {' '}
                          <b> Participation </b>
                          {' '}
                        </Label>
                        <hr />
                        <Row className='table-row-parti'>
                          <Col className='col-heading'>Average</Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oParticipation?.nAvg}
                            </b>
                          </Col>
                        </Row>
                        <Row className='table-row-parti'>
                          <Col className='col-heading'>Total Real Users </Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oParticipation?.nTotalRealUsers}
                            </b>
                          </Col>
                        </Row>
                        <Row className='table-row-parti'>
                          <Col className='col-heading'> Total </Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oParticipation?.nTotal}
                            </b>
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col className='mt-4' md={6} xl={4}>
                      <div className="table-col">
                        <Label className='table-lable'>
                          {' '}
                          <b> Profit </b>
                        </Label>
                        <hr />
                        <Row className='table-row'>
                          <Col className='col-heading'>Average</Col>
                          <Col className='col-des'>
                            <b>
                              {' '}
                              {LeagueAnalytics?.oProfit?.nAvg}
                            </b>
                          </Col>
                        </Row>
                        <Row className='table-row'>
                          <Col className='col-heading'>Total</Col>
                          <Col className='col-des'>
                            <b>{LeagueAnalytics?.oProfit?.nTotal}</b>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </ModalBody>
              </Modal>
              )
            )
      }
    </main>
  )
})

AddLeague.propTypes = {
  cancelLink: PropTypes.string,
  AddNewLeague: PropTypes.func,
  UpdateLeague: PropTypes.func,
  addLeaguepriceBreakup: PropTypes.string,
  GameCategoryList: PropTypes.array,
  LeagueCategoryList: PropTypes.array,
  FilterList: PropTypes.array,
  priceBreakUpPage: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object,
  setIsCreate: PropTypes.func,
  isCreate: PropTypes.bool,
  leagueAnalyticsModalOpen: PropTypes.bool,
  setLeagueAnalyticsModalOpen: PropTypes.func,
  toggleMessage: PropTypes.func,
  toggleModal: PropTypes.func,
  modalOpen: PropTypes.bool,
  setUpdateDisableButton: PropTypes.func,
  setModalOpen: PropTypes.func,
  setLeagueLoading: PropTypes.func,
  leagueLoading: PropTypes.bool

}

AddLeague.displayName = AddLeague
export default connect(null, null, null, { forwardRef: true })(AddLeague)
