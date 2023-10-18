import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { useQueryState } from 'react-router-use-location-state'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Modal, ModalBody, Row } from 'reactstrap'
import PropTypes from 'prop-types'

import editButton from '../../../../assets/images/edit-pen-icon.svg'
import deleteButton from '../../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../../assets/images/error-warning.svg'
import noImage from '../../../../assets/images/avatar.svg'

import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'
import { deleteBaseTeam } from '../../../../actions/matchplayer'
import AlertMessage from '../../../../components/AlertMessage'
import { defaultPlayerRoleImages, modalMessageFunc } from '../../../../helpers/helper'

const BaseTeamsList = forwardRef((props, ref) => {
  const { baseTeamsList, getList, updateBaseTeam } = props
  const { matchid, sportstype } = useParams()

  const [index, setIndex] = useState(1)
  const [start, setStart] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState('')
  const [url, setUrl] = useState('')

  // const [selectedData, setSelectedData] = useState({})
  const [deleteId, setDeleteId] = useState('')
  const [modalWarning, setModalWarning] = useState(false)

  const toggleWarning = () => setModalWarning(!modalWarning)
  const dispatch = useDispatch()
  const token = useSelector((state) => state?.auth?.token)
  const resStatus = useSelector(state => state?.match?.resStatus)
  const resMessage = useSelector(state => state?.match?.resMessage)
  const resDelMessage = useSelector(state => state?.matchplayer?.resMessage)
  const resDelStatus = useSelector(state => state?.matchplayer?.resStatus)
  const getUrlLink = useSelector(state => state.url.getUrl)

  const paginationFlag = useRef(false)
  const previousProps = useRef({ baseTeamsList, resMessage, resStatus, paginationFlag, start, offset, resDelStatus, resDelMessage })?.current

  useEffect(() => {
    if (matchid) {
      getList(0, 10)
    }
    setLoading(true)
  }, [])

  useEffect(() => {
    if (previousProps?.baseTeamsList !== baseTeamsList) {
      if (baseTeamsList?.aResult) {
        const userArrLength = baseTeamsList?.aResult?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
      }
      setList(baseTeamsList?.aResult || [])
      setIndex(activePageNo)
      setTotal(baseTeamsList?.nTotal || 0)
      setLoading(false)
    }
    return () => {
      previousProps.baseTeamsList = baseTeamsList
    }
  }, [baseTeamsList])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setLoading(false)
        setMessage(resMessage)
        setModalMessage(true)
        setModalWarning(false)
        setStatus(resStatus)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps?.resDelMessage !== resDelMessage) {
      if (resDelMessage) {
        setLoading(false)
        setMessage(resDelMessage)
        setModalMessage(true)
        setModalWarning(false)
        setStatus(resDelStatus)
        getList(start, offset)
      }
    }
    return () => {
      previousProps.resDelMessage = resDelMessage
    }
  }, [resDelStatus, resDelMessage])

  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  function onRefresh () {
    if (matchid) {
      getList(start, offset)
      setLoading(true)
    }
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    // deleteBaseTeam
    dispatch(deleteBaseTeam(deleteId, token))
    // setLoading(true)
    setModalWarning(false)
  }

  return (
    <Fragment>
      {
      !loading && list?.length === 0
        ? (
          <>
            <div className='super-not-found'>
              <DataNotFound message="Match" obj={matchid}/>
            </div>
          </>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <AlertMessage
                close={close}
                message={message}
                modalMessage = {modalMessage}
                status={status}
              />
              <table className="table without-border-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Team Name </th>
                    <th> Players </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={14} />
                    : (
                      <Fragment>
                        {
                      list && list?.length !== 0 && list.map((data, i) => (
                        <tr key={data?._id} >
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td >{data?.sName || '--'}</td>
                          <td className='d-flex flex-columns flex-wrap'>
                            {data?.aPlayers?.map(player => (
                              <>
                                <div className='player-td m-2'>
                                  <div className='player-img'>
                                    <div className='player-details-div'>
                                      <img src={player && player.sImage ? getUrlLink + player?.sImage : defaultPlayerRoleImages(sportstype, player?.oMatchPlayer?.eRole)} />
                                    </div>
                                    <span className='ml-3'>
                                      <h4>{player?.oMatchPlayer?.sName}</h4>
                                      <h5 className='d-flex'>
                                        {player?.oTeams?.sImage
                                          ? <img src={url + player?.oTeams?.sImage} className='team-img'/>
                                          : <img src={noImage} className='team-img' />
                                        }
                                        <h5 className='role'>{player?.oMatchPlayer?.eRole}</h5>
                                      </h5>
                                    </span>
                                  </div>
                                  {/* <b className='blue ml-1'>
                                    {player?.iMatchPlayerId === data?.iCaptainId ? '(C)' : player?.iMatchPlayerId === data?.iViceCaptainId ? '(VC)' : ''}
                                  </b> */}
                                  <Row className='d-flex credits mt-2'>
                                    <p>
                                      Credits:
                                      {' '}
                                      <b className='blue ml-1'>{player?.oMatchPlayer?.nFantasyCredit || '--'}</b>
                                    </p>
                                  </Row>
                                </div>
                              </>
                            )
                            )}
                          </td>
                          <td>
                            <ul className='action-list mb-0 d-flex'>
                              <li className='action-btn'>
                                <Button className='edit-btn-icon' color="link" tag={Link} to={`${updateBaseTeam}/${data._id}`}>
                                  <span><img alt="View" src={editButton} /></span>
                                </Button>
                              </li>
                              <li>
                                <Button className='delete-btn-icon' color="link" onClick={() => warningWithDeleteMessage(data._id, 'delete')}>
                                  {/* <Button className='delete-btn-icon' color="link" onClick={() => warningWithDeleteMessage()}> */}
                                  <span><img alt="Delete" src={deleteButton} /></span>
                                </Button>
                              </li>
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

      { list?.length !== 0 && (
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
                // onClick={deleteId ? onDelete : onStatusUpdate}
                onClick={onDelete}
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

BaseTeamsList.propTypes = {
  baseTeamsList: PropTypes.object,
  getList: PropTypes.func,
  match: PropTypes.object,
  location: PropTypes.object,
  updateBaseTeam: PropTypes.string
}

BaseTeamsList.displayName = BaseTeamsList

export default BaseTeamsList
