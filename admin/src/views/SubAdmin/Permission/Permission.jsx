import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Button, Col, CustomInput, Modal, ModalBody, Row } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import viewIcon from '../../../assets/images/view-eye.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'

import { modalMessageFunc } from '../../../helpers/helper'
import { updatePermission } from '../../../actions/permission'

const Permission = forwardRef((props, ref) => {
  const { List, getList } = props
  const navigate = useNavigate()
  const location = useLocation()

  const exporter = useRef(null)
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)

  const toggleWarning = () => setModalWarning(!modalWarning)
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const resStatus = useSelector((state) => state?.permission?.resStatus)
  const resMessage = useSelector((state) => state?.permission?.resMessage)
  const previousProps = useRef({ resStatus, resMessage })?.current

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.message) {
        setMessage(location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location?.pathname, { replace: true })
    }
    getList()
    setLoading(true)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (List && previousProps?.List !== List) {
      setList(List)
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          getList()
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

  // update status from list and dispatch action
  function onStatusUpdate () {
    const permissionStatus = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updatedPermissionData = {
      Name: selectedData?.sName,
      Key: selectedData?.sKey,
      permissionStatus: permissionStatus,
      token,
      ID: selectedData?._id
    }
    dispatch(updatePermission(updatedPermissionData))
    setLoading(true)
    toggleWarning()
    setSelectedData({})
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
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'Permissions.xlsx' }
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
          <DataNotFound message="Permission" obj=""/>
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

              <ExcelExport
                ref={exporter}
                data={list}
                fileName="Permissions.xlsx"
              >
                <ExcelExportColumn field="sName" title="Name" />
                <ExcelExportColumn field="sKey" title="Key" />
                <ExcelExportColumn field="eStatus" title="Status" />
              </ExcelExport>
              <table className='table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Permission Name</th>
                    <th>Permission Key</th>
                    <th>Permission Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? (
                      <SkeletonTable numberOfColumns={5} />
                      )
                    : (
                      <Fragment>
                        {list && list?.length !== 0 && list
                          .sort((a, b) => a?.sName?.localeCompare(b?.sName))
                          .map((data, i) => (
                            <tr key={data?._id}>
                              <td>{i + 1}</td>
                              <td>{data?.sName}</td>
                              <td>{data?.sKey}</td>
                              <td>
                                <CustomInput
                                  key={`${data?._id}`}
                                  checked={data?.eStatus === 'Y'}
                                  disabled={adminPermission?.PERMISSION === 'R'}
                                  id={`${data?._id}`}
                                  name={`${data?._id}`}
                                  onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                                  type='switch'
                                />
                              </td>
                              <td>
                                <ul className='action-list mb-0 d-flex'>
                                  <li>
                                    <Button className='view' color='link' tag={Link} to={`${props?.EditPermissionLink}/${data?._id}`}>
                                      <img alt='View' src={viewIcon} />
                                      View
                                    </Button>
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
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={toggleWarning} type='submit'>Cancel</Button>
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

Permission.propTypes = {
  List: PropTypes.object,
  getList: PropTypes.func,
  location: PropTypes.object,
  history: PropTypes.object,
  EditPermissionLink: PropTypes.string
}

Permission.displayName = Permission

export default connect(null, null, null, { forwardRef: true })(Permission)
