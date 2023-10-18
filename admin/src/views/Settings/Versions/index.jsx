import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, CustomInput, Form, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useQueryState } from 'react-router-use-location-state'

import Loading from '../../../components/Loading'
import Layout from '../../../components/Layout'
import Heading from '../component/Heading'
import Version from './Version'
import MainHeading from '../component/MainHeading'
import AlertMessage from '../../../components/AlertMessage'
import { modalMessageFunc } from '../../../helpers/helper'
import autoKillBots from '../../../api/version/autoKillBots'
import getAutoKillDetails from '../../../api/version/getAutoKillDetails'
import getVersionList from '../../../api/version/getVersionList'
import getMaintenanceMode from '../../../api/version/getMaintenanceMode'
import { updateMaintenanceMode } from '../../../actions/version'

function Versions (props) {
  const token = useSelector((state) => state.auth.token)
  const mResMessage = useSelector(state => state.version.mResMessage)
  const mResStatus = useSelector(state => state.version.mResStatus)
  const dispatch = useDispatch()
  const content = useRef()
  const [value, setValue] = useState('N')
  const [maintenanceMsg, setMaintenanceMsg] = useState('')
  const [msgErr, setMsgErr] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loader, setLoader] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [shutDown, setShutDown] = useState(true)
  const [close, setClose] = useState(false)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)

  const [responseMessage, setResponseMessage] = useState('')
  const toggleMessage = () => setModalOpen(!modalOpen)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)

  // autoKill bot flag query
  const { data: killBotsDetails } = useQuery({
    queryKey: ['getAutoKillDetails'],
    queryFn: () => getAutoKillDetails(token),
    select: (res) => res?.data?.data
  })

  // get Version List Query
  const { data: versionList, isLoading } = useQuery({
    queryKey: ['getVersionList', start, offset],
    queryFn: () => getVersionList(start, offset),
    select: (res) => res?.data?.data[0]
  })
  // maintenanceMode get Data on useQuery
  const { data: maintenanceMode, refetch } = useQuery({
    queryKey: ['getMaintenanceData'],
    queryFn: () => getMaintenanceMode(),
    select: (res) => res?.data?.data,
    enabled: false
  })
  // autoKillBots on/off mutation query
  const { mutate: autoKillBotsFun } = useMutation(autoKillBots, {
    onSuccess: (res) => {
      setMessage(res?.data?.message)
      setClose(true)
      setModalMessage(true)
      setStatus(true)
    }
  })

  const adminPermission = useSelector(state => state.auth.adminPermission)
  const resMessage = useSelector(state => state?.systemusers?.resMessage)
  const resStatus = useSelector(state => state?.systemusers?.resStatus)
  const previousProps = useRef({ mResMessage, mResStatus, resMessage }).current
  useEffect(() => {
    if (maintenanceMode) {
      setValue(maintenanceMode?.bIsMaintenanceMode ? 'Y' : 'N')
      setMaintenanceMsg(maintenanceMode?.sMessage)
      setModalOpen(true)
    }
  }, [maintenanceMode])

  useEffect(() => {
    if (previousProps.mResMessage !== mResMessage) {
      setLoader(false)
      setMessage(mResMessage)
      setModalMessage(true)
      setStatus(mResStatus)
    }
    return () => {
      previousProps.mResMessage = mResMessage
      previousProps.mResStatus = mResStatus
    }
  }, [mResMessage, mResStatus])

  useEffect(() => {
    if (resMessage) {
      setResponseMessage(resMessage)
      setLoader(false)
      setMessage(mResMessage)
      setModalMessage(true)
      setStatus(mResStatus)
    }
    return () => {
      previousProps.mResMessage = mResMessage
      previousProps.mResStatus = mResStatus
    }
  }, [mResMessage, mResStatus, resMessage])

  function onExport () {
    content.current.onExport()
  }

  function updateMaintenanceModeFunc (e) {
    e.preventDefault()
    if (!maintenanceMsg) {
      setMsgErr('Required field')
    } else {
      dispatch(updateMaintenanceMode(value === 'Y', maintenanceMsg, token))
      setModalOpen(false)
      setLoader(true)
    }
  }
  function handleOnChange (e, type) {
    switch (type) {
      case 'value':
        setValue(e.target.value)
        break
      case 'maintenanceMsg':
        setMaintenanceMsg(e.target.value)
        break
      default:
        break
    }
  }

  function getMaintenanceModeFunc () {
    refetch()
  }
  function autoKillBotsFunction () {
    autoKillBotsFun(!killBotsDetails?.bShutdown)
    setShutDown(!shutDown)
    setModalOpen(false)
    setModalMessage(true)
  }

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  return (
    <Fragment>
      {loader && <Loading />}
      <Layout {...props} >
        <main className='main-content'>
          <section className='management-section common-box'>
            <MainHeading
              export="Export"
              getMaintenanceModeFunc={getMaintenanceModeFunc}
              heading='Versions'
              info
              list={versionList}
              maintenance="Maintenance"
              maintenancePermission={(Auth && Auth === 'SUPER') || (adminPermission?.MAINTENANCE !== 'N')}
              onExport={onExport}
              permission={
                (Auth && Auth === 'SUPER') ||
                (adminPermission?.VERSION !== 'R')
              }
            />
            <AlertMessage
              close={close}
              message={responseMessage}
              modalMessage={modalMessage}
              status={resStatus}
            />
            <div className={versionList?.total === 0 ? ' without-pagination' : 'setting-component'}>
              <Heading
                buttonText='Add Version'
                maintenancePermission={(Auth && Auth === 'SUPER') || (adminPermission?.MAINTENANCE !== 'N')}
                permission={(Auth && Auth === 'SUPER') || (adminPermission?.VERSION !== 'R')}
                setUrl='/settings/add-version'
              />
              <Version
                {...props}
                ref={content}
                editVersionLink="/settings/version-details"
                message={message}
                modalMessage={modalMessage}
                setMessage={setMessage}
                setModalMessage={setModalMessage}
                setStatus={setStatus}
                status={status}
                token={token}
                versionList={versionList}
                start={start}
                setStart={setStart}
                offset={offset}
                setOffset={setOffset}
                isLoading ={isLoading }
              />
            </div>
          </section>
        </main>
      </Layout>

      <Modal className="modal-confirm-maintenance" isOpen={modalOpen} toggle={toggleMessage}>
        <ModalHeader className='modal-header-maintenance' toggle={toggleMessage}>Maintenance Mode</ModalHeader>
        <ModalBody >
          <Form>
            <Row>
              <div className='modal-switch p-4'>
                <Col className='modal-col' md='12'>
                  <p>Maintenance Mode</p>
                  <CustomInput
                    checked={value === 'Y'}
                    disabled={adminPermission?.MAINTENANCE === 'R'}
                    id='value1'
                    name='value1'
                    onClick={(event) => handleOnChange(event, 'value')}
                    type='switch'
                    value= {value === 'N' ? 'Y' : 'N'}
                  />
                </Col>
              </div>
              <Col className='modal-message' md='12'>
                <Label for="maintenanceMsg">Message</Label>
                <Input disabled={adminPermission?.MAINTENANCE === 'R'} onChange={event => handleOnChange(event, 'maintenanceMsg')} type='textarea' value={maintenanceMsg} />
                <p className='error-text'>{msgErr}</p>
              </Col>
            </Row>

            {((Auth && Auth === 'SUPER') || (adminPermission?.MAINTENANCE === 'W')) && (
              <Row className='buttons'>
                <Col className='p-4' md='12'>
                  <Button className="theme-btn danger-btn w-100 m-0" disabled={!maintenanceMsg} onClick={updateMaintenanceModeFunc} type="submit">Save Changes</Button>
                </Col>
              </Row>
            )}
            {((Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'W')) && (
              <Row className='buttons'>
                <Col className='px-4 pb-4' md='12'>
                  <Button className="theme-btn-cancel auto-kill w-100 m-0" onClick={() => autoKillBotsFunction()} >
                    {' '}
                    {killBotsDetails?.bShutdown ? 'Reset Auto Kill Bots' : 'Auto Kill Bots'}
                    {' '}
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default Versions
