import React, { useState, useEffect, Fragment, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, ModalBody, Row, Col } from 'reactstrap'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import SkeletonTable from '../../../components/SkeletonTable'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import { deleteSeriesCategory } from '../../../actions/seriesLeaderBoard'

function SeriesLeaderBoardCategory (props) {
  const { list, getList, updateSeriesCategory, prizeBreakupUrl, leaderBoardUrl, prizeCalculateFlag, winPrizeCalculateFlag, leagueCountFunc } = props
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const dispatch = useDispatch()
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const [deleteId, setDeleteId] = useState('')
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const previousProps = useRef({ list, resMessage, resStatus }).current

  useEffect(() => {
    if (!prizeCalculateFlag && !winPrizeCalculateFlag) {
      getList()
      leagueCountFunc()
    }
  }, [prizeCalculateFlag, winPrizeCalculateFlag])

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.list !== list) {
      if (list) {
        setLoading(false)
      }
    }
    return () => {
      previousProps.list = list
    }
  }, [list])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (!prizeCalculateFlag && !winPrizeCalculateFlag) {
            getList()
          }
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
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
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        SeriesLeaderBoard: location.search
      }
      : data.SeriesLeaderBoardCategory = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  // to open a modal to ask for delete operation
  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  // dispatch action to delete the series category
  function onDelete () {
    if (deleteId && token && id) {
      dispatch(deleteSeriesCategory(id, deleteId, token))
    }
  }

  function onCancel () {
    toggleWarning()
  }

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Series LeaderBoard Category" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="match-league-table">
                <thead>
                  <tr>
                    <th> No. </th>
                    <th> Name </th>
                    <th> Max Rank </th>
                    <th> First Prize </th>
                    <th> Total Payout</th>
                    <th> Actions  </th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {!list && <SkeletonTable numberOfColumns={6} />}
                        {
                    list && list.length !== 0 && list.map((data, index) => (
                      <tr key={data._id} className={data.bCancelled ? 'cancelled-raw' : data.bWinningDone ? 'playReturn-raw' : ''}>
                        <td>{index + 1}</td>
                        <td>
                          {data.sName}
                        </td>
                        <td>
                          {data.nMaxRank}
                        </td>
                        <td>
                          {data.sFirstPrize}
                        </td>
                        <td>
                          {data.nTotalPayout}
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <Button className='view-btn-icon-point' color="link" tag={Link} to={`${updateSeriesCategory}/${data._id}`}>
                                <img alt="View" src={editButton} />
                                <span> Edit </span>
                              </Button>
                            </li>
                            <li>
                              <Button className='view-btn-icon-prizebreakup' color="link" tag={Link} to={`${prizeBreakupUrl}/${data._id}`}>
                                <span>Prize Breakup </span>
                              </Button>
                            </li>
                            <li>
                              <Button className='view-btn-icon-leaderBoard' color="link" tag={Link} to={`${leaderBoardUrl}/${data._id}`}>
                                <span>  Leader Board </span>
                              </Button>
                            </li>
                            {((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD !== 'R')) &&
                              (
                              <li>
                                <Button className="delete-btn-icon" color="link" onClick={() => warningWithDeleteMessage(data._id)}>
                                  <img alt="Delete" src={deleteIcon} />
                                  <span> Delete </span>
                                </Button>
                              </li>
                              )}
                          </ul>
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
      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className="text-center">
          <img alt="check" className="info-icon" src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to Delete it?</h2>
          <Row className="row-12">
            <Col>
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={onCancel} type="submit">Cancel</Button>
            </Col>
            <Col>
              <Button className="theme-btn danger-btn full-btn" onClick={onDelete} type="submit"> Delete It</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

SeriesLeaderBoardCategory.propTypes = {
  list: PropTypes.array,
  getList: PropTypes.func,
  leagueCountFunc: PropTypes.func,
  updateSeriesCategory: PropTypes.string,
  prizeBreakupUrl: PropTypes.string,
  leaderBoardUrl: PropTypes.string,
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object,
  prizeCalculateFlag: PropTypes.bool,
  winPrizeCalculateFlag: PropTypes.bool
}

export default SeriesLeaderBoardCategory
