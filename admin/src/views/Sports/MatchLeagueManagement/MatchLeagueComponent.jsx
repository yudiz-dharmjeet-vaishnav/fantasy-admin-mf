import React, { useState, Fragment, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Badge, Button, Modal, ModalBody, Col, Row, ModalHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Label, Input, UncontrolledTooltip, Form } from 'reactstrap'
import { useSelector, connect, useDispatch } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import makeAnimated from 'react-select/animated'
import moment from 'moment'
import Select from 'react-select'
import qs from 'query-string'
import PropTypes from 'prop-types'

import more from '../../../assets/images/arrow_drop_down.svg'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import infoIcon from '../../../assets/images/info-icon.svg'
import noImage from '../../../assets/images/no-image-1.svg'
import sortIcon from '../../../assets/images/sort-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import RequiredField from '../../../components/RequiredField'
import PaginationComponent from '../../../components/PaginationComponent'

import { isNumber, modalMessageFunc, verifyLength } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
import { generatePdf } from '../../../actions/match'
import { getUserDetails } from '../../../actions/users'
import { getMatchLeagueReport, normalBotTeams, resetMatchLeague, updateCopyBot } from '../../../actions/matchleague'

const animatedComponents = makeAnimated()
const MatchLeagueComponent = forwardRef((props, ref) => {
  const {
    List, getList, flag, cancelLeague, matchStatus, getMatchDetailsFunc, leagueCountFunc, leagueCount, systemBotsLogs, systemTeams, pointCalculateFlag, rankCalculateFlag, prizeCalculateFlag, winPrizeCalculateFlag, settingList, getSettingList, editNormalBotModal, setEditNormalBotModal, leagueType, setLeagueType, setPageNo, setOrder, sort, activePageNo, order, offset, setOffset, loading, setLoading, setSort, setLeagueCancel, leagueCancel
  } = props
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const exporter = useRef(null)
  const dispatch = useDispatch('')
  const [fullList, setFullList] = useState([])
  const [start, setStart] = useState(0)
  const [leagueCreatorInfo, setLeagueCreatorInfo] = useState([])
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [matchLeagueId, setMatchLeagueId] = useState('')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [close, setClose] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [url, setUrl] = useState('')
  const [totalLeagueCount, setTotalLeagueCount] = useState(0)
  const [modalForPublic, setModalForPublic] = useState(false)
  const [leagueName, setLeagueName] = useState('')
  const [prizeBreakup, setPrizeBreakup] = useState([])
  const [botDetails, setBotDetails] = useState({})
  const [isPoolLeague, setIsPoolLeague] = useState(false)
  const [tdsPercentage, setTdsPercentage] = useState(0)
  // eslint-disable-next-line no-unused-vars
  const [settingListTDS, setSettingListTDS] = useState(0)
  const [cancelledPublicLeagueCount, setCancelledPublicLeagueCount] = useState(0)
  const [cancelledPrivateLeagueCount, setCancelledPrivateLeagueCount] = useState(0)
  const [totalWinner, setTotalWinner] = useState(0)
  const [winDistAt, setWinDistAt] = useState('')
  const [matchLeagueIds, setMatchLeagueIds] = useState([])
  const [options, setOptions] = useState([])
  const [Selectedoption, setSelectedoption] = useState([])
  const [leagueIdErr, setLeagueIdErr] = useState('')
  const [sameCopyBotTeam, setSameCopyBotTeam] = useState(0)
  const [sameCopyBotTeamErr, setSameCopyBotTeamErr] = useState('')
  const [copyBotPerTeamErr, setCopyBotPerTeamErr] = useState('')
  const [copyBotPerTeam, setCopyBotPerTeam] = useState(0)
  const [updateCopyBotModal, setUpdateCopyBotModal] = useState(false)
  const [currLeagueId, setCurrLeagueId] = useState('')
  const [resetMatchLeagueModal, setResetMatchLeagueModal] = useState(false)
  const [search, setSearch] = useQueryState('search', '')

  const searchProp = props.search
  const shareCode = useRef('')
  const adminCommission = useRef('')
  const creatorCommission = useRef('')
  const userId = useRef('')

  const matchLeagueReport = useSelector(state => state?.matchleague?.matchLeagueReport)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const resStatus = useSelector(state => state?.match?.resStatus)
  const resMessage = useSelector(state => state?.match?.resMessage)
  const ResStatus = useSelector(state => state?.matchplayer?.resStatus)
  const ResMessage = useSelector(state => state?.matchplayer?.resMessage)
  const mlResStatus = useSelector(state => state?.matchleague?.resStatus)
  const mlResMessage = useSelector(state => state?.matchleague?.resMessage)
  const resetResMessage = useSelector(state => state?.matchleague?.resetResMessage)
  const resetResStatus = useSelector(state => state?.matchleague?.resetResStatus)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const isFullResponse = useSelector(state => state?.matchleague?.isFullResponse)
  const token = useSelector(state => state?.auth?.token)
  const usersDetails = useSelector(state => state?.users?.usersDetails)
  const matchDetails = useSelector(state => state?.match?.matchDetails)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalMessage2, setModalMessage2] = useState(false)
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleMessage = () => setModalMessage2(!modalMessage2)
  const toggleModal = () => setModalOpen(!isModalOpen)
  const togglePublicModal = () => setModalForPublic(!modalForPublic)
  const toggleUpdateBot = () => setUpdateCopyBotModal(!updateCopyBotModal)

  function resetMatchLeagueFunc (matchLeagueId) {
    dispatch(resetMatchLeague(matchLeagueId, token))
    toggleResetMatchLeague()
  }
  const toggleResetMatchLeague = () => {
    setResetMatchLeagueModal(!resetMatchLeagueModal)
    setMatchLeagueId('')
  }

  const paginationFlag = useRef(false)
  const toggleMessageEditNormalBot = () => setEditNormalBotModal(!editNormalBotModal)
  const obj = qs?.parse(location?.search)
  const previousProps = useRef({
    start, offset, List, resMessage, resStatus, mlResStatus, mlResMessage, ResMessage, ResStatus, leagueType, usersDetails, prizeBreakup, matchLeagueReport, leagueCancel, resetResMessage
  })?.current

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.message) {
        setMessage(location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location?.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    let order = 'dsc'
    let type = ''
    let search = ''
    let leagueStatus = ''
    const obj = qs?.parse(location?.search)
    if (obj) {
      if (obj?.page) {
        page = obj?.page
        setPageNo(page)
      }
      if (obj?.pageSize) {
        limit = obj?.pageSize
        setOffset(limit)
        setListLength(`${limit} users`)
      }
      if (obj?.order) {
        order = obj?.order
        setOrder(order)
      }
      if (obj?.leagueType) {
        type = obj?.leagueType
        setLeagueType(type)
      }
      if (obj?.search) {
        search = obj?.search
        setSearch(search)
      }
      if (obj?.leagueCancel) {
        leagueStatus = obj?.leagueCancel
        setLeagueCancel(leagueStatus)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, leagueType, false, leagueCancel)
    setLoading(true)
    dispatch(getUrl('media'))
    getSettingList(0, 20, 'sTitle', 'asd', '', true, token)
  }, [])

  useEffect(() => {
    if (settingList) {
      settingList?.results?.map((item) => {
        if (item.sKey === 'TDS') {
          setTdsPercentage(item.nMax)
        }
        return item
      })
    }
  }, [settingList])

  useEffect(() => {
    getUrlLink && setUrl(getUrlLink)
  }, [getUrlLink])

  useEffect(() => {
    if (leagueCount?.length !== 0) {
      setTotalLeagueCount(leagueCount?.nJoinedUsers)
      setCancelledPublicLeagueCount(leagueCount?.nCancelledPublicLeagueCount)
      setCancelledPrivateLeagueCount(leagueCount?.nCancelledPrivateLeagueCount)
      setTotalWinner(leagueCount?.nTotalWinner)
    }
  }, [leagueCount])

  useEffect(() => {
    if (matchDetails) {
      setWinDistAt(matchDetails?.dWinDistAt)
    }
  }, [matchDetails])

  useEffect(() => {
    if (matchStatus) {
      if (!winPrizeCalculateFlag) {
        getList(start, offset, sort, order, search, leagueType, false, leagueCancel)
        getMatchDetailsFunc()
      }
    }
  }, [winPrizeCalculateFlag])

  useEffect(() => {
    if (previousProps?.List !== List) {
      if (List) {
        if (List?.results) {
          const userArrLength = List?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List?.results ? List?.results : [])
        setIndex(activePageNo)
        setTotal(List?.total ? List?.total : 0)
        setLoading(false)
      }
    }
    if (previousProps?.matchLeagueReport !== matchLeagueReport) {
      if (matchLeagueReport?.results) {
        setFullList(matchLeagueReport?.results || [])
        setLoading(false)
        exporter.current.props = {
          ...exporter?.current?.props,
          data: processExcelExportData(matchLeagueReport?.results || []),
          fileName: 'MatchLeagues.xlsx'
        }
        exporter.current.save()
        setLoading(false)
      }
    }
    return () => {
      previousProps.List = List
      previousProps.matchLeagueReport = matchLeagueReport
    }
  }, [List, matchLeagueReport])

  useEffect(() => {
    if (previousProps?.List !== List && isFullResponse) {
      if (List) {
        const arr = []
        if (List?.results?.length > 0) {
          List?.results?.map((data) => {
            const obj = {
              value: data?._id,
              label: data?.bCopyLeague ? data?.sName + '(Copy League)' : data?.sName
            }
            !data?.bCancelled && arr?.push(obj)
            return arr
          })
          setOptions(arr)
        }
      }
    }
    return () => {
      previousProps.List = List
    }
  }, [List, isFullResponse])

  useEffect(() => {
    if (previousProps?.leagueType !== leagueType || previousProps.leagueCancel !== leagueCancel) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, leagueType, false, leagueCancel)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.leagueType = leagueType
      previousProps.leagueCancel = leagueCancel
    }
  }, [leagueType, leagueCancel])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (usersDetails && previousProps?.usersDetails !== usersDetails) {
      setLeagueCreatorInfo(usersDetails)
      setModalOpen(true)
    }
    return () => {
      previousProps.usersDetails = usersDetails
    }
  }, [usersDetails])

  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = {
        MatchLeagueManagement: location.search
      }
      : data.MatchLeagueManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          if (!pointCalculateFlag && !rankCalculateFlag && !prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList(startFrom, limit, sort, order, search, leagueType, false, leagueCancel)
          }
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps?.mlResMessage !== mlResMessage) {
      if (mlResMessage) {
        setMessage(mlResMessage)
        setStatus(mlResStatus)
        setModalMessage(true)
        if (mlResStatus) {
          const startFrom = 0
          const limit = offset
          if (!pointCalculateFlag && !rankCalculateFlag && !prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList(startFrom, limit, sort, order, search, leagueType, false, leagueCancel)
          }
          setPageNo(1)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.mlResMessage = mlResMessage
      previousProps.mlResStatus = mlResStatus
    }
  }, [mlResStatus, mlResMessage])

  useEffect(() => {
    if (previousProps?.ResMessage !== ResMessage) {
      if (ResMessage) {
        setMessage(ResMessage)
        setStatus(ResMessage)
        setModalMessage(true)
        if (ResStatus) {
          const startFrom = 0
          const limit = offset
          if (!pointCalculateFlag && !rankCalculateFlag && !prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList(startFrom, limit, sort, order, search, leagueType, leagueCancel)
          }
          setPageNo(1)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.ResMessage = ResMessage
    }
  }, [ResStatus, ResMessage])

  useEffect(() => {
    if (previousProps?.resetResMessage !== resetResMessage) {
      if (resetResMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          if (!pointCalculateFlag && !rankCalculateFlag && !prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList(startFrom, limit, sort, order, search, leagueType, false, leagueCancel)
          }
          setMessage(resetResMessage)
          setStatus(resetResStatus)
          setModalMessage(true)
          setResetMatchLeagueModal(false)
          setPageNo(1)
        } else {
          setMessage(resetResMessage)
          setStatus(resetResStatus)
          setModalMessage(true)
          setResetMatchLeagueModal(false)
        }
        setLoading(false)
      }
    }

    return () => {
      previousProps.resetResMessage = resetResMessage
    }
  }, [resetResStatus, resetResMessage])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, leagueType, false, leagueCancel)
      leagueCountFunc(matchStatus)
      setSearch(searchProp.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps?.searchProp !== searchProp && flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.searchProp = searchProp
      }
    }
    return () => {
      previousProps.searchProp = searchProp
    }
  }, [searchProp])

  function onRefresh () {
    // const startFrom = 0
    // const limit = offset
    getList(start, offset, sort, order, search, leagueType, false, leagueCancel)
    getMatchDetailsFunc()
    leagueCountFunc(matchStatus)
    setPageNo(activePageNo)
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh,
    onExport
  }))

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, sort, order, search, leagueType, false, leagueCancel)
      leagueCountFunc(matchStatus)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function cancel () {
    if (matchLeagueId) {
      cancelLeague(matchLeagueId)
      toggleMessage()
      setLoading(true)
    }
  }

  // dispatch action to open/generate fair play for given match league
  function generatePDF (data, id) {
    if (data) {
      window.open(`${url}${data}`)
    } else if (!data) {
      dispatch(generatePdf('MATCH_LEAGUE', id, token))
    } else {
      setMessage('Link is not available')
    }
  }

  // dispatch action to get users and private league creator details
  function privateLeagueCreatorDetails (data) {
    dispatch(getUserDetails(data?.iUserId, token))
    setPrizeBreakup(data?.aLeaguePrize)
    shareCode.current = data?.sShareCode
    adminCommission.current = data?.nAdminCommission
    creatorCommission.current = data?.nCreatorCommission
    userId.current = data?.iUserId
  }

  function setPublicPrizeBreakupFunc (aLeaguePrize, league, poolPrize, data) {
    setPrizeBreakup(aLeaguePrize)
    setBotDetails({ entryFee: data?.nPrice, createdBot: data?.bBotCreate, copyBot: data?.nCopyBotsPerTeam, minTeamCount: data?.nMinTeamCount })
    setLeagueName(league)
    setIsPoolLeague(poolPrize)
    setModalForPublic(true)
  }

  function handleLeagueChange (selectedOption, type) {
    switch (type) {
      case 'LeagueId':
        if (selectedOption !== null) {
          setSelectedoption(selectedOption)
          if (selectedOption.length >= 1) {
            setLeagueIdErr('')
          } else {
            setLeagueIdErr('Required field')
          }
          setMatchLeagueIds(selectedOption)
        } else {
          setSelectedoption([])
          setMatchLeagueIds([])
        }
        break
      default:
        break
    }
  }

  function editNormalBotTeams () {
    if ((Selectedoption && Selectedoption?.length >= 1) && !leagueIdErr) {
      const selected = []
      Selectedoption?.map((data) => {
        selected.push(data?.value)
        return selected
      })
      dispatch(normalBotTeams(id, selected, token))
      setEditNormalBotModal(false)
      setLeagueIdErr('')
      setSelectedoption([])
      setMatchLeagueIds([])
    } else if (!Selectedoption?.length >= 1) {
      setLeagueIdErr('Required field')
    }
  }
  const processExcelExportData = (data) =>
    data.map((matchLeague, index2) => {
      const sName = matchLeague?.sName || '--'
      const leagueType = matchLeague?.bPrivateLeague ? 'Private' : 'Public'
      const leagueStatus = matchLeague?.bCancelled ? 'Yes' : 'No'
      const entry = (matchLeague?.nMin ? matchLeague?.nMin : '0') + '-' + (matchLeague.nMax ? matchLeague?.nMax : '0')
      const nJoined = matchLeague?.nJoined || 0
      const nPrice = matchLeague?.nPrice || 0
      const nTotalPayout = matchLeague?.nTotalPayout || 0
      const nWinnersCount = matchLeague?.nWinnersCount || 0
      const bPoolPrize = matchLeague?.bPoolPrize ? 'Yes' : 'No'
      const nBonusUtil = matchLeague?.nBonusUtil || '--'
      const nJoinedRealUsers = matchLeague?.nJoinedRealUsers || 0
      const botUser = matchLeague?.nJoined - matchLeague.nJoinedRealUsers
      const TDS = matchLeague?.nTotalTdsAmount || 0
      const totalCollection = matchLeague?.nPrice * matchLeague?.nJoined
      const nRealCashCollection = totalCollection - matchLeague?.nTotalBonusUsed - matchLeague?.nBotUsersMoney - matchLeague?.nBotUsersBonus - matchLeague?.nTotalPromoDiscount
      const userCashWinning = matchLeague?.nRealUserWinningCash || 0
      const userBonusWinning = matchLeague?.nRealUserWinningBonus || 0
      const botCashWinning = matchLeague?.nBotWinningCash || 0
      const botBonusWinning = matchLeague?.nBotWinningBonus || 0
      const totalWinningProvided = matchLeague?.nRealUserWinningCash + matchLeague?.nRealUserWinningBonus + matchLeague?.nBotWinningCash + matchLeague?.nBotWinningBonus
      const botUserWinning = matchLeague?.nBotWinningCash + matchLeague?.nBotWinningBonus
      const nBotUsersMoney = matchLeague?.nBotUsersMoney || 0
      const nBotUsersBonus = matchLeague?.nBotUsersBonus || 0
      const bonusUsed = matchLeague?.nTotalBonusUsed || 0
      const nTotalPromoDiscount = matchLeague?.nTotalPromoDiscount || 0
      const totalGrossProfit = nRealCashCollection - (matchLeague?.nRealUserWinningCash + matchLeague?.nRealUserWinningBonus)
      const grossProfit = (totalGrossProfit && nRealCashCollection) ? ((totalGrossProfit / nRealCashCollection) * 100)?.toFixed(2) : 0
      const cashbackCash = matchLeague?.nTotalCashbackCash || 0
      const cashbackBonus = matchLeague?.nTotalCashbackBonus || 0
      const netProfit = (totalGrossProfit - (cashbackCash + cashbackBonus)) || 0
      const netProfitPercent = (nRealCashCollection * 100 !== 0) ? ((netProfit / nRealCashCollection) * 100)?.toFixed(2) : 0
      const nCreatorCommission = matchLeague?.nCreatorCommission || '--'

      return {
        ...matchLeague,
        sName,
        leagueType,
        leagueStatus,
        entry,
        nJoined,
        nJoinedRealUsers,
        nPrice,
        nTotalPayout,
        nWinnersCount,
        bPoolPrize,
        nBonusUtil,
        index: index2 + 1,
        botUser,
        TDS,
        totalCollection,
        nRealCashCollection,
        userCashWinning,
        userBonusWinning,
        botCashWinning,
        botBonusWinning,
        totalWinningProvided,
        botUserWinning,
        nBotUsersMoney,
        nBotUsersBonus,
        bonusUsed,
        nTotalPromoDiscount,
        totalGrossProfit,
        grossProfit,
        netProfit,
        netProfitPercent,
        cashbackCash,
        cashbackBonus,
        nCreatorCommission
      }
    })

  async function onExport () {
    dispatch(getMatchLeagueReport(id, token))
    setLoading(true)
  }

  function handleChange (event, type) {
    switch (type) {
      case 'CopyBotPerTeam':
        if (isNumber(event?.target?.value)) {
          setCopyBotPerTeamErr('')
        } else {
          setCopyBotPerTeamErr('Value must be positive!')
        }
        setCopyBotPerTeam(event?.target?.value)
        break
      case 'SameCopyBotTeam':
        if (isNumber(event?.target?.value)) {
          setSameCopyBotTeamErr('')
        } else {
          setSameCopyBotTeamErr('Value must be positive!')
        }
        setSameCopyBotTeam(event?.target?.value)
        break
      default:
        break
    }
  }

  function updateCopyBotFunc () {
    if (verifyLength(copyBotPerTeam, 1) && verifyLength(sameCopyBotTeam, 1) && copyBotPerTeam && sameCopyBotTeam && !sameCopyBotTeamErr && !copyBotPerTeamErr) {
      dispatch(updateCopyBot(currLeagueId, Number(copyBotPerTeam), Number(sameCopyBotTeam), token))
      setUpdateCopyBotModal(false)
    } else {
      if (copyBotPerTeam < 0) {
        setCopyBotPerTeamErr('Value must be positive')
      }
      if (!isNumber(sameCopyBotTeam)) {
        setSameCopyBotTeamErr('Value must be positive!')
      }
      if (!copyBotPerTeam) {
        setCopyBotPerTeamErr('Required field')
      }
      if (!sameCopyBotTeamErr) {
        setSameCopyBotTeamErr('Required field')
      }
    }
  }

  function onSorting (sortingBy) {
    if (order === 'desc') {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'asc', search, leagueType, false, leagueCancel)
      setOrder('asc')
      setSort(sortingBy)
      setPageNo(1)
      setLoading(true)
    } else {
      const start = 0
      const limit = offset
      getList(start, limit, sortingBy, 'desc', search, leagueType, false, leagueCancel)
      setOrder('desc')
      setSort(sortingBy)
      setPageNo(1)
      setLoading(true)
    }
  }

  return (
    <Fragment>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Match league" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">

              <AlertMessage
                close={close}
                message={message}
                modalMessage={modalMessage}
                status={status}
              />

              <ExcelExport ref={exporter} data={fullList} fileName={`${matchDetails?.sName} Match Reports - (${moment(matchDetails?.dStartDate)?.format('MMMM Do YYYY, h-mm-ss a')}).xlsx`}>
                <ExcelExportColumn field='index' title='No' />
                <ExcelExportColumn field='sName' title='League Name' />
                <ExcelExportColumn field='leagueType' title='League Type' />
                <ExcelExportColumn field='leagueStatus' title='Cancelled League' />
                <ExcelExportColumn field='entry' title='Total Spot(Min - Max)' />
                <ExcelExportColumn field='nJoined' title='Total Joined Users' />
                <ExcelExportColumn field='nJoinedRealUsers' title='Total Real Users' />
                <ExcelExportColumn field='botUser' title='Total Bot Users' />
                <ExcelExportColumn field='nWinnersCount' title='Winners Count' />
                <ExcelExportColumn field='nPrice' title='Entry Fees' />
                <ExcelExportColumn field='TDS' title={`TDS (@ ${tdsPercentage}% Applicable on above Rs.10000 Winning Prize)`} />
                <ExcelExportColumn field='totalCollection' title='Total Collection (Cash+Bonus+Promo Code)' />
                <ExcelExportColumn field='nRealCashCollection' title='Real Cash Collection' />
                <ExcelExportColumn field='userCashWinning' title='User Cash Winning' />
                <ExcelExportColumn field='userBonusWinning' title='User Bonus Winning' />
                <ExcelExportColumn field='totalWinningProvided' title='Total Winning Provided' />
                <ExcelExportColumn field='botUserWinning' title='Bot User Winning' />
                <ExcelExportColumn field='nBotUsersMoney' title="Bot User's Money" />
                <ExcelExportColumn field='nBotUsersBonus' title="Bot User's Bonus" />
                <ExcelExportColumn field='bonusUsed' title='Bonus Used' />
                <ExcelExportColumn field='nTotalPromoDiscount' title='Promo Code amount used(Discount)' />
                <ExcelExportColumn field='totalGrossProfit' title='Total Gross Profit' />
                <ExcelExportColumn field='grossProfit' title='Gross Profit(%)' />
                <ExcelExportColumn field='netProfit' title='Net Profit' />
                <ExcelExportColumn field='netProfitPercent' title='Net Profit(%)' />
                <ExcelExportColumn field='cashbackCash' title='Cashback (Cash)' />
                <ExcelExportColumn field='cashbackBonus' title='Cashback (Bonus)' />
                <ExcelExportColumn field='nCreatorCommission' title='Private League Creator Bonus' />
                <ExcelExportColumn field='bPoolPrize' title='Pool League?' />
              </ExcelExport>
              <div className='d-flex justify-content-between mb-3 fdc-480'>
                {(cancelledPublicLeagueCount >= 0) && (cancelledPrivateLeagueCount >= 0) && (
                <div className='total-text'>
                  Cancelled: (Public-
                  {cancelledPublicLeagueCount || 0}
                  , Private-
                  {cancelledPrivateLeagueCount || 0}
                  )
                </div>
                )}
                <div className='d-flex fdc-480'>
                  {(winDistAt) && (
                  <div className='total-text'>
                    Win Prize Distribution At :
                    {' '}
                    <b>{moment(winDistAt)?.format('lll')}</b>
                  </div>
                  )}
                  {(winDistAt) && (window?.innerWidth > 480) && <div className='total-text mr-2 ml-2'><b>|</b></div>}
                  {(totalWinner >= 0) && (
                  <div className='total-text'>
                    Winners :
                    {' '}
                    <b>{totalWinner || 0}</b>
                  </div>
                  )}
                </div>
              </div>
              <table className="match-league-table mb-5">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>
                      <div>
                        League
                        {' '}
                        {total && (
                        <span className='total-text'>
                          (Total-
                          {total}
                          )
                        </span>
                        )}
                      </div>
                      {leagueCount?.nPublicLeagueCount >= 0 && leagueCount?.nPrivateLeagueCount >= 0 && (
                      <div className='total-text'>
                        Public-
                        {leagueCount?.nPublicLeagueCount}
                        , Private-
                        {leagueCount?.nPrivateLeagueCount}
                      </div>
                      )}
                    </th>
                    <th>
                      <div>League Type</div>
                    </th>
                    <th>
                      Entry
                      <Button className='sort-btn' color='link' onClick={() => onSorting('nMax')}><img alt="sorting" className=" ml-2" src={sortIcon} /></Button>
                    </th>
                    <th>
                      Joined
                      {' '}
                      {totalLeagueCount
                        ? (
                          <span className='total-text'>
                            (User Leagues-
                            {totalLeagueCount}
                            )
                          </span>
                          )
                        : ''}
                      {leagueCount?.nTotalPlayReturnUsers
                        ? (
                          <div className='total-text'>
                            Play Return-
                            {leagueCount?.nTotalPlayReturnUsers}
                          </div>
                          )
                        : ''}
                    </th>
                    <th>Entry Fee</th>
                    <th>Total Payout</th>
                    <th>
                      Pool League
                      {' '}
                      <img className='custom-info' id='prize' src={infoIcon} />
                      <UncontrolledTooltip className="bg-default-prize-breakup" delay={0} placement="right-center" target="prize" >
                        <h3>Pool Prize</h3>
                        <p className='first-p'>If pool prize is turned on, the prize breakup amount will be measured in percentage instead of real money.</p>
                        <p className='second-p'>Formula -</p>
                        <p className='third-p'> nTotalPayout = (nPrice * totalUsers * 100) / ((nDeductPercent || 0) + 100)</p>
                        <p className='third-p'>winning Amount = (nTotalPayout * nPrize) / 100) / (nRankTo - nRankFrom + 1)</p>
                        <p className='fourth-p'>Note - If multiple users get the same rank, then the win amount will be divided between them.</p>
                      </UncontrolledTooltip>

                    </th>
                    <th>Remark</th>
                    <th>League Features</th>
                    <th>Bonus Util(%)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={12} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => (
                      <tr
                        key={i}
                        className={data?.bCancelled ? 'cancelled-raw' : data?.bWinningDone ? 'priceDone-raw' : data?.bPlayReturnProcess ? 'playReturn-raw' : ''}
                      >
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>
                          {!data?.bPrivateLeague
                            ? data?.sName + (data.bCopyLeague ? '(Copy League)' : '')
                            : data?.sName}
                        </td>
                        <td>
                          {data?.bPrivateLeague
                            ? (
                              <Button className='total-text-link' color='link' onClick={() => privateLeagueCreatorDetails(data)} >
                                Private
                              </Button>
                              )
                            : <Button className='total-text-link' color='link' onClick={() => setPublicPrizeBreakupFunc(data?.aLeaguePrize, data?.sName, data?.bPoolPrize, data)}>Public</Button>}
                        </td>
                        <td>{`( ${data.nMin} - ${data?.nMax} )`}</td>
                        <td>{data?.nJoined}</td>
                        <td>{data?.nPrice}</td>
                        <td>{data?.nTotalPayout}</td>
                        <td className='league-pool-prize-td'>
                          <Badge
                            className='league-pool-prize ml-2'
                            color={`${data?.bPoolPrize ? 'success' : 'danger'}`}
                          >
                            {data?.bPoolPrize ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td>{data?.sRemark ? data?.sRemark : '--'}</td>
                        <td>
                          {data?.bAutoCreate
                            ? (<Badge className="category-warn ml-1" color="warning">A</Badge>)
                            : ('')
                            }
                          {data?.bConfirmLeague
                            ? (<Badge className="category-success ml-1">C</Badge>)
                            : ('')
                          }
                          {data?.bMultipleEntry
                            ? (<Badge className="category-primary ml-1" color="primary">M</Badge>)
                            : ('')
                          }
                          {data?.nBonusUtil > 0
                            ? (<Badge className="category-info ml-1" color="info">B</Badge>)
                            : ('')
                          }
                          {data?.bUnlimitedJoin
                            ? (<Badge className="category-secondary ml-1" color="secondary">∞</Badge>)
                            : ('')
                          }
                          {!data?.bAutoCreate && !data?.bConfirmLeague && !data?.bMultipleEntry && !data?.nBonusUtil > 0 && !data?.bUnlimitedJoin ? '--' : ''}
                        </td>
                        <td>{data.nBonusUtil || ' - '}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle className='match-league-dropdown' nav>
                              <img src={more} style={{ height: '16px', width: '16px' }} />
                            </DropdownToggle>
                            <DropdownMenu container='body'>
                              {((Auth && Auth === 'SUPER') || (adminPermission?.USERLEAGUE !== 'N')) && (
                              <DropdownItem tag={Link} to={`${props?.userLeague}/${data?._id}`}>User Leagues</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'N')) && (matchStatus === 'I' || matchStatus === 'L') && !data?.bCancelled && (
                              <DropdownItem onClick={() => generatePDF(data?.sFairPlay ? data?.sFairPlay : '', data?._id)}>{data?.sFairPlay ? 'Fair Play' : 'Generate Fair Play'}</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) && (!data?.bPrivateLeague) && (
                              <DropdownItem tag={Link} to={`${systemBotsLogs}/${data?._id}`}>Bot Logs</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS !== 'N')) && (matchStatus === 'P' || matchStatus === 'U') && (!data?.bPrivateLeague) && (
                              <DropdownItem tag={Link} to={`${systemTeams}/${data?._id}`}>Create Combination Bot</DropdownItem>)}

                              {data?.bCashbackEnabled && (!data?.bCancelled) && <DropdownItem tag={Link} to={`${props?.cashback}/${data?._id}`}>Cashback List</DropdownItem>}

                              {(!data?.bCancelled) && (!data?.bPrivateLeague) && <DropdownItem tag={Link} to={`${props?.promoUsage}/${data?._id}`}>Promo Usage List</DropdownItem>}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.TDS !== 'N')) && (matchStatus === 'I' || matchStatus === 'CMP') && (
                              <DropdownItem state={{ leagueTotds: true, leagueTdsId: data?.iMatchId, leagueNameToTds: data?.sName, matchNameToTds: matchDetails?.sName }} tag={Link} to={{ pathname: `/users/tds-management/${data?._id}` }} >TDS</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.PASSBOOK !== 'N')) && (
                              <DropdownItem state= {{ leagueToPassbook: true, leaguePassbookId: data?.iMatchId, leagueNameToPassbook: data?.sName, matchNameToPassbook: matchDetails?.sName }} tag={Link} to={{ pathname: `/users/passbook/${data?._id}` }}>Passbooks Entries</DropdownItem>)}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'N')) && (matchStatus === 'U') && data?.bBotCreate && (
                              <DropdownItem onClick={() => {
                                setUpdateCopyBotModal(true)
                                setCurrLeagueId(data?._id)
                              }}
                              >
                                Update Copy Bot
                              </DropdownItem>
                              )}

                              {((Auth && Auth === 'SUPER') || (adminPermission?.MATCHLEAGUE !== 'N')) && (matchStatus === 'U') && (
                              <DropdownItem disabled={adminPermission?.MATCHLEAGUE === 'R'}
                                onClick={() => {
                                  setResetMatchLeagueModal(true)
                                  setMatchLeagueId(data._id)
                                }}
                              >
                                Reset
                              </DropdownItem>
                              )}

                              {!data.bCancelled && !data.bWinningDone && props.permission && (
                                <DropdownItem
                                  onClick={() => {
                                    setModalMessage2(true)
                                    setMatchLeagueId(data?._id)
                                  }}
                                >
                                  Cancel
                                </DropdownItem>
                              )}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  }
                      </Fragment>
                      )
            }
                </tbody>
              </table>
            </div>
          </div>
          )}

      {list.length !== 0 && (
      <PaginationComponent
        activePageNo={activePageNo}
        endingNo={endingNo}
        listLength={listLength}
        offset={offset}
        paginationFlag={paginationFlag}
        setListLength={setListLength}
        setLoading={setLoading}
        setOffset={setOffset}
        setPageNo={setPageNo}
        setStart={setStart}
        startingNo={startingNo}
        total={total}
      />
      )}

      <Modal className='prizeBreakupModal' isOpen={modalForPublic} toggle={togglePublicModal}>
        <ModalHeader toggle={togglePublicModal}>
          Prize Breakup (
          {leagueName}
          )
        </ModalHeader>
        <ModalBody>
          <table className='table-league-pb'>
            <tbody>
              <tr>
                <th>Entry Fees</th>
                <th>Copy Bot Create </th>
                <th>Min No of team for Bot </th>
                <th>Copy bot Per</th>
              </tr>
              <tr>
                <td>
                  ₹
                  {botDetails.entryFee}
                </td>
                <td>{botDetails?.createdBot ? 'Yes' : 'No'}</td>
                <td>{botDetails?.createdBot ? botDetails?.minTeamCount : '--'}</td>
                <td>{botDetails?.createdBot ? botDetails?.copyBot : '--'}</td>
              </tr>
            </tbody>
          </table>

          <table className='table-league-pb-2'>
            <tbody>
              <tr>
                <th>Rank</th>
                <th>Image</th>
                <th>
                  Prize
                  {' '}
                  {isPoolLeague ? '(%)' : ''}
                </th>
                <th>Rank Type</th>
                <th>Info</th>
              </tr>
              {prizeBreakup && prizeBreakup.sort((a, b) => a?.nRankFrom > b?.nRankFrom ? 1 : -1).map((data, index2) => (
                <tr key={index2}>
                  <td>{data?.nRankFrom === data?.nRankTo ? `${data?.nRankFrom}` : `${data?.nRankFrom}-${data?.nRankTo}`}</td>
                  <td>
                    {data.sImage
                      ? <img alt="Extra Image" className='l-cat-img' src={url + data.sImage}/>
                      : <img alt="no image" className='l-cat-img' src={noImage} /> }
                  </td>
                  <td>
                    {data?.nPrize}
                    {isPoolLeague ? '%' : ''}
                  </td>
                  <td>{data?.eRankType === 'R' ? 'Real Money' : data?.eRankType === 'B' ? 'Bonus' : data?.eRankType === 'E' ? 'Extra' : '--'}</td>
                  <td>{data?.sInfo || '--'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
      </Modal>

      <Modal className='prizeBreakupModal' isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal} />
        <ModalBody>
          <h3>Private Contest Details</h3>
          <table className='table'>
            <tbody>
              <tr>
                <td>Username</td>
                <td>Contest Code</td>
                <td>Admin Commission</td>
                <td>Creator Commission</td>
              </tr>
              <tr>
                <td><Button color='link' onClick={() => navigate(`/users/user-management/user-details/${userId?.current}`)}>{leagueCreatorInfo?.sUsername}</Button></td>
                <td><b>{shareCode?.current || '--'}</b></td>
                <td><b>{adminCommission?.current || '--'}</b></td>
                <td><b>{creatorCommission?.current || '--'}</b></td>
              </tr>
            </tbody>
          </table>
          <h3>Prize Breakup</h3>
          <table className='table'>
            <tbody>
              <tr>
                <td><b>Rank</b></td>
                {prizeBreakup && prizeBreakup.map((data, index2) =>
                  <td key={index2}>{data?.nRankFrom === data?.nRankTo ? `${data?.nRankFrom}` : `${data?.nRankFrom}-${data?.nRankTo}`}</td>
                )}
              </tr>
              <tr>
                <td><b>Prize</b></td>
                {prizeBreakup && prizeBreakup?.map((data, index2) =>
                  <td key={index2}>{data?.nPrize}</td>
                )}
              </tr>
            </tbody>
          </table>
        </ModalBody>
      </Modal>

      <Modal className="modal-confirm" isOpen={modalMessage2} toggle={toggleMessage}>
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to Cancel it?</h2>
          <Row className="row-12">
            <Col>
              <Button
                className="theme-btn outline-btn-cancel full-btn-cancel"
                onClick={toggleMessage}
                type="submit"
              >
                Cancel
              </Button>
            </Col>
            <Col>
              <Button className="theme-btn danger-btn full-btn" onClick={cancel} type="submit"> Cancel It </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal className="modal-confirm-bot" isOpen={editNormalBotModal} toggle={toggleMessageEditNormalBot}>
        <ModalHeader className='popup-modal-header modal-title-head' toggle={toggleMessageEditNormalBot}>Edit Normal Bot Teams</ModalHeader>
        <ModalBody>
          <Form>
            <Row className='mt-4'>
              <Col className='copy-select' md={12} xl={12}>
                <FormGroup className='select-label'>
                  <Label for="MatchLeagueId">
                    Match League
                    {' '}
                    <RequiredField/>
                  </Label>
                  <Select
                    captureMenuScroll={true}
                    className={leagueIdErr ? 'league-placeholder-error' : 'select-s-type'}
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    id="MatchLeagueId"
                    isMulti={true}
                    menuPlacement="auto"
                    name="MatchLeagueId"
                    onChange={selectedOption => handleLeagueChange(selectedOption, 'LeagueId')}
                    options={options}
                    placeholder="Select Match League"
                    value={matchLeagueIds}
                  />
                  <p className="error-text">{leagueIdErr}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className="buttons">
              <Col className='p-0' md={12} xl={12}>
                <Button
                  className="theme-btn success-btn full-btn"
                  data-dismiss="modal"
                  disabled={Selectedoption?.length <= 0}
                  onClick={editNormalBotTeams}
                  type="button"
                >
                  Edit
                </Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>

      <Modal className="modal-confirm-bot" isOpen={updateCopyBotModal} toggle={toggleUpdateBot}>
        <ModalHeader className='popup-modal-header modal-title-head' toggle={toggleUpdateBot}>Update Copy Bot</ModalHeader>
        <ModalBody>
          <Row className='mt-4'>
            <Col className='copy-select' md={12} xl={12}>
              <FormGroup>
                <Label className='lable-league' for="CopyBotPerTeam">Copy bots per Team (Default value will be 3)</Label>
                <Input
                  className={copyBotPerTeamErr ? 'league-placeholder-error' : 'league-placeholder'}
                  id="CopyBotPerTeam"
                  onChange={event => handleChange(event, 'CopyBotPerTeam')}
                  placeholder="Enter copy bot per user"
                  type="number"
                  value={copyBotPerTeam}
                />
                <p className='error-text'>{copyBotPerTeamErr}</p>
              </FormGroup>
            </Col>
            <Col className='copy-select' md={12} xl={12}>
              <FormGroup>
                <Label className='lable-league' for="SameCopyBotTeam"> Number for Same Copy Bot Team </Label>
                <Input
                  className={sameCopyBotTeamErr ? 'league-placeholder-error' : 'legaue-placeholder'}
                  disabled={adminPermission?.LEAGUE === 'R'}
                  id="SameCopyBotTeam"
                  onChange={event => handleChange(event, 'SameCopyBotTeam')}
                  placeholder="Enter number for same copy bot team"
                  type="number"
                  value={sameCopyBotTeam}
                />
                <p className="error-text">{sameCopyBotTeamErr}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className="buttons">
            <Col className='p-0' md={12} xl={12}>
              <Button
                className="theme-btn success-btn full-btn"
                data-dismiss="modal"
                onClick={updateCopyBotFunc}
                type="button"
              >
                Update
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      <Modal className="modal-confirm" isOpen={resetMatchLeagueModal} toggle={toggleResetMatchLeague}>
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to reset it?</h2>
          <Row className="row-12">
            <Col>
              <Button
                className="theme-btn outline-btn-cancel full-btn-cancel"
                onClick={toggleResetMatchLeague}
                type="submit"
              >
                Cancel

              </Button>
            </Col>
            <Col>
              <Button
                className="theme-btn danger-btn full-btn"
                disabled={!matchLeagueId}
                onClick={() => resetMatchLeagueFunc(matchLeagueId)}
                type="submit"
              >
                {' '}
                Reset It
                {' '}

              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

MatchLeagueComponent.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  cancelLeague: PropTypes.func,
  prizeDistributionFunc: PropTypes.func,
  winPrizeDistributionFunc: PropTypes.func,
  matchStatus: PropTypes.string,
  getMatchDetailsFunc: PropTypes.func,
  leagueCountFunc: PropTypes.func,
  permission: PropTypes.bool,
  cashback: PropTypes.string,
  userLeague: PropTypes.string,
  location: PropTypes.object,
  search: PropTypes.string,
  history: PropTypes.object,
  leagueCount: PropTypes.object,
  systemBotsLogs: PropTypes.string,
  systemTeams: PropTypes.string,
  promoUsage: PropTypes.string,
  match: PropTypes.object,
  pointCalculateFlag: PropTypes.bool,
  rankCalculateFlag: PropTypes.bool,
  prizeCalculateFlag: PropTypes.bool,
  winPrizeCalculateFlag: PropTypes.bool,
  settingList: PropTypes.array,
  getSettingList: PropTypes.func,
  setEditNormalBotModal: PropTypes.bool,
  editNormalBotModal: PropTypes.func,
  leagueType: PropTypes.string,
  setLeagueType: PropTypes.func,
  sort: PropTypes.string,
  setPageNo: PropTypes.func,
  setOrder: PropTypes.func,
  setSearch: PropTypes.func,
  activePageNo: PropTypes.string,
  order: PropTypes.string,
  setOffset: PropTypes.func,
  offset: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  searchText: PropTypes.string,
  resetMatchLeagueModal: PropTypes.bool,
  toggleResetMatchLeague: PropTypes.func,
  resetMatchLeagueFunc: PropTypes.func,
  setResetMatchLeagueModal: PropTypes.func,
  resetMatchLeagueId: PropTypes.string,
  setSort: PropTypes.func,
  setLeagueCancel: PropTypes.func,
  leagueCancel: PropTypes.string
}

MatchLeagueComponent.displayName = MatchLeagueComponent

export default connect(null, null, null, { forwardRef: true })(MatchLeagueComponent)
