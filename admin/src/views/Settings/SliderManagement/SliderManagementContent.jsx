import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { CustomInput, Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import qs from 'query-string'
import PropTypes from 'prop-types'

import editButton from '../../../assets/images/edit-pen-icon.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'
import noImage from '../../../assets/images/no-image-1.svg'
import statistics from '../../../assets/images/statistic.svg'

import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
import { deleteBanner, updateBanner } from '../../../actions/banner'

const SliderManagementContent = forwardRef((props, ref) => {
  const { getList, bannerList } = props
  const navigate = useNavigate()
  const location = useLocation()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [order, setOrder] = useQueryState('order', 'asc')
  const [search, setSearch] = useQueryState('search', '')
  const [sort] = useQueryState('sortBy', 'dCreatedAt')
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
  const [type, setType] = useState('')

  const dispatch = useDispatch()
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const resMessage = useSelector(state => state?.banner?.resMessage)
  const resStatus = useSelector(state => state?.banner?.resStatus)
  const searchProp = props?.search
  const previousProps = useRef({ bannerList, searchProp, resMessage, resStatus, start, offset })?.current
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
    let order = 'asc'
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
      if (obj?.order) {
        order = obj?.order
        setOrder(order)
      }
    }
    dispatch(getUrl('media'))
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, sort, order, search)
    setLoading(true)
  }, [])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  //  set bannerlist
  useEffect(() => {
    if (previousProps?.bannerList !== bannerList) {
      if (bannerList) {
        if (bannerList?.results) {
          const userArrLength = bannerList?.results?.length
          const startFrom = ((activePageNo - 1) * offset) + 1
          const end = (startFrom - 1) + userArrLength
          setStartingNo(startFrom)
          setEndingNo(end)
        }
        setList(bannerList?.results || [])
        setIndex(activePageNo)
        setTotal(bannerList?.total || 0)
      }
      setLoading(false)
    }
    return () => {
      previousProps.bannerList = bannerList
    }
  }, [bannerList])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          if (list?.length === 1 && deleteId) {
            setDeleteId('')
            const startFrom = 0
            const limit = offset
            getList(startFrom, limit, sort, order, search)
            setMessage(resMessage)
            setStatus(resStatus)
            setModalWarning(false)
            setModalMessage(true)
            setPageNo(1)
          } else {
            const startFrom = (activePageNo - 1) * offset
            const limit = offset
            getList(startFrom, limit, sort, order, search)
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
      ? data = { SliderManagement: location?.search }
      : data.SliderManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      const limit = offset
      getList(startFrom, limit, sort, order, props.search)
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

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

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
    dispatch(deleteBanner(deleteId, token))
    setLoading(true)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  // update status from list and dispatch action
  function onStatusUpdate () {
    const statuss = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updatedSliderData = {
      place: selectedData?.ePlace,
      Link: selectedData?.sLink,
      bannerImage: selectedData?.sImage,
      Description: selectedData?.sDescription,
      position: selectedData?.nPosition,
      League: selectedData?.iMatchLeagueId,
      Match: selectedData?.iMatchId,
      bannerType: selectedData?.eType,
      screen: selectedData?.eScreen,
      sportsType: selectedData?.eCategory,
      bannerStatus: statuss,
      token,
      bannerId: selectedData?._id
    }
    dispatch(updateBanner(updatedSliderData))
    setLoading(true)
    toggleWarning()
  }

  // will be called when page change occured
  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      getList(start, offset, sort, order, search)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  // Export Excel Report List
  const processExcelExportData = data => data?.map((SliderList) => {
    let eStatus = SliderList?.eStatus
    let ePlace = SliderList?.ePlace
    let eType = SliderList?.eType
    let eScreen = SliderList?.eScreen
    let sLink = SliderList?.sLink
    let eCategory = SliderList?.eCategory
    let nPosition = SliderList?.nPosition
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    ePlace = ePlace === 'H' ? 'Home Page' : 'Deposit Page'
    eType = eType === 'S' ? 'Screen' : eType === 'L' ? 'Link' : eType === 'CR' ? 'Contest Redirect' : '--'
    eScreen = eScreen === 'D' ? 'Deposit' : eScreen === 'S' ? 'Share' : '--'
    sLink = sLink || '--'
    eCategory = eCategory || '--'
    nPosition = nPosition || '--'
    let sDescription = document?.createElement('div')
    sDescription.innerHTML = SliderList?.sDescription
    sDescription = sDescription?.innerText
    return {
      ...SliderList,
      ePlace,
      eType,
      eScreen,
      eStatus,
      sDescription,
      sLink,
      eCategory,
      nPosition
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'Slider.xlsx' }
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
      <ExcelExport ref={exporter} data={list} fileName="Slider.xlsx" >
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="ePlace" title="Place" />
        <ExcelExportColumn field="eType" title="Type" />
        <ExcelExportColumn field="sLink" title="Link" />
        <ExcelExportColumn field="eScreen" title="Screen" />
        <ExcelExportColumn field="nPosition" title="Position" />
        <ExcelExportColumn field="eCategory" title="Category" />
        <ExcelExportColumn field="sDescription" title="Description" />
      </ExcelExport>
      {
      !loading && list?.length === 0
        ? (<DataNotFound message="Slider" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Place</th>
                    <th>Type</th>
                    <th>Link</th>
                    <th>Screen</th>
                    <th>Position</th>
                    <th>Statistics</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={10} />
                    : (
                      <Fragment>
                        {
                    list && list?.length !== 0 && list?.map((data, i) => (
                      <tr key={data._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>
                          <CustomInput
                            checked={data?.eStatus === 'Y'}
                            disabled={adminPermission?.BANNER === 'R'}
                            id={'id' + data?._id}
                            name={'name' + data?._id}
                            onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')
                            }
                            type='switch'
                          />
                        </td>
                        <td>
                          {data?.sImage
                            ? <img alt="banner" className="theme-image" src={url + data?.sImage} />
                            : <img alt="No Image" className='theme-image-offer' src={noImage}/> }
                        </td>
                        <td>{data?.ePlace && data?.ePlace === 'H' ? 'Home Page' : data?.ePlace === 'D' ? 'Deposit Page' : '--'}</td>
                        <td>{data?.eType === 'S' ? 'Screen' : data?.eType === 'L' ? 'Link' : data?.eType === 'CR' ? 'Contest Redirect' : ''}</td>
                        <td>{data?.sLink || '--'}</td>
                        <td>{data?.eScreen === 'D' ? 'Deposit' : data?.eScreen === 'S' ? 'Share' : data?.eScreen === 'CR' ? 'Contest Redirect' : '--'}</td>
                        <td>{data?.nPosition || '--'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink className="view" to={'/settings/slider-statistics/' + data?._id}>
                                <img alt="View" src={statistics} style={{ height: '20px', width: '20px' }} />
                              </NavLink>
                            </li>
                          </ul>
                        </td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink className="view" color="link" to={'/settings/slider-details/' + data?._id}>
                                <Button className='edit-btn-icon'>
                                  <img alt="View" src={editButton} />
                                </Button>
                              </NavLink>
                            </li>
                            {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.BANNER !== 'R')) &&
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
      {
        list?.length !== 0 && (
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
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={deleteId ? onCancel : toggleWarning} type='submit'>Cancel</Button>
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

SliderManagementContent.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  bannerList: PropTypes.arrayOf(PropTypes.object)
}

SliderManagementContent.displayName = SliderManagementContent
export default connect(null, null, null, { forwardRef: true })(SliderManagementContent)
