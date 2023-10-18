import React, { Fragment, forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, CustomInput, Modal, ModalBody, Row, Col } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { useQueryState } from 'react-router-use-location-state'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import qs from 'query-string'
import PropTypes from 'prop-types'

import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import updateCMS from '../../../api/contentManagement/updateCMS'
import deleteCMS from '../../../api/contentManagement/deleteCMS'
import PaginationComponent from '../../../components/PaginationComponent'

import { modalMessageFunc } from '../../../helpers/helper'

const ContentManagementContent = forwardRef((props, ref) => {
  const { cmsList, offset, setOffset, start, setStart, setSearch, isLoading } = props
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const exporter = useRef(null)
  const searchProp = props.search
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [listLength, setListLength] = useState('10 Rows')
  const [index, setIndex] = useState(1)
  const [total, setTotal] = useState(0)

  const location = useLocation()
  const resStatus = useSelector(state => state?.cms?.resStatus)
  const resMessage = useSelector(state => state?.cms?.resMessage)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const paginationFlag = useRef(false)
  const obj = qs.parse(location?.search)

  const { mutate: deleteCMSFunc } = useMutation(deleteCMS, {
    onSuccess: (res) => {
      queryClient?.invalidateQueries('getCmsList')
    }
  })

  // update list
  const { mutate: updateCMSFunction } = useMutation(
    updateCMS, {
      onSuccess: (data) => {
        setMessage(data?.data?.message)
        setModalMessage(true)
        setStatus(true)
        queryClient?.invalidateQueries('getCmsList')
      }
    }
  )
  const previousProps = useRef({ cmsList, resStatus, resMessage, start, searchProp }).current

  const [close, setClose] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

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
    const startForm = (page - 1) * offset
    setStart(startForm)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // // to set Content list
  useEffect(() => {
    if (cmsList) {
      const userArrLength = cmsList?.data?.length
      const startFrom = ((activePageNo - 1) * offset) + 1
      const end = (startFrom - 1) + userArrLength
      setStartingNo(startFrom)
      setEndingNo(end)
      setList(cmsList?.data || [])
      setIndex(activePageNo)
      setTotal(cmsList?.nTotal || 0)
    }
  }, [cmsList])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          // getCMSList(search)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          // setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // to handle query params
  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = {
        ContentManagement: location?.search
      }
      : data.ContentManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      // getList(props.search)
      setSearch(searchProp?.trim())
      setPageNo(1)

      // setLoading(true)
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

  function warningWithConfirmMessage (data, eType) {
    setType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    deleteCMSFunc(deleteId)
    setDeleteId('')
    setModalWarning(false)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  // update status from list and dispatch action
  function onStatusUpdate () {
    const statuss = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updatedOfferData = {
      Title: selectedData?.sTitle,
      Slug: selectedData?.sSlug,
      Details: selectedData?.sContent,
      Description: selectedData?.sDescription,
      Category: selectedData?.sCategory,
      priority: selectedData?.nPriority,
      contentStatus: statuss,
      token,
      cmsId: selectedData?._id
    }
    updateCMSFunction(updatedOfferData)
    toggleWarning()
    setSelectedData({})
  }

  // Export Excel Report List
  const processExcelExportData = data => data?.map((CMSList) => {
    let eStatus = CMSList?.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    let sContent = document?.createElement('div')
    sContent.innerHTML = CMSList?.sContent
    sContent = sContent?.innerText
    return {
      ...CMSList,
      eStatus,
      sContent
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'CmsList.xlsx' }
      exporter?.current?.save()
    }
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />

      <ExcelExport ref={exporter} data={list} fileName="CMS.xlsx">
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="sSlug" title="Slug" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="nPriority" title="Priority" />
        <ExcelExportColumn field="sContent" title="Content" />
      </ExcelExport>
      {
      !isLoading && list?.length === 0
        ? (<DataNotFound message="Contents" obj=""/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="content-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? <SkeletonTable numberOfColumns={8} />
                    : (
                      <Fragment>
                        {list?.length !== 0 && list?.map((data, i) => (
                          <tr key={data?._id}>
                            <td>{(((index - 1) * offset) + (i + 1))}</td>
                            <td>
                              <CustomInput
                                // key={`${data._id}`}
                                key={'key' + data?._id}
                                checked={data?.eStatus === 'Y'}
                                disabled={adminPermission?.CMS === 'R'}
                                // id={`${data._id}`}
                                id={'id' + data?._id}
                                // name={`${data._id}`}
                                name={'name' + data?._id}
                                onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                                type='switch'
                              />
                            </td>
                            <td>{data?.sTitle}</td>
                            <td>{data?.sCategory || '-- '}</td>
                            <td>{data?.sSlug}</td>
                            <td>{data?.sDescription || '--'}</td>
                            <td>{data?.nPriority}</td>
                            <td>
                              <ul className="action-list mb-0 d-flex">
                                <li>
                                  <Link className="view" to={'/settings/content-details/' + data?.sSlug}>
                                    <Button className='edit-btn-icon'>
                                      <img alt="View" src={editButton} />
                                    </Button>
                                  </Link>
                                </li>
                                {
                            ((Auth && Auth === 'SUPER') || (adminPermission?.CMS !== 'R')) && (
                              <Fragment>
                                <li onClick={() => warningWithDeleteMessage(data?._id, 'delete')}>
                                  <Button className='delete-btn-icon' color="link">
                                    <span><img alt="Delete" src={deleteIcon} /></span>
                                  </Button>
                                </li>
                              </Fragment>
                            )
                          }
                              </ul>
                            </td>
                          </tr>
                        ))
                  }
                      </Fragment>
                      )}
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
            // setLoading={setLoading}
            setOffset={setOffset}
            setPageNo={setPageNo}
            setStart={setStart}
            startingNo={startingNo}
            total={total}
          />
        )}

      { /* Modal for ask confirmation to delete/update-status content */}
      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={deleteId ? onCancel : toggleWarning} type='submit'>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={deleteId ? onDelete : onStatusUpdate} type='submit'>
                {deleteId ? 'Delete It' : `${type} It`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

ContentManagementContent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  getList: PropTypes.func,
  cmsList: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  start: PropTypes.number,
  setStart: PropTypes.func,
  setSearch: PropTypes.func,
  isLoading: PropTypes.bool
}

ContentManagementContent.displayName = ContentManagementContent
export default connect(null, null, null, { forwardRef: true })(ContentManagementContent)
