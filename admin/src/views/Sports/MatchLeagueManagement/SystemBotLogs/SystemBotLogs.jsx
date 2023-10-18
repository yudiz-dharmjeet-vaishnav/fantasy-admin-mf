import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { useSelector } from 'react-redux'
import moment from 'moment'
import PropTypes from 'prop-types'

import viewIcon from '../../../../assets/images/view-eye.svg'

import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'

import { modalMessageFunc } from '../../../../helpers/helper'

const SystemBotLogs = forwardRef((props, ref) => {
  const { systemBotDetails, loading, setLoading, getBotLogs, isCopyBotLogs, isModalOpen, setModalOpen } = props
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [errorList, setErrorList] = useState({})
  const [combinationLogsDetails, setCombinationLogsDetails] = useState({})
  const resStatus = useSelector(state => state.matchleague.resStatus)
  const resMessage = useSelector(state => state.matchleague.resMessage)
  const combinationLogs = useSelector(state => state.systemusers.combinationBotLogs)
  const previousProps = useRef({ systemBotDetails, resStatus, resMessage }).current
  const paginationFlag = useRef(false)
  const toggleModal = () => setModalOpen(!isModalOpen)
  useEffect(() => {
    if (previousProps.systemBotDetails !== systemBotDetails) {
      if (systemBotDetails) {
        if (systemBotDetails.aData) {
          const userArrLength = systemBotDetails.aData.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setIndex(activePageNo)
        setList(systemBotDetails.aData || [])
        setTotal(systemBotDetails.nTotal || 0)
        setLoading(false)
      }
    }
    return () => {
      previousProps.systemBotDetails = systemBotDetails
    }
  }, [systemBotDetails])

  useEffect(() => {
    if (previousProps.combinationLogs !== combinationLogs) {
      const error = combinationLogs?.data?.aError?.map((item) => {
        return {
          ...item,
          dDate: moment(item.dDate).format('DD/MM/YYYY hh:mm A')
        }
      })
      const success = combinationLogs?.data?.aSuccess?.map((item) => {
        return {
          ...item,
          dDate: moment(item.dDate).format('DD/MM/YYYY hh:mm A')
        }
      })
      const mainCombinationLogsDetails = {
        aError: error,
        aSuccess: success
      }
      setCombinationLogsDetails(mainCombinationLogsDetails)
    }

    return () => {
      previousProps.combinationLogs = combinationLogs
    }
  }, [combinationLogs])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
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
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getBotLogs(start, offset)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function onRefresh () {
    // const startFrom = 0
    getBotLogs(start, offset)
    setPageNo(activePageNo)
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onRefresh
  }))

  function onCancel () {
    toggleErrorModal()
  }

  function openErrorModal (errorList) {
    const eList = {}
    const errNoRes = 'No response'

    errorList?.forEach(element => {
      if (typeof element === 'string') {
        if (element.charAt(0) === '<') {
          const div = document.createElement('div')
          div.innerHTML = element
          const innerTextOfDiv = div.children ? div.children[0].innerText : div.innerText
          eList[innerTextOfDiv] = (eList[innerTextOfDiv] || 0) + 1
        } else {
          eList[element] = (eList[element] || 0) + 1
        }
      } else if (typeof element === 'object') {
        if (element.message) {
          eList[element.message] = (eList[element.message] || 0) + 1
        }
        if (element.name) {
          eList[element.name] = (eList[element.name] || 0) + 1
        }
        if (Object.keys(element).length === 0) {
          eList[errNoRes] = (eList[errNoRes] || 0) + 1
        }
      }
    })

    setErrorModal(true)
    setErrorList(eList)
  }

  function toggleErrorModal () {
    setErrorModal(!errorModal)
  }

  return (
    <Fragment>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="Logs" obj=""/>
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

              {isCopyBotLogs && (
              <div className='total-text mb-3'>
                Note: Added by Real Users
              </div>
              )}
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    {!isCopyBotLogs &&
                    <th>Add By</th>
              }
                    <th>Added Teams</th>
                    <th>Bot Type</th>
                    <th>Success</th>
                    <th>Errors</th>
                    <th>Copy Bot Replaced Count</th>
                    <th>Edited</th>
                    {!isCopyBotLogs && (
                    <>
                      <th>Instant Added?</th>
                      <th>Base Team Count</th>
                      <th>Added Time</th>
                    </>
                    )}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={isCopyBotLogs ? 6 : 12} />
                    : (
                      <Fragment>
                        {list && list.length !== 0 && list.map((data, i) => {
                          return (
                            <tr key={data._id}>
                              <td>{(index - 1) * offset + (i + 1)}</td>
                              {!isCopyBotLogs &&
                              <td>{data?.oAdmin?.sUsername || '--'}</td>
                      }
                              <td>{data.nTeams || 0}</td>
                              <td>
                                {data.eType
                                  ? data.eType === 'B'
                                    ? 'Bot'
                                    : data.eType === 'CB'
                                      ? 'Copy Bot'
                                      : data.eType === 'CMB'
                                        ? 'Combination Bot'
                                        : '--'
                                  : '--'}
                              </td>
                              <td>{data.nSuccess || 0}</td>
                              <td>{data.nErrors || 0}</td>
                              <td>{data?.nReplaces || 0}</td>
                              <td>{data?.bEdit ? 'Yes' : 'No'}</td>
                              {!isCopyBotLogs && (
                              <>
                                <td>{data.bInstantAdd ? 'Yes' : 'No'}</td>
                                <td>{(data?.aBaseTeams?.length > 0 && data?.aBaseTeams?.length) || '-'}</td>
                                <td>
                                  {moment(data.dCreatedAt).format('DD/MM/YYYY hh:mm A')}
                                </td>
                              </>
                              )}
                              <td>
                                <ul className="action-list mb-0 d-flex">
                                  <li>
                                    <Button
                                      color="link"
                                      disabled={data.aError.length === 0}
                                      onClick={() => openErrorModal(data.aError)}
                                    >
                                      <img
                                        alt="View"
                                        className={
                                  data.aError.length === 0
                                    ? 'disabled-view-btn-img'
                                    : ''
                                }
                                        src={viewIcon}
                                      />
                                      View
                                    </Button>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          )
                        })
              }
                      </Fragment>
                      )
            }
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

      <Modal className='combination-bot-logs' isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Combination Bot Logs</ModalHeader>
        <ModalBody>
          {combinationLogsDetails?.aError?.length > 0 && (
          <>
            <h3 className='text-center mt-3'>Error Logs</h3>
            <div className='table-represent'>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th rowSpan={2}>No</th>
                      <th rowSpan={2}>Date</th>
                      <th rowSpan={2}>Message</th>
                      <th className='text-center border-right-transparent' colSpan={4}>Players</th>
                      <th className='text-center' colSpan={2}>Teams</th>
                    </tr>
                    <tr>
                      <th className='text-center'>Total</th>
                      <th className='text-center'>Selected</th>
                      <th className='text-center'>Neglected</th>
                      <th className='text-center border-right-transparent'>Captains</th>
                      <th className='text-center'>Edited</th>
                      <th className='text-center'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinationLogsDetails?.aError?.length > 0 && combinationLogsDetails?.aError?.map((log, i) => (
                      <tr key={log._id}>
                        <td>{i + 1}</td>
                        <td>{log.dDate || '--'}</td>
                        <td>{log.sMessage || '--'}</td>
                        <td className='text-center'>{log.aPlayers.length || 0}</td>
                        <td className='text-center'>{log.aPlayers.filter((item) => item.selected).length || 0}</td>
                        <td className='text-center'>{log.aPlayers.filter((item) => !item.selected).length || 0}</td>
                        <td className='text-center'>{log.aPlayers.filter((item) => item.isCaptain).length || 0}</td>
                        <td className='text-center'>{log.nTotalTeamEdited || 0}</td>
                        <td className='text-center'>{log.nTotalTeam || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
          )}

          {combinationLogsDetails?.aSuccess?.length > 0 && (
          <>
            <h3 className='text-center mt-4'>Success Logs</h3>
            <div className='table-represent'>
              <div className='table-responsive'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th rowSpan={2}>No</th>
                      <th rowSpan={2}>Date</th>
                      <th rowSpan={2}>Message</th>
                      <th className='text-center border-right-transparent' colSpan={4}>Players</th>
                      <th className='text-center' colSpan={2}>Teams</th>
                    </tr>
                    <tr>
                      <th className='text-center'>Total</th>
                      <th className='text-center'>Selected</th>
                      <th className='text-center'>Neglected</th>
                      <th className='text-center border-right-transparent'>Captains</th>
                      <th className='text-center'>Edited</th>
                      <th className='text-center'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinationLogsDetails?.aSuccess?.length > 0 && combinationLogsDetails?.aSuccess?.map((log, i) => (
                      <tr key={log._id}>
                        <td>{i + 1}</td>
                        <td>{log.dDate || '--'}</td>
                        <td>{log.sMessage || '--'}</td>
                        <td className='text-center'>{log.aPlayers.length || 0}</td>
                        <td className='text-center'>{log.aPlayers.filter((item) => item.selected).length || 0}</td>
                        <td className='text-center'>{log.aPlayers.filter((item) => !item.selected).length || 0}</td>
                        <td className='text-center'>{log.aPlayers.filter((item) => item.isCaptain).length || 0}</td>
                        <td className='text-center'>{log.nTotalTeamEdited || 0}</td>
                        <td className='text-center'>{log.nTotalTeam || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
          )}

          {combinationLogsDetails?.aError?.length === 0 && combinationLogsDetails?.aSuccess?.length === 0 && (
          <>
            <DataNotFound message="Logs" notFoundClass="combination-bot-log" obj=""/>
          </>
          )}
        </ModalBody>
      </Modal>
      <Modal className='modal-system-log' isOpen={errorModal} toggle={toggleErrorModal}>
        <ModalHeader toggle={toggleErrorModal}>
          System Bot Log Errors
          <Button className='close' onClick={onCancel} />
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col>
              <div className='table-represent'>
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Error</th>
                      <th>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                  Object.keys(errorList).map(function (key) {
                    return (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{errorList[key]}</td>
                      </tr>
                    )
                  })
                }
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

SystemBotLogs.propTypes = {
  systemBotDetails: PropTypes.object,
  loading: PropTypes.bool,
  setLoading: PropTypes.func,
  getBotLogs: PropTypes.func,
  isCopyBotLogs: PropTypes.bool,
  isModalOpen: PropTypes.bool,
  setModalOpen: PropTypes.func
}

SystemBotLogs.displayName = SystemBotLogs

export default SystemBotLogs
