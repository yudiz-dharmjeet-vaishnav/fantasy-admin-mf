import React, { useState, Fragment, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useSelector, connect, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Button, FormGroup, CustomInput, Modal, ModalBody, Row, Col, Input, ModalHeader, Label } from 'reactstrap'
import qs from 'query-string'
import PropTypes from 'prop-types'

import right from '../../../assets/images/right-icon.svg'
import sortIcon from '../../../assets/images/sort-icon.svg'
import noImage from '../../../assets/images/no-image-1.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'

import Loading from '../../../components/Loading'
import DataNotFound from '../../../components/DataNotFound'
import AlertMessage from '../../../components/AlertMessage'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
import { deleteMatchPlayer, getMatchPlayerScorePoint, updateMPScorePoint } from '../../../actions/matchplayer'

const MatchPlayerComponent = forwardRef((props, ref) => {
  const {
    List, getList, flag, editLink, UpdateMatchPlayer, playerRoleList, MatchDetails, role, team, setTeams, activePageNo, offset, setPageNo, setOffset, setOrder, setSearch, sort, order, setSort, search, substitute
  } = props
  const location = useLocation()
  const searchProp = props.search
  const [start, setStart] = useState(0)
  const [playerRole, setPlayerRole] = useState('')
  const [credits, setCredits] = useState(0)
  const [isEditableField, setIsEditableField] = useState(false)
  const [fieldType, setFieldType] = useState('')
  const [total, setTotal] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [nameOrder, setNameOrder] = useState('asc')
  const [url, setUrl] = useState('')
  const [createdOrder, setCreatedOrder] = useState('asc')
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [deleteId, setDeleteId] = useState('')
  const [listLength, setListLength] = useState('10 Rows')
  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const [matchPlayerId, setMatchPlayerId] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const toggleModal = () => setModalOpen(!isModalOpen)
  const [aScorePoint, setaScorePoint] = useState([])
  const [seasonPoints, setSeasonPoints] = useState('')
  const matchPlayerScoreList = useSelector(state => state.matchplayer.matchPlayerScorePointList)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    List, searchProp, resMessage, resStatus, role, team, start, offset, matchPlayerScoreList
  }).current
  const paginationFlag = useRef(false)
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const obj = qs.parse(location.search)
  const toggle = (data, type) => {
    setIsEditableField(true)
    setFieldType(type)
    setSelectedData(data)
    if (type === 'Role') {
      setPlayerRole(data.eRole)
    } else if (type === 'Credits') {
      setCredits(data.nFantasyCredit)
    } else {
      setSeasonPoints(data.nSeasonPoints)
    }
  }

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
    }
    let page = 1
    let limit = offset
    let order = 'dsc'

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
      if (obj.order) {
        order = obj.order
        setOrder(order)
      }
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search, role, team, substitute)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps.MatchDetails !== MatchDetails) {
      if (MatchDetails) {
        const arr = []
        const team1 = {
          sName: MatchDetails?.oHomeTeam?.sName,
          iTeamId: MatchDetails?.oHomeTeam?.iTeamId
        }
        arr.push(team1)
        const team2 = {
          sName: MatchDetails?.oAwayTeam?.sName,
          iTeamId: MatchDetails?.oAwayTeam?.iTeamId
        }
        arr.push(team2)
        setTeams(arr)
      }
    }
    return () => {
      previousProps.MatchDetails = MatchDetails
    }
  }, [MatchDetails])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    if (previousProps.List !== List) {
      if (List) {
        if (List.results) {
          const userArrLength = List.results.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(List.results ? List.results : [])
        setIndex(activePageNo)
        setTotal(List.total ? List.total : 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : []
    !Object.keys(data)?.length
      ? data = {
        MatchPlayerManagement: location.search
      }
      : data.MatchPlayerManagement = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search, role, team, substitute)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search, role, team, substitute)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
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

  useEffect(() => {
    if (previousProps.role !== role) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, role, team, substitute)
      setPageNo(1)
    }
    return () => {
      previousProps.role = role
    }
  }, [role])

  useEffect(() => {
    if (previousProps.team !== team) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, search, role, team, substitute)
      setPageNo(1)
    }
    return () => {
      previousProps.team = team
    }
  }, [team])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search, role, team, substitute)
      setSearch(searchProp.trim())
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps.searchProp !== searchProp && flag) {
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

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, sort, order, search, role, team, substitute)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onRefresh () {
    getList(start, offset, sort, order, search, role, team, substitute)
    setLoading(true)
    setPageNo(activePageNo)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  function onSorting (sortingBy) {
    const Order = sortingBy === 'sName' ? nameOrder : createdOrder
    if (Order === 'asc') {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'desc', search, role, team, substitute)
      setOrder('desc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('desc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('desc')
        setSort(sortingBy)
      }
    } else {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sortingBy, 'asc', search, role, team, substitute)
      setOrder('asc')
      setPageNo(1)
      setLoading(true)
      if (sortingBy === 'sName') {
        setNameOrder('asc')
        setSort(sortingBy)
      } else {
        setCreatedOrder('asc')
        setSort(sortingBy)
      }
    }
  }

  function handleInputChange (event, type) {
    switch (type) {
      case 'Role':
        setPlayerRole(event.target.value)
        break
      case 'Credits':
        if (parseFloat(event.target.value) || !event.target.value) {
          setCredits(event.target.value)
        }
        break
      case 'SeasonPoints':
        if (parseFloat(event.target.value) || !event.target.value) {
          setSeasonPoints(event.target.value)
        }
        break
      default:
        break
    }
  }

  // update status of the match player
  function statusUpdate (data) {
    const Show = data.bShow === true ? 'N' : 'Y'
    UpdateMatchPlayer(
      data.sName,
      data.iPlayerId,
      data.sImage,
      data.eRole,
      data.nFantasyCredit,
      data.nScoredPoints,
      data.nSeasonPoints,
      '',
      Show,
      data.eStatus,
      data.bPlayInLastMatch ? 'Y' : 'N',
      data._id,
      data?.bSubstitute
    )
  }

  function updatePlayedInLastMatch (data) {
    const playedInLastMatch = data.bPlayInLastMatch === true ? 'N' : 'Y'
    UpdateMatchPlayer(
      data.sName,
      data.iPlayerId,
      data.sImage,
      data.eRole,
      data.nFantasyCredit,
      data.nScoredPoints,
      data.nSeasonPoints,
      '',
      data.bShow ? 'Y' : 'N',
      data.eStatus,
      playedInLastMatch,
      data._id,
      data?.bSubstitute ? 'Y' : 'N'
    )
  }
  function updateSubstitutePlayer (data) {
    const substitutePlayer = data.bSubstitute === true ? 'N' : 'Y'
    UpdateMatchPlayer(
      data.sName,
      data.iPlayerId,
      data.sImage,
      data.eRole,
      data.nFantasyCredit,
      data.nScoredPoints,
      data.nSeasonPoints,
      '',
      data.bShow ? 'Y' : 'N',
      data.eStatus,
      data.bPlayInLastMatch ? 'Y' : 'N',
      data._id,
      substitutePlayer
    )
  }

  // update status of the match player
  function statusUpdateFrontend (data) {
    const status = data.eStatus === 'Y' ? 'N' : 'Y'
    UpdateMatchPlayer(
      data.sName,
      data.iPlayerId,
      data.sImage,
      data.eRole,
      data.nFantasyCredit,
      data.nScoredPoints,
      data.nSeasonPoints,
      '',
      data.bShow ? 'Y' : 'N',
      status,
      data.bPlayInLastMatch ? 'Y' : 'N',
      data._id,
      data?.bSubstitute ? 'Y' : 'N'
    )
  }

  function onStatusUpdate (e, field) {
    e.preventDefault()
    if (field === 'roleAndCredits') {
      UpdateMatchPlayer(
        selectedData.sName,
        selectedData.iPlayerId,
        selectedData.sImage,
        playerRole || selectedData.eRole,
        credits || selectedData.nFantasyCredit,
        selectedData.nScoredPoints,
        seasonPoints || selectedData.nSeasonPoints,
        '',
        selectedData.bShow === true ? 'Y' : 'N',
        selectedData.eStatus === 'Y' ? 'Y' : 'N',
        selectedData.bPlayInLastMatch === true ? 'Y' : 'N',
        selectedData._id,
        selectedData?.bSubstitute === true ? 'Y' : 'N'
      )
      setCredits('')
      setPlayerRole('')
      setSeasonPoints('')
      setIsEditableField(false)
      setFieldType('')
    }
    setLoading(true)
  }

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deleteMatchPlayer(deleteId, MatchDetails?._id, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  useEffect(() => {
    if (matchPlayerScoreList) {
      const arr = []
      if (matchPlayerScoreList.length !== 0) {
        matchPlayerScoreList.map((data) => {
          const obj = {
            _id: data._id,
            sName: data.sName,
            nScoredPoints: data.nScoredPoints
          }
          arr.push(obj)
          return arr
        })
        setaScorePoint(arr)
      }
      setLoading(false)
    }
    return () => {
      previousProps.matchPlayerScoreList = matchPlayerScoreList
    }
  }, [matchPlayerScoreList])

  function onEdit (e) {
    e.preventDefault()
    setModalOpen(false)
    dispatch(updateMPScorePoint(aScorePoint, matchPlayerId, token))
    setLoading(true)
  }

  function onChangeScorePoint (event, ID) {
    const arr = [...aScorePoint]
    const i = arr.findIndex(data => data._id === ID)
    if (event.target.value && parseFloat(event.target.value)) {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(event.target.value) }
      setaScorePoint(arr)
    } else {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(0) }
      setaScorePoint(arr)
    }
  }

  function openModalFunc (id) {
    dispatch(getMatchPlayerScorePoint(token, id))
    setMatchPlayerId(id)
    setModalOpen(true)
  }

  return (
    <Fragment>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Match Player" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className='table-responsive'>

              <AlertMessage
                close={close}
                message={message}
                modalMessage={modalMessage}
                status={status}
              />

              {loading && <Loading />}
              <table className='table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Image</th>
                    <th>Show in Frontend</th>
                    <th>In Lineups</th>
                    <th>Played In Last Match</th>
                    <th>
                      <span className='d-inline-block align-middle'>Player Name</span>
                      <Button className='sort-btn' color='link' onClick={() => onSorting('sName')}><img alt='sorting' className='m-0 d-block' src={sortIcon} /></Button>
                    </th>
                    <th>Score Point</th>
                    <th>Season Point</th>
                    <th>Role</th>
                    <th>Credits</th>
                    <th>Team</th>
                    <th>Substitute</th>
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
                      <Fragment key={data._id}>
                        <tr key={data._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>{data.sImage ? <img alt='No Image' className='theme-image' src={url + data.sImage} /> : <img alt='No Image' className='l-cat-img' src={noImage}/>}</td>
                          <td className='success-text'>
                            <CustomInput
                              defaultChecked={data.eStatus === 'Y'}
                              disabled={adminPermission?.MATCHPLAYER === 'R'}
                              id={`switchSIF${i + 1}`}
                              name={`switchSIF${i + 1}`}
                              onClick={() => statusUpdateFrontend(data)}
                              type='switch'
                            />
                          </td>
                          <td className='success-text'>
                            <CustomInput
                              defaultChecked={data.bShow}
                              disabled={adminPermission?.MATCHPLAYER === 'R'}
                              id={`switch${i + 2}`}
                              name={`switch${i + 2}`}
                              onClick={() => statusUpdate(data)}
                              type='switch'
                            />
                          </td>
                          <td className='success-text'>
                            <CustomInput
                              defaultChecked={data.bPlayInLastMatch}
                              disabled={adminPermission?.MATCHPLAYER === 'R'}
                              id={`switchPILM${i + 3}`}
                              name={`switchPILM${i + 3}`}
                              onClick={() => updatePlayedInLastMatch(data)}
                              type='switch'
                            />
                          </td>
                          <td>{data.sName ? data.sName : '--'}</td>
                          <td><Button className='color-link' onClick={() => openModalFunc(data._id)}>{data.nScoredPoints ? data.nScoredPoints : ' 0 '}</Button></td>
                          <td className='editable-text'>
                            {isEditableField && fieldType === 'SeasonPoints' && data._id === selectedData._id
                              ? (
                                <FormGroup>
                                  <div className='d-flex justify-content-start'>
                                    <Input className='editable-text-field custominput' onChange={(e) => handleInputChange(e, 'SeasonPoints')} value={seasonPoints} />
                                    <img hidden={!seasonPoints} onClick={(e) => onStatusUpdate(e, 'roleAndCredits')} src={right} />
                                  </div>
                                </FormGroup>
                                )
                              : <div onClick={() => toggle(data, 'SeasonPoints')}>{data.nSeasonPoints}</div>}
                          </td>
                          <td className='editable-select'>
                            {isEditableField && fieldType === 'Role' && data._id === selectedData._id
                              ? (
                                <div className='d-flex justify-content-start custom-role'>
                                  <CustomInput
                                    id='Role'
                                    name='Role'
                                    onChange={(e) => handleInputChange(e, 'Role')}
                                    type='select'
                                    value={playerRole}
                                  >
                                    {playerRoleList && playerRoleList.length !== 0 && playerRoleList.map(player => {
                                      return (
                                        <option key={player.sName} value={player.sName}>{player.sFullName}</option>
                                      )
                                    })}
                                  </CustomInput>
                                  <img onClick={(e) => onStatusUpdate(e, 'roleAndCredits')} src={right} />
                                </div>
                                )
                              : (
                                <div onClick={() => toggle(data, 'Role')}>
                                  {data.eRole === 'ALLR'
                                    ? 'All Rounder'
                                    : data.eRole === 'BATS'
                                      ? 'Batsman'
                                      : data.eRole === 'BWL'
                                        ? 'Bowler'
                                        : data.eRole === 'WK'
                                          ? 'Wicket Keeper'
                                          : data.eRole === 'FWD'
                                            ? 'Forwards'
                                            : data.eRole === 'GK'
                                              ? 'Goal Keeper'
                                              : data.eRole === 'DEF'
                                                ? 'Defender'
                                                : data.eRole === 'RAID'
                                                  ? 'Raider'
                                                  : data.eRole === 'MID'
                                                    ? 'Mid fielders'
                                                    : data.eRole === 'PG'
                                                      ? 'Point-Gaurd'
                                                      : data.eRole === 'SG'
                                                        ? 'Shooting-Gaurd'
                                                        : data.eRole === 'SF'
                                                          ? 'Small-Forwards'
                                                          : data.eRole === 'PF'
                                                            ? 'Power-Forwards'
                                                            : data.eRole === 'C'
                                                              ? 'Centre'
                                                              : data.eRole === 'IF' ? 'Infielder' : data.eRole === 'OF' ? 'Outfielder' : data.eRole === 'P' ? 'Pitcher' : data.eRole === 'CT' ? 'Catcher' : '--'}
                                </div>
                                )}
                          </td>
                          <td className='editable-text'>
                            {isEditableField && fieldType === 'Credits' && data._id === selectedData._id
                              ? (
                                <FormGroup>
                                  <div className='d-flex justify-content-start'>
                                    <Input className='editable-text-field custominput' onChange={(e) => handleInputChange(e, 'Credits')} value={credits} />
                                    <img hidden={!credits} onClick={(e) => onStatusUpdate(e, 'roleAndCredits')} src={right} />
                                  </div>
                                </FormGroup>
                                )
                              : <div onClick={() => toggle(data, 'Credits')}>{data.nFantasyCredit}</div>}
                          </td>
                          <td>{data.sTeamName}</td>
                          <td>
                            <CustomInput
                              defaultChecked={data?.bSubstitute}
                              disabled={adminPermission?.MATCHPLAYER === 'R'}
                              id={`switchPILM${i + 4}`}
                              name={`switchPILM${i + 4}`}
                              onClick={() => updateSubstitutePlayer(data)}
                              type='switch'
                            />
                          </td>

                          <td>
                            <ul className='action-list mb-0 d-flex'>
                              <li>
                                <Link className='view' color='link' to={`${editLink}/${data._id}`}>
                                  <Button className='edit-btn-icon'>
                                    <img alt="View" src={editButton} />
                                  </Button>
                                </Link>
                              </li>
                              <li>
                                {
                                  ((Auth && Auth === 'SUPER') || (adminPermission?.MATCHPLAYER !== 'R')) && (
                                    <Button className='delete' color='link' onClick={() => warningWithDeleteMessage(data._id)}>
                                      <Button className='delete-btn-icon'>
                                        <img alt="Delete" src={deleteIcon} />
                                      </Button>
                                    </Button>
                                  )
                                }
                              </li>
                            </ul>
                          </td>
                        </tr>
                      </Fragment>
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

      {
    list?.length !== 0 && (
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

      <Modal className='score-point-modal' isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Score Point</ModalHeader>
        <ModalBody>
          <Row className="px-4">
            {
              aScorePoint && aScorePoint.length !== 0 && aScorePoint.map((data, i) => (
                <Col key={data.sName} lg={4} md={6}>
                  <FormGroup className='mt-3'>
                    <Label for="runScore">{data.sName}</Label>
                    <Input
                      disabled={adminPermission?.SCORE_POINT === 'R'}
                      id={data.sKey}
                      onChange={event => onChangeScorePoint(event, data._id)}
                      placeholder={`Enter ${data.sName}`}
                      type="text"
                      value={data.nScoredPoints}
                    />
                  </FormGroup>
                </Col>
              ))
            }
          </Row>
          <div className="footer-btn p-4">
            {
              ((Auth && Auth === 'SUPER') || (adminPermission?.SCORE_POINT !== 'R')) &&
              (
                <Button
                  className="theme-btn w-100"
                  onClick={onEdit}
                >
                  Save Changes
                </Button>
              )
            }
          </div>
        </ModalBody>
      </Modal>

      <Modal className='modal-confirm' isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to delete it?</h2>
          <Row className='row-12'>
            <Col>
              <Button
                className="theme-btn outline-btn-cancel full-btn-cancel"
                onClick={onCancel}
                type='submit'
              >
                Cancel

              </Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={onDelete} type='submit'>Delete It</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

MatchPlayerComponent.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  flag: PropTypes.bool,
  editLink: PropTypes.string,
  UpdateMatchPlayer: PropTypes.func,
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  playerRoleList: PropTypes.array,
  MatchDetails: PropTypes.object,
  setRole: PropTypes.func,
  setTeam: PropTypes.func,
  role: PropTypes.string,
  team: PropTypes.string,
  teams: PropTypes.object,
  setTeams: PropTypes.func,
  activePageNo: PropTypes.string,
  offset: PropTypes.string,
  setPageNo: PropTypes.func,
  setOffset: PropTypes.func,
  setOrder: PropTypes.func,
  setSearch: PropTypes.func,
  sort: PropTypes.string,
  order: PropTypes.string,
  setSort: PropTypes.func,
  searchValue: PropTypes.string,
  substitute: PropTypes.bool
}

MatchPlayerComponent.displayName = MatchPlayerComponent

export default connect(null, null, null, { forwardRef: true })(MatchPlayerComponent)
