import React, { useEffect, useRef, useState, Fragment, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { FormGroup, Input, Row } from 'reactstrap'
import { ExcelExport, ExcelExportColumn, ExcelExportColumnGroup } from '@progress/kendo-react-excel-export'
import { useLocation } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import calendarIcon from '../../assets/images/calendar.svg'

import Loading from '../../components/Loading'
import AlertMessage from '../../components/AlertMessage'

import WinReport from './AllReports/WinReport'
import UserReport from './AllReports/UserReport'
import PlayReport from './AllReports/PlayReport'
import CashbackReport from './AllReports/CashbackReport'
import UserTeamReports from './AllReports/UserTeamReport'
import WinReturnReport from './AllReports/WinReturnReport'
import PlayReturnReport from './AllReports/PlayReturnReport'
import ParticipantReport from './AllReports/ParticipantReport'
import AppDownloadReport from './AllReports/AppDownloadReport'
import CreatorBonusReport from './AllReports/CreatorBonusReport'
import PrivateLeagueReport from './AllReports/PrivateLeagueReport'
import CashbackReturnReport from './AllReports/CashbackReturnReport'
import CreatorBonusReturnReport from './AllReports/CreatorBonusReturnReport'

import { modalMessageFunc } from '../../helpers/helper'
import { getSportsList } from '../../actions/sports'
import { getAllReports, getDateRangeWiseReport } from '../../actions/reports'

const AllReports = forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const exporter = useRef(null)
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useQueryState('reports', 'USER_REPORT')
  const [userType, setUserType] = useQueryState('usertype', 'U')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)

  const [TotalUsers, setTotalUsers] = useState({})
  const [LoginUser, setLoginUser] = useState({})
  const [RegisteredUsers, setRegisteredUsers] = useState({})
  const [DroppedUsers, setDroppedUsers] = useState({})
  const [Deposit, setDeposit] = useState({})
  const [Withdraw, setWithdraw] = useState({})
  const [BonusExpire, setBonusExpire] = useState({})
  const [userBonus, setUserBonus] = useState({})
  const [TDS, setTDS] = useState({})
  const [Teams, setTeams] = useState([])
  const [Participants, setParticipants] = useState([])
  const [Wins, setWins] = useState([])
  const [WinReturn, setWinReturn] = useState([])
  const [PrivateLeague, setPrivateLeague] = useState([])
  const [cashback, setCashback] = useState([])
  const [cashbackReturn, setCashbackReturn] = useState([])
  const [creatorBonus, setCreatorBonus] = useState([])
  const [creatorBonusReturn, setCreatorBonusReturn] = useState([])
  const [appDownloadReturn, setAppDownloadReturn] = useState([])
  const [playReturn, setPlayReturn] = useState([])
  const [played, setPlayed] = useState([])
  const [sports, setSports] = useState([])
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  // eslint-disable-next-line no-unused-vars
  const [StartDate, setStartDate] = useQueryState('datefrom', '')
  // eslint-disable-next-line no-unused-vars
  const [EndDate, setEndDate] = useQueryState('dateto', '')
  const [dateWiseReports, setDateWiseReports] = useState([])

  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const token = useSelector((state) => state?.auth?.token)
  const adminPermission = useSelector((state) => state?.auth?.adminPermission)
  const allReportsList = useSelector((state) => state?.reports?.allReportsList)
  const updatedGeneralizeData = useSelector((state) => state?.reports?.updatedGeneralizeData)
  const updatedCashbackData = useSelector(state => state?.reports?.updatedCashbackData)
  const updatedCashbackReturnData = useSelector(state => state?.reports?.updatedCashbackReturnData)
  const updatedPlayedData = useSelector(state => state?.reports?.updatedPlayedData)
  const updatedPlayReturnData = useSelector(state => state?.reports?.updatedPlayReturnData)
  const updatedCreatorBonusData = useSelector(state => state?.reports.updatedCreatorBonusData)
  const updatedCreatorBonusReturnData = useSelector(state => state?.reports?.updatedCreatorBonusReturnData)
  // const updatedAppDownloadData = useSelector(state => state.reports.updatedAppDownloadData)
  const updatedTeamData = useSelector((state) => state?.reports?.updatedTeamData)
  const updatedParticipantsData = useSelector((state) => state?.reports?.updatedParticipantsData)
  const updatedWinsData = useSelector((state) => state?.reports?.updatedWinsData)
  const updatedWinReturnData = useSelector(state => state?.reports?.updatedWinReturnData)
  const updatedPrivateLeagueData = useSelector((state) => state?.reports?.updatedPrivateLeagueData)
  const updatedAppDownloadStatisticsData = useSelector((state) => state?.reports?.updatedAppDownloadData)
  const dateRangeWiseReportList = useSelector((state) => state.reports.dateRangeWiseReportList)
  const sportsList = useSelector(state => state?.sports?.sportsList)
  const resMessage = useSelector((state) => state?.reports?.resMessage)
  const resStatus = useSelector((state) => state?.reports?.resStatus)
  const previousProps = useRef({
    allReportsList,
    resStatus,
    resMessage,
    updatedGeneralizeData,
    updatedTeamData,
    updatedParticipantsData,
    updatedWinsData,
    updatedPrivateLeagueData,
    isOpen,
    dateWiseReports,
    dateRangeWiseReportList,
    userType,
    updatedPlayedData,
    updatedPlayReturnData,
    updatedCashbackData,
    updatedCashbackReturnData,
    updatedCreatorBonusData,
    updatedAppDownloadStatisticsData
  }).current
  const permission = (Auth && Auth === 'SUPER') || (adminPermission?.REPORT === 'W')

  useEffect(() => {
    if (props && location && location.search) {
      const obj = qs?.parse(location?.search)
      if (obj) {
        if (obj?.usertype) {
          setUserType(obj?.usertype)
        }
        if (obj?.datefrom && obj?.dateto) {
          setDateRange([new Date(obj?.datefrom), new Date(obj?.dateto)])
        }
        if (obj?.reports) {
          setIsOpen(obj?.reports)
          // setKey(obj.reports)
        }
      }
    }
    dispatch(getAllReports(token))
    dispatch(getSportsList(token))
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
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
    if (allReportsList && allReportsList?.data?.length > 0) {
      const userIndex = allReportsList?.data?.findIndex(data => data?.eType === 'U')
      const systemIndex = allReportsList?.data?.findIndex(data => data?.eType === 'B')

      const setDataForUserType = (index) => {
        const data = allReportsList?.data[index]
        setTotalUsers(data?.oTotalUser)
        setLoginUser(data?.oLoginUser)
        setRegisteredUsers(data?.oRegisterUser)
        setDroppedUsers(data?.oDroppedRegistrations)
        setDeposit(data?.oDeposit)
        setWithdraw(data?.oWithdraw)
        setBonusExpire(data?.oBonusExpire)
        setUserBonus(data?.oUserBonus)
        setTDS(data?.oTds)
        setTeams(data?.aTeams)
        setParticipants(data?.aParticipants)
        setWins(data?.aWins)
        setWinReturn(data?.aWinReturn)
        setPrivateLeague(data?.aPrivateLeague)
        setCashback(data?.aCashback)
        setCashbackReturn(data?.aCashbackReturn)
        setPlayed(data?.aPlayed)
        setPlayReturn(data?.aPlayReturn)
        setCreatorBonus(data?.aCreatorBonus)
        setCreatorBonusReturn(data?.aCreatorBonusReturn)
        setAppDownloadReturn(data?.aAppDownload)
        setLoading(false)
      }
      if (userType === 'U') {
        setDataForUserType(userIndex)
      } else {
        setDataForUserType(systemIndex)
      }
    }
  }, [allReportsList])

  // will be called when user type/ report type changes occurred
  useEffect(() => {
    if (previousProps?.userType !== userType || previousProps?.isOpen !== isOpen) {
      if (startDate && endDate && (previousProps?.isOpen !== isOpen || previousProps?.userType !== userType)) {
        const startingDate = new Date(moment(startDate)?.startOf('day')?.format())
        const endingDate = new Date(moment(endDate)?.endOf('day')?.format())
        dispatch(getDateRangeWiseReport(new Date(startingDate)?.toISOString(), new Date(endingDate)?.toISOString(), isOpen, userType, token))
        setLoading(true)
      } else if ((previousProps?.isOpen !== isOpen || previousProps?.userType !== userType)) {
        dispatch(getAllReports(token))
        setLoading(true)
      }
    }
    return () => {
      previousProps.userType = userType
      previousProps.isOpen = isOpen
    }
  }, [userType, isOpen])

  // set active sports
  useEffect(() => {
    if (sportsList) {
      setSports(sportsList?.map(data => data?.sKey))
    }
  }, [sportsList])

  // to set updated users generalize data
  useEffect(() => {
    const genrealReports = {
      oTotalUser: setTotalUsers,
      oLoginUser: setLoginUser,
      oRegisterUser: setRegisteredUsers,
      oWithdraw: setWithdraw,
      oDeposit: setDeposit,
      oBonusExpire: setBonusExpire,
      oUserBonus: setUserBonus,
      oTds: setTDS
    }

    if (updatedGeneralizeData) {
      Object?.entries(updatedGeneralizeData)?.forEach(([data, value]) => {
        const report = genrealReports[data]
        if (report) {
          report(value)
        }
      })
    }
  }, [updatedGeneralizeData])

  // to set date range wise data
  useEffect(() => {
    if (dateRangeWiseReportList && previousProps?.dateRangeWiseReportList !== dateRangeWiseReportList) {
      setDateWiseReports(dateRangeWiseReportList)
      setLoading(false)
    }
    return () => {
      previousProps.dateRangeWiseReportList = dateRangeWiseReportList
    }
  }, [dateRangeWiseReportList])

  // dispatch action to get date-range wise data
  useEffect(() => {
    if (startDate && endDate) {
      setStartDate(moment(startDate)?.format('MM-DD-YYYY'))
      setEndDate(moment(endDate)?.format('MM-DD-YYYY'))
      const startingDate = new Date(moment(startDate)?.startOf('day')?.format())
      const endingDate = new Date(moment(endDate)?.endOf('day')?.format())
      dispatch(getDateRangeWiseReport(new Date(startingDate)?.toISOString(), new Date(endingDate)?.toISOString(), isOpen, userType, token))
      setLoading(true)
    } else if ((!startDate) && (!endDate)) {
      setStartDate('')
      setEndDate('')
      dateRangeWiseReportList && dispatch(getAllReports(token))
      setDateWiseReports([])
    }
  }, [startDate, endDate])

  // to change type of report
  function toggle (e, event) {
    e?.preventDefault()
    if (event === 'PRIVATE_LEAGUE_REPORT' || event === 'CREATOR_BONUS_REPORT' || event === 'APP_DOWNLOAD_REPORT') {
      setIsOpen(event)
      if (userType === 'B') {
        setUserType('U')
      }
    } else {
      setIsOpen(event)
    }
    // setUserType(event)
    // setIsOpen(event)
  }

  // to change user's type
  function setUserTypeFunc (event) {
    setUserType(event)
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  // for
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className='form-control date-range' onClick={onClick}>
      <img alt='calendar' src={calendarIcon} />
      <Input ref={ref} className='range' placeholder='Select Date Range' readOnly value={value} />
    </div>
  ))
  ExampleCustomInput.displayName = ExampleCustomInput

  const processExcelExportData = (data) => {
    if (isOpen === 'USER_REPORT') {
      const userData = []
      userData?.push({
        ...data?.oTotalUser,
        ...data?.oTds,
        ...data?.oDeposit,
        totalRegisteredUsers: data?.oRegisterUser?.Total,
        platformWiseRegisteredUsers: (data?.oRegisterUser?.aPlatformWiseUser?.map(platformWiseUser => platformWiseUser?.eTitle + '-' + Number(platformWiseUser?.nValue)))?.toString(),
        totalLoggedInUsers: data?.oLoginUser?.Total,
        depositMethods: (data?.oDeposit?.aDeposits?.map(deposit => deposit?.eTitle + '-' + Number(deposit?.nValue)))?.toString(),
        nTotalWithdrawals: data?.oWithdraw?.nTotalWithdrawals,
        pendingWithdrawals: data?.oWithdraw?.aPendingWithdrawals?.length > 0 ? (data.oWithdraw?.aPendingWithdrawals?.map(pendingWithdrawal => pendingWithdrawal?.eTitle + '-' + Number(pendingWithdrawal?.nValue)))?.toString() : '--',
        successWithdrawals: data?.oWithdraw?.aSuccessWithdrawals?.length > 0 ? (data.oWithdraw?.aSuccessWithdrawals?.map(successWithdrawal => successWithdrawal?.eTitle + '-' + Number(successWithdrawal?.nValue)))?.toString() : '--',
        totalUserBonus: data?.oUserBonus?.nTotal,
        totalBonusExpire: data?.oBonusExpire?.nTotal
      })
      return userData
    } else if (isOpen === 'USERTEAM_REPORT' || isOpen === 'PARTICIPANT_REPORT' || isOpen === 'CREATOR_BONUS_REPORT' || isOpen === 'CREATOR_BONUS_RETURN_REPORT') {
      const finalData = data?.map((info) => {
        const nTotal = Number(info?.nTotal) || 0
        let dUpdatedAt = moment(info?.dUpdatedAt)?.local()?.format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        return {
          ...info,
          nTotal,
          dUpdatedAt
        }
      })
      return finalData
    } else if (isOpen === 'WIN_REPORT' || isOpen === 'WIN_RETURN_REPORT' || isOpen === 'PLAY_REPORT' || isOpen === 'PLAY_RETURN_REPORT' || isOpen === 'CASHBACK_REPORT' || isOpen === 'CASHBACK_RETURN_REPORT') {
      const finalData = data?.map((info) => {
        const nTotalCash = Number(info?.nTotalCash) || 0
        const nTotalBonus = Number(info?.nTotalBonus) || 0
        let dUpdatedAt = moment(info?.dUpdatedAt)?.local()?.format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        return {
          ...info,
          nTotalCash,
          nTotalBonus,
          dUpdatedAt
        }
      })
      return finalData
    } else if (isOpen === 'PRIVATE_LEAGUE_REPORT') {
      const finalData = data?.map((info) => {
        const createdTotal = Number(info?.oCreated.nTotal) || 0
        const completedTotal = Number(info?.oCompleted.nTotal) || 0
        const cancelledTotal = Number(info?.oCancelled.nTotal) || 0
        let dUpdatedAt = moment(info?.dUpdatedAt)?.local()?.format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        return {
          ...info,
          createdTotal,
          completedTotal,
          cancelledTotal,
          dUpdatedAt
        }
      })
      return finalData
    } else if (isOpen === 'APP_DOWNLOAD_REPORT') {
      const finalData = data?.map((info) => {
        const nTotal = Number(info?.nTotal) || 0
        let dUpdatedAt = moment(info.dUpdatedAt)?.local()?.format('lll')
        dUpdatedAt = dUpdatedAt === 'Invalid date' ? ' - ' : dUpdatedAt
        const ePlatform = info?.ePlatform === 'A' ? 'Android' : 'iOS'
        return {
          ...info,
          nTotal,
          ePlatform,
          dUpdatedAt
        }
      })
      return finalData
    }
  }

  function onExport () {
    if (startDate && endDate) {
      if (isOpen === 'USER_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports), fileName: 'UserReports.xlsx' }
      } else if (isOpen === 'USERTEAM_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aTeams), fileName: 'UserTeamsReport.xlsx' }
      } else if (isOpen === 'PARTICIPANT_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aParticipants), fileName: 'ParticipantsReport.xlsx' }
      } else if (isOpen === 'WIN_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aWins), fileName: 'WinReport.xlsx' }
      } else if (isOpen === 'WIN_RETURN_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aWinReturn), fileName: 'WinReturnReport.xlsx' }
      } else if (isOpen === 'CREATOR_BONUS_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aCreatorBonus), fileName: 'CreatorBonusReport.xlsx' }
      } else if (isOpen === 'CREATOR_BONUS_RETURN_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aCreatorBonusReturn), fileName: 'CreatorBonusReturnReport.xlsx' }
      } else if (isOpen === 'PLAY_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aPlayed), fileName: 'PlayedReport.xlsx' }
      } else if (isOpen === 'PLAY_RETURN_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aPlayReturn), fileName: 'PlayReturn.xlsx' }
      } else if (isOpen === 'CASHBACK_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aCashback), fileName: 'CashbackReport.xlsx' }
      } else if (isOpen === 'CASHBACK_RETURN_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aCashbackReturn), fileName: 'CashbackReturnReport.xlsx' }
      } else if (isOpen === 'PRIVATE_LEAGUE_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aPrivateLeague), fileName: 'PrivateLeagueReport.xlsx' }
      } else if (isOpen === 'APP_DOWNLOAD_REPORT') {
        exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(dateWiseReports?.aAppDownload), fileName: 'AppDownloadReport.xlsx' }
      }
      exporter.current.save()
    } else {
      setMessage('Please Select Date Range')
      setModalMessage(true)
      setStatus(false)
    }
  }
  const reportList = [
    { key: 'USER_REPORT', value: 'USER_REPORT', name: 'Users Report' },
    { key: 'USERTEAM_REPORT', value: 'USERTEAM_REPORT', name: 'Teams Report' },
    { key: 'PARTICIPANT_REPORT', value: 'PARTICIPANT_REPORT', name: 'Participants Report' },
    { key: 'WIN_REPORT', value: 'WIN_REPORT', name: 'Win Report' },
    { key: 'WIN_RETURN_REPORT', value: 'WIN_RETURN_REPORT', name: 'Win Return Report' },
    { key: 'PRIVATE_LEAGUE_REPORT', value: 'PRIVATE_LEAGUE_REPORT', name: 'Private League Report' },
    { key: 'PLAY_REPORT', value: 'PLAY_REPORT', name: 'Played Report' },
    { key: 'PLAY_RETURN_REPORT', value: 'PLAY_RETURN_REPORT', name: 'Play Return Report' },
    { key: 'CASHBACK_REPORT', value: 'CASHBACK_REPORT', name: 'Cashback Report' },
    { key: 'CASHBACK_RETURN_REPORT', value: 'CASHBACK_RETURN_REPORT', name: 'Cashback Return Report' },
    { key: 'CREATOR_BONUS_REPORT', value: 'CREATOR_BONUS_REPORT', name: 'Creator Bonus Report' },
    { key: 'CREATOR_BONUS_RETURN_REPORT', value: 'CREATOR_BONUS_RETURN_REPORT', name: 'Creator Bonus Return Report' },
    { key: 'APP_DOWNLOAD_REPORT', value: 'APP_DOWNLOAD_REPORT', name: 'App Download Report' }
  ]

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {loading && <Loading />}

      {isOpen === 'USER_REPORT'
        ? (
          <ExcelExport ref={exporter} fileName='Reports.xlsx'>
            <ExcelExportColumnGroup headerCellOptions={{ textAlign: 'center' }} title="Users">
              <ExcelExportColumn field='nTotalUsers' title='Total Users' />
              <ExcelExportColumn field='nTotalEmailVerifiedUsers' title='Email Verified user' />
              <ExcelExportColumn field='nTotalPhoneVerifiedUsers' title='Mobile No verified user' />
            </ExcelExportColumnGroup>

            <ExcelExportColumnGroup headerCellOptions={{ textAlign: 'center' }} title="Registered Users">
              <ExcelExportColumn field='totalRegisteredUsers' title='Total Registered Users' />
              <ExcelExportColumn field='platformWiseRegisteredUsers' title='Platform Wise Registered Users' />
            </ExcelExportColumnGroup>

            <ExcelExportColumn field='totalLoggedInUsers' title='Total Logged In Users' />

            <ExcelExportColumnGroup headerCellOptions={{ textAlign: 'center' }} title="Deposits">
              <ExcelExportColumn field='nTotalDeposits' title='Total Deposits' />
              <ExcelExportColumn field='nTotalPendingDeposits' title='Pending Deposits' />
              <ExcelExportColumn field='nTotalSuccessDeposits' title='Success Deposits' />
              <ExcelExportColumn field='nTotalRejectedDeposits' title='Rejected Deposits' />
              <ExcelExportColumn field='nTotalCancelledDeposits' title='Cancelled Deposits' />
              <ExcelExportColumn field='nTotalWinnings' title='Total Winnings' />
              <ExcelExportColumn field='depositMethods' title='Deposit Methods' />
            </ExcelExportColumnGroup>

            <ExcelExportColumnGroup headerCellOptions={{ textAlign: 'center' }} title="Withdrawals">
              <ExcelExportColumn field='nTotalWithdrawals' title='Total Withdrawals' />
              <ExcelExportColumn field='successWithdrawals' title='Successful Withdrawals' />
              <ExcelExportColumn field='pendingWithdrawals' title='Pending Withdrawals' />
            </ExcelExportColumnGroup>

            <ExcelExportColumn field='totalUserBonus' title='Total User Bonus' />
            <ExcelExportColumn field='totalBonusExpire' title='Total Bonus Expire' />

            <ExcelExportColumnGroup headerCellOptions={{ textAlign: 'center' }} title="TDS">
              <ExcelExportColumn field='nTotalTds' title='Total TDS' />
              <ExcelExportColumn field='nTotalPendingTds' title='Pending TDS' />
              <ExcelExportColumn field='nTotalActiveTds' title='Active TDS' />
            </ExcelExportColumnGroup>
          </ExcelExport>
          )
        : ''}
      {(isOpen === 'USERTEAM_REPORT' || isOpen === 'PARTICIPANT_REPORT' || isOpen === 'CREATOR_BONUS_REPORT' || isOpen === 'CREATOR_BONUS_RETURN_REPORT')
        ? (
          <ExcelExport ref={exporter} fileName='Reports.xlsx'>
            <ExcelExportColumn field='eCategory' title='SportsType' />
            <ExcelExportColumn field='nTotal' title='Total' />
            <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
          </ExcelExport>
          )
        : ''}
      {(isOpen === 'WIN_REPORT' || isOpen === 'WIN_RETURN_REPORT' || isOpen === 'PLAY_REPORT' || isOpen === 'PLAY_RETURN_REPORT' || isOpen === 'CASHBACK_REPORT' || isOpen === 'CASHBACK_RETURN_REPORT')
        ? (
          <ExcelExport ref={exporter} fileName='Reports.xlsx'>
            <ExcelExportColumn field='eCategory' title='SportsType' />
            <ExcelExportColumnGroup headerCellOptions={{ textAlign: 'center' }} title="Total">
              <ExcelExportColumn field='nTotalCash' title='Total Cash' />
              <ExcelExportColumn field='nTotalBonus' title='Total Bonus' />
            </ExcelExportColumnGroup>
            <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
          </ExcelExport>
          )
        : ''}

      {isOpen === 'PRIVATE_LEAGUE_REPORT'
        ? (
          <ExcelExport ref={exporter} fileName='Reports.xlsx'>
            <ExcelExportColumn field='eCategory' title='SportsType' />
            <ExcelExportColumnGroup headerCellOptions={{ textAlign: 'center' }} title="Total">
              <ExcelExportColumn field='createdTotal' title='Created' />
              <ExcelExportColumn field='completedTotal' title='Completed' />
              <ExcelExportColumn field='cancelledTotal' title='Cancelled' />
            </ExcelExportColumnGroup>
            <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
          </ExcelExport>
          )
        : ''}

      {isOpen === 'APP_DOWNLOAD_REPORT'
        ? (
          <ExcelExport ref={exporter} fileName='Reports.xlsx'>
            <ExcelExportColumn field='ePlatform' title='Platform' />
            <ExcelExportColumn field='nTotal' title='Total' />
            <ExcelExportColumn field='dUpdatedAt' title='Last Updated Time' />
          </ExcelExport>
          )
        : ''}

      <div className='d-flex justify-content-between flex-wrap pr-4 pl-4 mt-4'>
        <Row className='reports-heading'>
          <button className={userType === 'U' ? 'reports-heading-col-active' : 'reports-heading-col'} onClick={(e) => setUserTypeFunc('U')}>
            User
          </button>
          <button className={userType === 'B' ? 'reports-heading-col-active' : 'reports-heading-col'} onClick={(e) => setUserTypeFunc('B')}>
            System User
          </button>
        </Row>
        {((Auth && Auth === 'SUPER') || (adminPermission?.REPORT !== 'N')) && (
        <FormGroup>
          <DatePicker
            customInput={<ExampleCustomInput />}
            dropdownMode="select"
            endDate={endDate}
            isClearable={true}
            maxDate={new Date()}
            minDate={startDate}
            onChange={(update) => { setDateRange(update) }}
            peekNextMonth
            placeholderText='Select Date Range'
            selectsRange={true}
            showMonthDropdown
            showYearDropdown
            startDate={startDate}
            value={dateRange}
          />
        </FormGroup>
        )}
      </div>

      <div className='report-container'>
        <div className='report-container-1'>
          {
        reportList?.map((item, index) => {
          return (
            <li key={index} className={isOpen === item.value ? 'report-list-active' : 'report-list'} onClick={(e) => toggle(e, item?.value)} >
              {' '}
              {item?.name}
            </li>
          )
        })
      }
        </div>
        <main className='main-content-report d-flex'>
          <UserReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            userType={userType}
            TotalUsers={TotalUsers}
            RegisteredUsers={RegisteredUsers}
            DroppedUsers={DroppedUsers}
            LoginUser={LoginUser}
            Deposit={Deposit}
            Withdraw={Withdraw}
            BonusExpire={BonusExpire}
            TDS={TDS}
            userBonus={userBonus}
            token={token}
            setLoading={setLoading}
            permission={permission}
          />

          <UserTeamReports {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            userType={userType}
            sports={sports}
            Teams={Teams}
            permission={permission}
            previousProps={previousProps}
            token={token}
            setLoading={setLoading}
            updatedTeamData={updatedTeamData}
            setTeams={setTeams}
          />

          <ParticipantReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            Participants ={Participants}
            sports={sports}
            permission={permission}
            token={token}
            setLoading={setLoading}
            userType={userType}
            updatedParticipantsData={updatedParticipantsData}
            setParticipants={setParticipants}
            previousProps={previousProps}
          />

          <WinReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            Wins={Wins}
            setLoading={setLoading}
            userType={userType}
            token={token}
            updatedWinsData={updatedWinsData}
            previousProps={previousProps}
            setWins={setWins}
          />

          <WinReturnReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            WinReturn={WinReturn}
            token={token}
            userType={userType}
            setLoading={setLoading}
            updatedWinReturnData={updatedWinReturnData}
            previousProps={previousProps}
            setWinReturn={setWinReturn}
          />

          <PrivateLeagueReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            PrivateLeague={PrivateLeague}
            token={token}
            setLoading={setLoading}
            updatedPrivateLeagueData={updatedPrivateLeagueData}
            setPrivateLeague={setPrivateLeague}
            previousProps={previousProps}
          />

          <PlayReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            played={played}
            token={token}
            userType={userType}
            setLoading={setLoading}
            updatedPlayedData={updatedPlayedData}
            previousProps={previousProps}
            setPlayed={setPlayed}
          />

          <PlayReturnReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            playReturn = {playReturn}
            token={token}
            userType={userType}
            setLoading={setLoading}
            updatedPlayReturnData={updatedPlayReturnData}
            previousProps={previousProps}
            setPlayReturn={setPlayReturn}
          />

          <CashbackReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            cashback={cashback}
            token={token}
            userType={userType}
            setLoading={setLoading}
            updatedCashbackData={updatedCashbackData}
            previousProps={previousProps}
            setCashback={setCashback}
          />
          <CashbackReturnReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            cashbackReturn ={cashbackReturn}
            token={token}
            userType={userType}
            setLoading={setLoading}
            previousProps={previousProps}
            setCashbackReturn={setCashbackReturn}
            updatedCashbackReturnData={updatedCashbackReturnData}
          />

          <CreatorBonusReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            creatorBonus={creatorBonus}
            token={token}
            setLoading={setLoading}
            updatedCreatorBonusData={updatedCreatorBonusData}
            setCreatorBonus={setCreatorBonus}
            previousProps={previousProps}
          />

          <CreatorBonusReturnReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            sports={sports}
            permission={permission}
            creatorBonusReturn={creatorBonusReturn}
            token={token}
            setLoading={setLoading}
            updatedCreatorBonusReturnData={updatedCreatorBonusReturnData}
            previousProps={previousProps}
            setCreatorBonusReturn={setCreatorBonusReturn}
          />

          <AppDownloadReport {...props}
            dateWiseReports = {dateWiseReports}
            isOpen={isOpen}
            permission={permission}
            appDownloadReturn={appDownloadReturn}
            token={token}
            setLoading={setLoading}
            updatedAppDownloadStatisticsData={updatedAppDownloadStatisticsData}
            previousProps={previousProps}
            setAppDownloadReturn={setAppDownloadReturn}
          />
        </main>
      </div>
    </Fragment>
  )
})

AllReports.propTypes = {
  location: PropTypes?.object,
  onClick: PropTypes?.func,
  value: PropTypes?.string
}

AllReports.displayName = AllReports
export default connect(null, null, null, { forwardRef: true })(AllReports)
