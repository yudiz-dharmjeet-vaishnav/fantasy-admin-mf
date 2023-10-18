import React, { Fragment, useState, useEffect, useRef } from 'react'
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import SystemUser from './SystemUser'
import Layout from '../../../components/Layout'
import UserListHeader from '../../Users/Component/UsersListHeader'
import UsersListMainHeader from '../Component/UsersListMainHeader'
import AlertMessage from '../../../components/AlertMessage'
import RequiredField from '../../../components/RequiredField'

import { isPositive } from '../../../helpers/helper'
import { addSystemUsers, getSystemUserList, getSystemUsersTotalCount } from '../../../actions/systemusers'
function SystemUsers (props) {
  const location = useLocation()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')
  const [initialFlag, setinitialFlag] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [startDate, endDate] = dateRange
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const [resModalMessage, setResModalMessage] = useState(false)
  const [systemUser, setSystemUser] = useState(0)
  const [systemUserErr, setSystemUserErr] = useState(' ')
  const toggleMessage = () => {
    setSystemUser('')
    setModalMessage(!modalMessage)
  }
  const resStatus = useSelector(state => state.systemusers.resStatus)
  const resMessage = useSelector(state => state.systemusers.resMessage)
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const permission = (Auth && Auth === 'SUPER') || (adminPermission?.SYSTEM_USERS === 'W')
  const systemUserList = useSelector(state => state.systemusers.systemUserList)
  const systemUsersTotalCount = useSelector(state => state.systemusers.systemUsersTotalCount)
  const content = useRef()
  const previousProps = useRef({ resMessage, resStatus }).current

  // useEffect to set Query Params Value
  useEffect(() => {
    const obj = qs.parse(location.search)
    if (obj.searchvalue) {
      setSearch(obj.searchvalue)
    }
    if (obj.datefrom && obj.dateto) {
      setDateRange([new Date(obj.datefrom), new Date(obj.dateto)])
    }
    if (obj.filterBy) {
      setFilter(obj.filterBy)
    }
  }, [])

  // handle to set resMessage
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          setResModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // handle to set resMessageModalMessage
  useEffect(() => {
    if (resModalMessage) {
      setTimeout(() => {
        setResModalMessage(false)
        setClose(false)
      }, 3000)
      setTimeout(() => {
        setClose(true)
      }, 2500)
    }
  }, [resModalMessage])

  function handleOtherFilter (e) {
    setFilter(e.target.value)
  }

  function onHandleSearch (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
    setSearch(e.target.value)
    setinitialFlag(true)
  }

  // handle set to SystemUser
  function handleAddSystemUser (e, type) {
    if (type === 'systemUser') {
      if (e.target.value && !isPositive(e.target.value)) {
        setSystemUserErr('Value must be positive')
      } else {
        setSystemUserErr('')
      }
      setSystemUser(e.target.value)
    } else {
      if (e.key === 'Enter') {
        e.preventDefault()
      }
      setinitialFlag(true)
    }
  }

  function getSystemUsersTotalCountFunc (searchvalue, filterBy, startDate, endDate) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      searchvalue, filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', token
    }
    // dispatch action to get SystemUserTotalCount
    dispatch(getSystemUsersTotalCount(usersData))
  }

  function getList (start, limit, sort, order, searchvalue, filterBy, startDate, endDate, isFullResponse) {
    const dateFrom = startDate ? new Date(moment(startDate).startOf('day').format()) : ''
    const dateTo = endDate ? new Date(moment(endDate).endOf('day').format()) : ''
    const usersData = {
      start, limit, sort, order, searchvalue: searchvalue.trim(), filterBy, startDate: dateFrom ? new Date(dateFrom).toISOString() : '', endDate: dateTo ? new Date(dateTo).toISOString() : '', isFullResponse, token
    }
    // dispatch action to get SystemUserList
    dispatch(getSystemUserList(usersData))
  }

  function onExport () {
    content.current.onExport()
  }

  function addSystemUsersFunc (e) {
    e.preventDefault()
    if (!systemUserErr) {
      dispatch(addSystemUsers(systemUser, token))
      toggleMessage()
    }
  }

  function onRefreshFun () {
    content.current.onRefresh()
  }

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={resModalMessage}
        status={status}
      />
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <UsersListMainHeader
              enExport={onExport}
              heading="System Users"
              list={systemUserList}
              onExport={onExport}
              onRefresh={onRefreshFun}
              permission={permission}
              refresh="Refresh System Users"
              systemUsers
              users

            />
            <div className={systemUserList?.results?.length === 0 ? 'without-pagination' : 'setting-component'}>

              <UserListHeader
                buttonText='Add system user'
                dateRange={dateRange}
                endDate={endDate}
                filter={filter}
                handleOtherFilter={handleOtherFilter}
                handleSearch={onHandleSearch}
                list={systemUserList}
                permission={permission}
                search={search}
                setDateRange={setDateRange}
                setModalMessage={setModalMessage}
                startDate={startDate}
                systemUsers
                totalCount={systemUsersTotalCount}
                users
              />
              <SystemUser
                {...props}
                ref={content}
                List={systemUserList}
                endDate={endDate}
                filter={filter}
                flag={initialFlag}
                getList={getList}
                getSystemUsersTotalCountFunc={getSystemUsersTotalCountFunc}
                resMessage={resMessage}
                resStatus={resStatus}
                search={search}
                startDate={startDate}
                systemUsersTotalCount={systemUsersTotalCount}
                viewLink="/users/system-user/system-user-details"
              />
            </div>
          </section>
        </main>
      </Layout>
      <Modal className="modal-confirm-bot" isOpen={modalMessage} toggle={toggleMessage}>
        <ModalHeader className='popup-modal-header modal-title-head' toggle={toggleMessage}>Add System Users</ModalHeader>
        <ModalBody className="text-center">
          <Form>
            <Row className='mt-4'>
              <Col className='copy-select' md={12} xl={12}>
                <FormGroup className='select-label'>
                  <Label for="systemUser">
                    Enter System Users
                    {' '}
                    <RequiredField/>
                  </Label>
                  <Input id="systemUser" name="systemUser" onChange={event => handleAddSystemUser(event, 'systemUser')} placeholder="Add Teams" type="number" value={systemUser} />
                  <p className='error-text'>{systemUserErr}</p>
                </FormGroup>
              </Col>
            </Row>

            <Row className='buttons'>
              <Col className='p-0' md={12} xl={12}>
                <Button className="theme-btn success-btn full-btn" disabled={!systemUser} onClick={(e) => addSystemUsersFunc(e)} type="submit">Add</Button>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

SystemUsers.propTypes = {
  location: PropTypes.object
}

export default SystemUsers
