import React, { Fragment, forwardRef, useEffect, useState, useRef, useImperativeHandle } from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { Button, CustomInput, Badge, Modal, ModalBody, Row, Col } from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import qs from 'query-string'
import PropTypes from 'prop-types'

import sortIcon from '../../assets/images/sort-icon.svg'
import editButton from '../../assets/images/edit-pen-icon.svg'
import deleteButton from '../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../assets/images/error-warning.svg'

import AlertMessage from '../../components/AlertMessage'
import DataNotFound from '../../components/DataNotFound'
import SkeletonTable from '../../components/SkeletonTable'
import PaginationComponent from '../../components/PaginationComponent'
import { modalMessageFunc } from '../../helpers/helper'
import { deleteleague } from '../../actions/league'
import { getListOfCategory } from '../../actions/leaguecategory'

const LeaguesList = forwardRef((props, ref) => {
  const {
    List,
    getList,
    updateLeague,
    UpdatedLeague,
    blankMessage,
    getGameCategory,
    flag,
    activeSports
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const search = props.search
  const searchField = props.searchField
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'desc')
  const [sort, setSort] = useQueryState('sortBy', 'sName')
  const [LeagueCategory, setLeagueCategory] = useQueryState('leagueCategory', '')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [listLength, setListLength] = useState('10 Rows')
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  const SelectGame = props.selectGame
  const resStatus = useSelector((state) => state.league.resStatus)
  const resMessage = useSelector((state) => state.league.resMessage)
  const Auth = useSelector((state) => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector((state) => state.auth.adminPermission)
  const previousProps = useRef({
    List,
    resMessage,
    resStatus,
    SelectGame,
    LeagueCategory,
    start,
    offset,
    searchField,
    activeSports
  }).current
  const paginationFlag = useRef(false)

  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const obj = qs.parse(location.search)

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    const orderBy = 'asc'
    let leagueCategory = ''
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} Rows`)
      }
      if (obj.leagueCategory) {
        leagueCategory = obj.leagueCategory
        setLeagueCategory(leagueCategory)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, orderBy, search, searchField, LeagueCategory, SelectGame)
    if (adminPermission?.MATCH !== 'N') {
      getGameCategory()
    }
    dispatch(getListOfCategory(token))
    setLoading(true)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  //  to set legaue list
  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.results) {
          const userArrLength = List.results.length
          const startFrom = (activePageNo - 1) * offset + 1
          const end = startFrom - 1 + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setTotal(List.total ? List.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  // to handle response
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
            getGameCategory()
            dispatch(getListOfCategory(token))
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
            getGameCategory()
            dispatch(getListOfCategory(token))
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
        } else {
          getGameCategory()
          setStatus(resStatus)
          setMessage(resMessage)
          setModalWarning(false)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // to handle query params
  useEffect(() => {
    let data = localStorage.getItem('queryParams')
      ? JSON.parse(localStorage.getItem('queryParams'))
      : {}
    data === {}
      ? (data = {
          League: location.search
        })
      : (data.League = location.search)
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  //  to handle serach operation
  useEffect(() => {
    if (previousProps.searchField !== searchField) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
      setPageNo(1)
      setStart(startFrom)
      setLoading(true)
    }
    return () => {
      previousProps.searchField = searchField
    }
  }, [searchField])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.search !== search && flag) {
      const debouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(debouncer)
        previousProps.search = search
      }
    }
    return () => {
      previousProps.search = search
    }
  }, [search])

  //  to set and get sport type list
  useEffect(() => {
    if (previousProps.SelectGame !== SelectGame) {
      if (SelectGame) {
        const startFrom = 0
        const limit = offset
        getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
        setStart(startFrom)
        setPageNo(1)
        setLoading(true)
      }
    }
    return () => {
      previousProps.SelectGame = SelectGame
    }
  }, [SelectGame])

  //  to set and get the list of legaue category
  useEffect(() => {
    if (previousProps.LeagueCategory !== LeagueCategory) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, searchField, LeagueCategory, SelectGame)
      setStart(startFrom)
      setPageNo(1)
    }
    return () => {
      previousProps.LeagueCategory = LeagueCategory
    }
  }, [LeagueCategory])

  // will be called when page change occured
  useEffect(() => {
    if (
      (previousProps.start !== start || previousProps.offset !== offset) &&
      paginationFlag.current
    ) {
      getList(start, offset, sort, order, search, searchField, LeagueCategory, SelectGame)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deleteleague(deleteId, token))
    setLoading(true)
  }

  // close popup modal
  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  // forsort ascending and decending order
  function onSorting (sort) {
    setSort(sort)
    if (order === 'asc') {
      const startFrom = 0
      const limit = 10
      setOrder('desc')
      getList(startFrom, limit, sort, 'desc', search, searchField, LeagueCategory, SelectGame)
    } else {
      const startFrom = 0
      const limit = 10
      setOrder('asc')
      getList(startFrom, limit, sort, 'asc', search, searchField, LeagueCategory, SelectGame)
    }
  }
  // update status from list
  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const UpdatedLeagueData = {
      LeagueName: selectedData.sName,
      maxEntry: selectedData.nMax,
      minEntry: selectedData.nMin,
      Price: selectedData.nPrice,
      TotalPayout: selectedData.nTotalPayout,
      DeducePercent: selectedData.nDeductPercent,
      BonusUtil: selectedData.nBonusUtil,
      ConfirmLeague: selectedData.bConfirmLeague ? 'Y' : 'N',
      multipleEntry: selectedData.bMultipleEntry ? 'Y' : 'N',
      autoCreate: selectedData.bAutoCreate ? 'Y' : 'N',
      poolPrize: selectedData.bPoolPrize ? 'Y' : 'N',
      Position: selectedData.nPosition,
      active: statuss,
      GameCategory: selectedData.eCategory,
      LeagueCategory: selectedData.iLeagueCatId,
      iFilterCatId: selectedData.iFilterCatId,
      TeamJoinLimit: selectedData.nTeamJoinLimit,
      winnersCount: selectedData.nWinnersCount,
      LoyaltyPoint: selectedData.nLoyaltyPoint,
      unlimitedJoin: selectedData.bUnlimitedJoin ? 'Y' : 'N',
      minCashbackTeam: selectedData.nMinCashbackTeam,
      cashBackAmount: selectedData.nCashbackAmount,
      cashbackType: selectedData.eCashbackType,
      minTeamCount: selectedData.nMinTeamCount,
      botCreate: selectedData.bBotCreate ? 'Y' : 'N',
      cashbackEnabled: selectedData.bCashbackEnabled ? 'Y' : 'N',
      copyBotPerTeam: selectedData.nCopyBotsPerTeam
    }
    UpdatedLeague(UpdatedLeagueData, selectedData._id)
    blankMessage()
    setLoading(true)
    toggleWarning()
  }

  // export list
  const processExcelExportData = (data) =>
    data.map((leagueList) => {
      const bAutoCreate = leagueList.bAutoCreate ? 'Yes' : 'No'
      const eStatus = leagueList.eStatus ? 'Active' : 'InActive'
      const bMultipleEntry = leagueList.bMultipleEntry ? 'Yes' : 'No'
      const bCashbackEnabled = leagueList.bCashbackEnabled ? 'Yes' : 'No'
      const bPoolPrize = leagueList.bPoolPrize ? 'Yes' : 'No'
      const bUnlimitedJoin = leagueList.bUnlimitedJoin ? 'Yes' : 'No'
      const bBotCreate = leagueList.bBotCreate ? 'Yes' : 'No'
      const bConfirmLeague = leagueList.bConfirmLeague ? 'Yes' : 'No'
      const nWinnersCount = leagueList.nWinnersCount ? leagueList.nWinnersCount : 0
      const nMinTeamCount = leagueList.nMinTeamCount ? leagueList.nMinTeamCount : 0
      const nMinCashbackTeam = leagueList.nMinCashbackTeam ? leagueList.nMinCashbackTeam : 0
      const nCashbackAmount = leagueList.nCashbackAmount ? leagueList.nCashbackAmount : 0
      const eCashbackTypeIfPart = leagueList.eCashbackType === 'C' ? 'Cash' : 'Bonus'
      const eCashbackType = leagueList.eCashbackType ? eCashbackTypeIfPart : '--'
      const nTeamJoinLimit = leagueList.nTeamJoinLimit ? leagueList.nTeamJoinLimit : 0
      const nCopyBotsPerTeam = leagueList.nCopyBotsPerTeam ? leagueList.nCopyBotsPerTeam : 0
      return {
        ...leagueList,
        bAutoCreate,
        eStatus,
        bMultipleEntry,
        bCashbackEnabled,
        bPoolPrize,
        bUnlimitedJoin,
        bBotCreate,
        bConfirmLeague,
        nWinnersCount,
        nMinTeamCount,
        nMinCashbackTeam,
        nCashbackAmount,
        eCashbackType,
        nTeamJoinLimit,
        nCopyBotsPerTeam
      }
    })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter.current.props,
        data: processExcelExportData(list),
        fileName: 'LeagueList.xlsx'
      }
      exporter.current.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))
  // .alert-dismissible
  return (
    <Fragment>

      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="League" obj={obj}/>
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
              <ExcelExport ref={exporter} data={list} fileName="LeagueList.xlsx">
                <ExcelExportColumn field="sName" title="League Name" />
                <ExcelExportColumn field="eCategory" title="Game Category" />
                <ExcelExportColumn field="sLeagueCategory" title="League Category" />
                <ExcelExportColumn field="sFilterCategory" title="Filter Category" />
                <ExcelExportColumn field="nLoyaltyPoint" title="Loyalty Point" />
                <ExcelExportColumn field="bConfirmLeague" title="Confirm League" />
                <ExcelExportColumn field="bAutoCreate" title="Auto Create" />
                <ExcelExportColumn field="nPrice" title="Entry Fee" />
                <ExcelExportColumn field="nMin" title="Min Entry" />
                <ExcelExportColumn field="nMax" title="Max Entry" />
                <ExcelExportColumn field="nTotalPayout" title="Total Payout" />
                <ExcelExportColumn field="nWinnersCount" title="Winners Count" />
                <ExcelExportColumn field="nBonusUtil" title="Bonus Util(%)" />
                <ExcelExportColumn field="nPosition" title="Position" />
                <ExcelExportColumn field="eStatus" title="Status" />
                <ExcelExportColumn field="bMultipleEntry" title="Multiple Entry" />
                <ExcelExportColumn field="nTeamJoinLimit" title="Team Join Limit" />
                <ExcelExportColumn field="bCashbackEnabled" title="Cashback Enabled" />
                <ExcelExportColumn field="nMinCashbackTeam" title="Min no of Team for Cashback" />
                <ExcelExportColumn field="nCashbackAmount" title="Cashback Amount" />
                <ExcelExportColumn field="eCashbackType" title="Cashback Type" />
                <ExcelExportColumn field="bPoolPrize" title="Pool Prize" />
                <ExcelExportColumn field="bUnlimitedJoin" title="Unlimited Join" />
                <ExcelExportColumn field="nDeductPercent" title="Deduct Percent" />
                <ExcelExportColumn field="nMinTeamCount" title="Min no of Team for bot" />
                <ExcelExportColumn field="bBotCreate" title="Bot Create" />
                <ExcelExportColumn field="nCopyBotsPerTeam" title="Copy bots per team" />
              </ExcelExport>
              <table className="table">
                <thead>
                  <tr>
                    <th> No. </th>
                    <th> Status </th>
                    <th>
                      <span className="d-inline-block align-middle"> Name </span>
                      <Button className="sort-btn" color="link"><img alt="sorting" className="m-0 d-block" onClick={() => onSorting('sName')} src={sortIcon}/></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle">League Category</span>
                      <Button className="sort-btn" color="link"><img alt="sorting" className="m-0 d-block" onClick={() => onSorting('sLeagueCategory')} src={sortIcon}/></Button>
                    </th>
                    <th>Leauge Type</th>
                    <th> Min-Max Entry </th>
                    <th>
                      <span className="d-inline-block align-middle"> Entry Fee</span>
                      <Button className="sort-btn" color="link"><img alt="sorting" className="m-0 d-block" onClick={() => onSorting('nPrice')} src={sortIcon}/></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle">  Bonus Util(%)</span>
                      <Button className="sort-btn" color="link"><img alt="sorting" className="m-0 d-block" onClick={() => onSorting('nBonusUtil')} src={sortIcon}/></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle"> Total Payout </span>
                      <Button className="sort-btn" color="link"><img alt="sorting" className="m-0 d-block" onClick={() => onSorting('nTotalPayout')} src={sortIcon}/></Button>
                    </th>
                    <th>
                      <span className="d-inline-block align-middle"> Winners Count</span>
                      <Button className="sort-btn" color="link"><img alt="sorting" className="sort-icon m-0 d-block" onClick={() => onSorting('nWinnersCount')} src={sortIcon}/></Button>
                    </th>
                    <th> Pool Prize </th>
                    <th> Position </th>
                    <th> Actions </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? (
                      <SkeletonTable numberOfColumns={13} />
                      )
                    : (
                      <Fragment>
                        {list &&
                  list.length !== 0 &&
                  list.map((data, i) => (
                    <tr key={data._id}>
                      <td>{(index - 1) * offset + (i + 1)}</td>
                      <td className="success-text">
                        <CustomInput
                          checked={data.eStatus === 'Y'}
                          disabled={adminPermission?.LEAGUE === 'R'}
                          id={`${data.sName}`}
                          name={`${data.sName}`}
                          onClick={() =>
                            warningWithConfirmMessage(
                              data,
                              data.eStatus === 'Y' ? 'Inactivate' : 'Activate'
                            )
                          }
                          type="switch"
                        />
                      </td>
                      <td>{data.sName}</td>
                      <td>{data.sLeagueCategory}</td>
                      <td>
                        {data.bAutoCreate
                          ? (
                            <Badge className="category-warn ml-1" color="warning">
                              A
                            </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.bConfirmLeague
                          ? (
                            <Badge className="category-success ml-1">
                              C
                            </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.bMultipleEntry
                          ? (
                            <Badge className="category-primary ml-1" color="primary">
                              M
                            </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.nBonusUtil > 0
                          ? (
                            <Badge className="category-info ml-1" color="info">
                              B
                            </Badge>
                            )
                          : (
                              ''
                            )}
                        {data.bUnlimitedJoin
                          ? (
                            <Badge className="category-secondary ml-1" color="secondary">
                              ∞
                            </Badge>
                            )
                          : (
                              ''
                            )}
                        {!data.bAutoCreate &&
                        !data.bConfirmLeague &&
                        !data.bMultipleEntry &&
                        !data.nBonusUtil > 0 &&
                        !data.bUnlimitedJoin
                          ? '--'
                          : ''}
                      </td>
                      <td>
                        (
                        {data.nMin}
                        {' '}
                        -
                        {' '}
                        {data.nMax}
                        )
                      </td>
                      <td className='league-num-field'>{data.nPrice}</td>
                      <td className='league-num-field'>{data.nBonusUtil}</td>
                      <td className='league-num-field'>{data.nTotalPayout}</td>
                      <td className='league-num-field'>{data.nWinnersCount || '--'}</td>
                      <td className='league-pool-prize-td'>
                        <Badge className="league-pool-prize" color={`${data.bPoolPrize ? 'success' : 'danger'}`}>
                          {data.bPoolPrize ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className='league-num-field'>{data.nPosition}</td>

                      <td>
                        <ul className="action-list mb-0 d-flex">
                          <li className='action-btn'>
                            <Button className='edit-btn-icon' color="link" tag={Link} to={`${updateLeague}/${data._id}`}>
                              <span><img alt="View" src={editButton} /></span>
                            </Button>
                          </li>
                          {((Auth && Auth === 'SUPER') || adminPermission?.LEAGUE !== 'R') && (
                            <li>
                              <Button className='delete-btn-icon' color="link" onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                <span><img alt="Delete" src={deleteButton} /></span>
                              </Button>
                            </li>
                          )}
                        </ul>
                      </td>
                    </tr>
                  ))}
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}
      {list?.length !== 0 && (
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
      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row>
            <Col md={12} xl={6}>
              <Button
                className="theme-btn outline-btn-cancel full-btn-cancel"
                onClick={deleteId ? onCancel : toggleWarning}
                type="submit"
              >
                Cancel
              </Button>
            </Col>
            <Col md={12} xl={6} >
              <Button
                className="theme-btn danger-btn full-btn"
                onClick={deleteId ? onDelete : onStatusUpdate}
                type="submit"
              >
                {' '}
                {deleteId ? 'Delete It' : `${type} Now`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

LeaguesList.defaultProps = {
  history: {},
  search: ''
}

LeaguesList.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.object,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  search: PropTypes.string,
  List: PropTypes.object,
  getList: PropTypes.func,
  updateLeague: PropTypes.string,
  UpdatedLeague: PropTypes.func,
  blankMessage: PropTypes.func,
  handleSportType: PropTypes.func,
  handleSearch: PropTypes.func,
  getGameCategory: PropTypes.func,
  selectGame: PropTypes.string,
  location: PropTypes.object,
  flag: PropTypes.bool,
  searchField: PropTypes.string,
  handleSearchBox: PropTypes.func,
  activeSports: PropTypes.array
}

LeaguesList.displayName = LeaguesList
export default connect(null, null, null, { forwardRef: true })(LeaguesList)
