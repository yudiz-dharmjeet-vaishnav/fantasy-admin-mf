import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { CustomInput, Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import qs from 'query-string'
import PropTypes from 'prop-types'

import noImage from '../../../assets/images/no-image-1.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
import { deletePopUpAd, updatePopupAd } from '../../../actions/popup'

const PopUpAdsList = forwardRef((props, ref) => {
  const { getList, popUpAdsList, type } = props
  const location = useLocation()
  const navigate = useNavigate()
  const searchProp = props.search
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [url, setUrl] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [close, setClose] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [modalMessage, setModalMessage] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [actionType, setActionType] = useState('')
  const [search, setSearch] = useQueryState('search', '')
  const dispatch = useDispatch()
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const resMessage = useSelector(state => state?.popup?.resMessage)
  const resStatus = useSelector(state => state?.popup?.resStatus)
  const previousProps = useRef({ popUpAdsList, type, resMessage, resStatus })?.current
  const paginationFlag = useRef(false)
  const obj = qs?.parse(location?.search)
  const [modalWarning, setModalWarning] = useState(false)
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
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, type, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  //  set popup-ads list
  useEffect(() => {
    if (previousProps?.popUpAdsList !== popUpAdsList) {
      if (popUpAdsList) {
        if (popUpAdsList?.results) {
          const userArrLength = popUpAdsList?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(popUpAdsList?.results || [])
        setIndex(activePageNo)
        setLoading(false)
        setTotal(popUpAdsList?.total || 0)
      }
    }
    return () => {
      previousProps.popUpAdsList = popUpAdsList
    }
  }, [popUpAdsList])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, type, props.search)
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

  //  set popup-ads type
  useEffect(() => {
    if (previousProps?.type !== type) {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, type, search)
      setLoading(true)
      setPageNo(1)
    }
    return () => {
      previousProps.type = type
    }
  }, [type])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list?.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, type, search)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setPageNo(1)
            setModalMessage(true)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, type, search)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(activePageNo)
          }
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

  // to handle query params
  useEffect(() => {
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    !Object?.keys(data)?.length
      ? data = { PopupAdsManagement: location?.search }
      : data.PopupAdsManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  function warningWithConfirmMessage (data, eType) {
    setActionType(eType)
    setSelectedData(data)
    setModalWarning(true)
  }

  function warningWithDeleteMessage (Id, eType) {
    setActionType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    dispatch(deletePopUpAd(deleteId, token))
    setModalWarning(false)
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  // update status from list and dispatch action
  function onStatusUpdate () {
    const statuss = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedPromoData = {
      title: selectedData?.sTitle,
      adImage: selectedData?.sImage,
      type: selectedData?.eType,
      Link: selectedData?.sLink,
      category: selectedData?.eCategory,
      Match: selectedData?.iMatchId,
      League: selectedData?.iMatchLeagueId,
      platform: selectedData?.ePlatform,
      adStatus: statuss,
      token,
      popupAdId: selectedData?._id
    }
    dispatch(updatePopupAd(updatedPromoData, selectedData._id))
    setLoading(true)
    toggleWarning()
  }

  // will be called when page change occured
  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, type, search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // Export Excel Report List
  const processExcelExportData = data => data.map((popupAdsList) => {
    const eType = popupAdsList?.eType === 'I' ? 'Internal' : 'External'
    const ePlatform = popupAdsList?.ePlatform && popupAdsList?.ePlatform === 'ALL' ? 'All' : popupAdsList?.ePlatform === 'W' ? 'Web' : popupAdsList?.ePlatform === 'A' ? 'Android' : popupAdsList?.ePlatform === 'I' ? 'iOS' : '--'
    const sTitle = popupAdsList?.sTitle || '--'
    const sLink = popupAdsList?.sLink || '--'
    const eCategory = popupAdsList?.eCategory || '--'
    const eStatus = popupAdsList?.eStatus === 'Y' ? 'Active' : 'InActive'

    return {
      ...popupAdsList,
      eType,
      ePlatform,
      sTitle,
      sLink,
      eCategory,
      eStatus
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'PopupAds.xlsx' }
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

      <ExcelExport ref={exporter} data={list} fileName="PopupAds.xlsx">
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="eCategory" title="Category" />
        <ExcelExportColumn field="sLink" title="Link" />
        <ExcelExportColumn field="ePlatform" title="Platform" />
      </ExcelExport>
      {
      !loading && list?.length === 0
        ? (<DataNotFound message="Popup Ads" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Link</th>
                    <th>Platform</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={9} />
                    : (
                      <Fragment>
                        {
                  list && list?.length !== 0 && list?.map((data, i) => (
                    <tr key={data?._id}>
                      <td>{(((index - 1) * offset) + (i + 1))}</td>
                      <td>
                        <CustomInput checked={data?.eStatus === 'Y'}
                          disabled={adminPermission?.POPUP_ADS === 'R'}
                          id={'id' + data?._id}
                          name={'name' + data?._id}
                          onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                          type='switch'
                        />
                      </td>
                      <td>
                        {data?.sImage
                          ? <img alt="popup" className="theme-image" src={url + data?.sImage} width="56px"/>
                          : <img alt="No Image" className='theme-image-offer' src={noImage} width="56px"/>
                          }
                      </td>
                      <td>{data?.sTitle || '--' }</td>
                      <td>{data?.eType === 'I' ? 'Internal' : 'External'}</td>
                      <td>{data?.eCategory || '--' }</td>
                      <td>{data?.sLink || '--' }</td>
                      <td>{data?.ePlatform && data?.ePlatform === 'ALL' ? 'All' : data?.ePlatform === 'W' ? 'Web' : data?.ePlatform === 'A' ? 'Android' : data?.ePlatform === 'I' ? 'iOS' : '--'}</td>
                      <td>
                        <ul className="action-list mb-0 d-flex">
                          <li>
                            <NavLink className="view" color="link" to={'/settings/update-popup-ad/' + data?._id}>
                              <Button className='edit-btn-icon'>
                                <img alt="View" src={editButton} />
                              </Button>
                            </NavLink>
                          </li>
                          {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.POPUP_ADS !== 'R')) &&
                              (
                                <Fragment>
                                  <li>
                                    <Button className='delete-btn-icon' color="link" onClick={() => warningWithDeleteMessage(data?._id, 'delete')}>
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
          <h2 className='popup-modal-message'>{`Are you sure you want to ${actionType} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={deleteId ? onCancel : toggleWarning} type='submit'>Cancel</Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={deleteId ? onDelete : onStatusUpdate} type='submit'>{deleteId ? 'Delete It' : `${actionType} It`}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>

    </Fragment>
  )
})

PopUpAdsList.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  popUpAdsList: PropTypes.object,
  type: PropTypes.string
}

PopUpAdsList.displayName = PopUpAdsList

export default connect(null, null, null, { forwardRef: true })(PopUpAdsList)
