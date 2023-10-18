import React, { forwardRef, Fragment, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { Button, Col, Modal, ModalBody, Row } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'

import editButton from '../../../assets/images/edit-pen-icon.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import deleteVersion from '../../../api/version/deleteVersion'

const Version = forwardRef((props, ref) => {
  const { editVersionLink, versionList, modalMessage, setModalMessage, message, setMessage, status, setStatus, setOffset, setStart, start, offset, isLoading } = props
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)

  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [deleteId, setDeleteId] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const resStatus = useSelector((state) => state?.version?.resStatus)
  const resMessage = useSelector((state) => state?.version?.resMessage)
  const obj = qs?.parse(location?.search)

  const previousProps = useRef({ versionList, resMessage, resStatus, start, offset })?.current
  const paginationFlag = useRef(false)

  const { mutate: deleteVersionFun } = useMutation(deleteVersion, {
    onSuccess: (res) => {
      setMessage(res?.data?.message)
      queryClient.invalidateQueries('getVersionList')
    }
  })

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.message) {
        setMessage(location?.state?.message)
        setModalMessage(true)
        setStatus(true)
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
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    let data = localStorage?.getItem('queryParams')
      ? JSON?.parse(localStorage?.getItem('queryParams'))
      : {}
    !Object?.keys(data)?.length
      ? (data = { ValidationManagement: location?.search })
      : (data.VersionManagement = location?.search)
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // to set versionList
  useEffect(() => {
    // if (previousProps.versionList !== versionList) {
    if (versionList) {
      if (versionList?.results) {
        const userArrLength = versionList && versionList?.results?.length
        const startFrom = (activePageNo - 1) * offset + 1
        const end = startFrom - 1 + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
      }
      setList(versionList && versionList?.results)
      setIndex(activePageNo)
      setTotal(versionList.total ? versionList.total : 0)
    } else {
      setList([])
    }

    return () => {
      previousProps.versionList = versionList
    }
  }, [versionList])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
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

  // will be called when page change occured
  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      // getList(start, offset)
      // setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // Export Excel Report List
  const processExcelExportData = data => data?.map((VersionList) => {
    let eType = VersionList?.eType
    const bInAppUpdate = VersionList?.bInAppUpdate ? 'true' : 'false'
    let dCreatedAt = moment(VersionList?.dCreatedAt)?.local()?.format('lll')
    dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
    eType = eType === 'I' ? 'iOS' : VersionList?.eType === 'A' ? 'Android' : '--'
    return {
      ...VersionList,
      eType,
      bInAppUpdate,
      dCreatedAt
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'Versions.xlsx' }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  function warningWithDeleteMessage (Id) {
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  function onDelete () {
    deleteVersionFun(deleteId)
    setModalWarning(false)
  }

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />

      <ExcelExport ref={exporter} data={list} fileName="Versions.xlsx">
        <ExcelExportColumn field="sVersion" title="Version" />
        <ExcelExportColumn field="sName" title="Name" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="sUrl" title="URL" />
        <ExcelExportColumn field="sForceVersion" title="Force Version" />
        <ExcelExportColumn field="bInAppUpdate" title="In app update" />
        <ExcelExportColumn field="dCreatedAt" title="Creation Date" />
      </ExcelExport>
      {isLoading && <Loading />}

      {
      !isLoading && list?.length === 0
        ? (<DataNotFound message="Version" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className='table-responsive'>
              <table className='content-table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th>URL</th>
                    <th>Version</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? (<SkeletonTable numberOfColumns={8} />)
                    : (
                      <Fragment>
                        {list && list?.length !== 0 && list.map((data, i) => (
                          <tr key={data?._id}>
                            <td>{(index - 1) * offset + (i + 1)}</td>
                            <td>{data?.sName || '-'}</td>
                            <td>{data?.sDescription || '-'}</td>
                            <td>{data?.eType && data?.eType === 'I' ? 'iOS' : data?.eType === 'A' ? 'Android' : '-'}</td>
                            <td>{data?.sUrl || '-'}</td>
                            <td>{data?.sVersion || '-'}</td>
                            <td>{data?.dCreatedAt ? moment(data?.dCreatedAt)?.format('DD/MM/YYYY hh:mm A') : '-'}</td>
                            <td>
                              <ul className='action-list mb-0 d-flex'>
                                <li>
                                  <Button className='edit-btn-icon' color='link' tag={Link} to={`${editVersionLink}/${data?._id}`}>
                                    <span><img alt="View" src={editButton} /></span>
                                  </Button>
                                </li>
                                {((Auth && Auth === 'SUPER') || (adminPermission?.VERSION !== 'R')) &&
                              (
                              <Fragment>
                                <li>
                                  <Button className='delete-btn-icon' color="link" onClick={() => warningWithDeleteMessage(data._id)}>
                                    <span><img alt="Delete" src={deleteIcon} /></span>
                                  </Button>
                                </li>
                              </Fragment>
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

      <Modal className='modal-confirm' isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>Are you sure you want to Delete it?</h2>
          <Row className='row-12'>
            <Col>
              <Button className="theme-btn outline-btn-cancel full-btn-cancel" onClick={deleteId ? onCancel : toggleWarning} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button
                className='theme-btn danger-btn full-btn'
                onClick={deleteId && onDelete}
                type='submit'
              >
                Delete It

              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

      {list?.length !== 0 && (
      <PaginationComponent
        activePageNo={activePageNo}
        endingNo={endingNo}
        listLength={listLength}
        offset={offset}
        paginationFlag={paginationFlag}
        setListLength={setListLength}
        setOffset={setOffset}
        setPageNo={setPageNo}
        setStart={setStart}
        startingNo={startingNo}
        total={total}
      />
      )}
    </Fragment>
  )
})

Version.propTypes = {
  editVersionLink: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  versionList: PropTypes.object,
  getList: PropTypes.func,
  modalMessage: PropTypes.bool,
  setModalMessage: PropTypes.func,
  message: PropTypes.bool,
  setMessage: PropTypes.func,
  status: PropTypes.bool,
  setStatus: PropTypes.func,
  start: PropTypes.number,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  setStart: PropTypes.func,
  isLoading: PropTypes.bool
}

Version.displayName = Version

export default Version
