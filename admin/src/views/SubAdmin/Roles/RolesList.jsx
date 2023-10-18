import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Button, Col, CustomInput, Modal, ModalBody, Row } from 'reactstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'

import editIcon from '../../../assets/images/edit-pen-icon.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'

import { modalMessageFunc } from '../../../helpers/helper'
import { deleteRole, updateRole } from '../../../actions/role'

const RolesList = forwardRef((props, ref) => {
  const { rolesList, getList, editRoleLink } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const dispatch = useDispatch()
  const searchProp = props.search
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [index, setIndex] = useState(1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [search, setSearch] = useQueryState('search', '')
  const [listLength, setListLength] = useState('10 Rows')
  const [deleteId, setDeleteId] = useState('')
  const toggleWarning = () => setModalWarning(!modalWarning)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector((state) => state?.role?.resStatus)
  const resMessage = useSelector((state) => state?.role?.resMessage)
  const obj = qs.parse(location?.search)
  const paginationFlag = useRef(false)
  const previousProps = useRef({
    rolesList,
    resStatus,
    resMessage,
    start,
    offset
  }).current

  const [close, setClose] = useState(false)

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
    if (obj) {
      if (obj?.page) {
        page = obj?.page
        setPageNo(page)
      }
      if (obj?.pageSize) {
        limit = obj?.pageSize
        setOffset(limit)
        setListLength(`${limit} Rows`)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, search)
    setLoading(true)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to set rolesList
  useEffect(() => {
    if (rolesList && previousProps?.rolesList !== rolesList) {
      if (rolesList) {
        if (rolesList?.results) {
          const userArrLength = rolesList?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(rolesList?.results ? rolesList?.results : [])
        setIndex(activePageNo)
        setTotal(rolesList?.total ? rolesList?.total : 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.rolesList = rolesList
    }
  }, [rolesList])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, props.search)
      setSearch(searchProp?.trim())
      setStart(startFrom)
      setPageNo(1)
      setLoading(true)
    }
    if (previousProps?.searchProp !== searchProp && props?.flag) {
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
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = {
        RolesManagement: location?.search
      }
      : data.RolesManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = (activePageNo - 1) * offset
          const limit = offset
          getList(startFrom, limit, search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setModalWarning(false)
          setPageNo(activePageNo)
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
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, search)
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

  // update status from list and dispatch action
  function onStatusUpdate () {
    const roleStatus = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updateRoleData = {
      name: selectedData?.sName,
      permissions: selectedData?.aPermissions,
      roleStatus: roleStatus,
      token,
      roleId: selectedData?._id
    }
    dispatch(updateRole(updateRoleData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
  }

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
    dispatch(deleteRole(deleteId, token))
    setLoading(true)
  }

  // Export Excel Report List
  const processExcelExportData = data => data?.map((permissionsList) => {
    let eStatus = permissionsList?.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    return {
      ...permissionsList,
      eStatus
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'RolesList.xlsx' }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      {
      !loading && list?.length === 0
        ? (
          <DataNotFound message="data" obj={obj}/>
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

              <ExcelExport ref={exporter} data={list} fileName="RolesList.xlsx">
                <ExcelExportColumn field="sName" title="Name" />
                <ExcelExportColumn field="eStatus" title="Status" />
              </ExcelExport>
              <table className='table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? (<SkeletonTable numberOfColumns={4} />)
                    : (
                      <Fragment>
                        {list && list?.length !== 0 && list.map((data, i) => (
                          <tr key={data?._id}>
                            <td>{(((index - 1) * offset) + (i + 1))}</td>
                            <td>
                              <CustomInput
                                key={`${data?._id}`}
                                checked={data?.eStatus === 'Y'}
                                disabled={adminPermission?.ADMIN_ROLE === 'R'}
                                id={`${data?._id}`}
                                name={`${data?._id}`}
                                onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                                type='switch'
                              />
                            </td>
                            <td>{data.sName}</td>
                            <td>
                              <ul className='action-list mb-0 d-flex'>
                                <li>
                                  <Button className='edit-btn-icon' color='link' tag={Link} to={`${editRoleLink}/${data._id}`}>
                                    <span><img alt="View" src={editIcon} /></span>
                                  </Button>
                                </li>
                                {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.ADMIN_ROLE !== 'R')) &&
                              (
                              <Fragment>
                                <Button className='delete-btn-icon' color="link" onClick={() => warningWithDeleteMessage(data?._id, 'delete')}>
                                  <span><img alt="Delete" src={deleteIcon} /></span>
                                </Button>
                              </Fragment>
                              )
                            }
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
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={deleteId ? onCancel : toggleWarning} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={deleteId ? onDelete : onStatusUpdate} type='submit'>{deleteId ? 'Delete It' : `${type} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

RolesList.propTypes = {
  rolesList: PropTypes.object,
  getList: PropTypes.func,
  editRoleLink: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool
}

RolesList.displayName = RolesList
export default connect(null, null, null, { forwardRef: true })(RolesList)
