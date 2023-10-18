import React, { Fragment, useEffect, useState, useRef, forwardRef } from 'react'
import { connect, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { CustomInput, Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import PropTypes from 'prop-types'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import updateSport from '../../../api/sport/updateSport'
import getSportsList from '../../../api/sport/getSportsList'

const Sports = forwardRef((props, ref) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [offset] = useQueryState('pageSize', 10)
  const [index] = useState(1)
  const [close, setClose] = useState(false)
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)

  // get sportList details
  const { data: sportsList, isLoading } = useQuery({
    queryKey: ['getSportList'],
    queryFn: () => getSportsList(),
    select: (res) => res?.data?.data
  })
  const { mutate: updateSportFun } = useMutation(updateSport, {
    onSuccess: (res) => {
      setMessage(res?.data?.message)
      setModalMessage(true)
      setStatus(true)
      queryClient.invalidateQueries('getSportList')
    }
  })
  const resStatus = useSelector(state => state?.sports?.resStatus)
  const resMessage = useSelector(state => state?.sports?.resMessage)
  const previousProps = useRef({ sportsList, resMessage, resStatus })?.current

  useEffect(() => {
    if (location?.state?.message) {
      setMessage(location?.state?.message)
      setStatus(true)
      setModalMessage(true)
    }

    navigate(location?.pathname, { replace: true })
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // useeffect to set sportsList
  useEffect(() => {
    if (sportsList) {
      setList(sportsList)
    }
  }, [sportsList])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function onCancel () {
    toggleWarning()
  }

  // for update status from list function
  function onStatusUpdate () {
    const status = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updateSportsData = {
      sportName: selectedData?.sName,
      key: selectedData?.sKey,
      position: selectedData?.nPosition,
      totalPlayers: selectedData?.oRule?.nTotalPlayers,
      maxPlayerOneTeam: selectedData?.oRule?.nMaxPlayerOneTeam,
      scoreInfoLink: selectedData?.sScoreInfoLink,
      scoreInfoTabName: selectedData?.sScoreInfoTabName,
      Active: status,
      token,
      id: selectedData?._id
    }
    updateSportFun(updateSportsData)
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
      !isLoading && list?.length === 0
        ? (
          <DataNotFound message="Sports" obj=""/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Sport</th>
                    <th>Key</th>
                    <th>Position</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {
                    list && list?.length !== 0 && list?.map((data, i) => (
                      <tr key={data?._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>
                          <CustomInput
                            checked={data?.eStatus === 'Y'}
                            disabled={adminPermission?.SPORT === 'R'}
                            id={'id' + data?._id}
                            name={'name' + data?._id}
                            onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                            type='switch'
                          />
                        </td>
                        <td>{data?.sName || '--'}</td>
                        <td>{data?.sKey || '--'}</td>
                        <td>{data?.nPosition || '--'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink className="view" color="link" to={'/settings/sport-details/' + data?._id}>
                                <Button className='edit-btn-icon'>
                                  <img alt="View" src={editButton} />
                                </Button>
                              </NavLink>
                            </li>
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

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={onCancel} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={onStatusUpdate} type='submit'>{`${type} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

Sports.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object
}

Sports.displayName = Sports
export default connect(null, null, null, { forwardRef: true })(Sports)
