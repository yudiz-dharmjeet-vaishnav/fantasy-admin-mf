import React, { Fragment, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { Button, CustomInput, Modal, ModalBody, Row, Col } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { useQueryState } from 'react-router-use-location-state'
import qs from 'query-string'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import noImage from '../../../assets/images/no-image-1.svg'
import deleteIcon from '../../../assets/images/delete-bin-icon.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import { getUrl } from '../../../actions/url'
// import { deleteOffer } from '../../../actions/offers'
import deleteOffer from '../../../api/Offermangement/deleteOffer'
import updateOffer from '../../../api/Offermangement/updateOffer'

const OfferManagementContent = forwardRef((props, ref) => {
  const { offerList, offset, setOffset, setOrder, start, setStart, setSearch, isLoading } = props
  const queryClient = useQueryClient()
  const location = useLocation()
  const exporter = useRef(null)
  // const [start, setStart] = useState(0)
  const [list, setList] = useState([])
  const [deleteId, setDeleteId] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [url, setUrl] = useState('')
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [close, setClose] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')

  const dispatch = useDispatch()
  const resStatus = useSelector(state => state?.offers?.resStatus)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const resMessage = useSelector(state => state?.offers?.resMessage)
  const searchProp = props?.search
  const previousProps = useRef({ offerList, searchProp, resMessage, resStatus, start, offset })?.current
  const paginationFlag = useRef(false)
  const obj = qs?.parse(location?.search)

  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)

  const { mutate: updateOfferFun } = useMutation(updateOffer, {
    onSuccess: (response) => {
      setMessage(response?.data?.message)
      setModalMessage(true)
      setStatus(true)
      queryClient.invalidateQueries('getOfferList')
    }
  })

  const { mutate: deleteOfferFun } = useMutation(deleteOffer, {
    onSuccess: (res) => {
      setModalWarning(false)
      setMessage(res?.data?.message)
      setModalMessage(true)
      setStatus(true)
      queryClient.invalidateQueries('getOfferList')
    }
  })
  useEffect(() => {
    if (location?.state) {
      if (location?.state.message) {
        setMessage(location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
    }
    dispatch(getUrl('media'))
    let page = 1
    let limit = offset
    let order = 'desc'
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
    const startFrom = (page - 1) * offset
    setStart(startFrom)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  //  for set offer list
  useEffect(() => {
    if (offerList) {
      if (offerList?.results) {
        const userArrLength = offerList?.results?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
      }
      setList(offerList?.results ? offerList?.results : [])
      setIndex(activePageNo)
      setTotal(offerList?.total ? offerList?.total : 0)
    }

    return () => {
      previousProps.offerList = offerList
    }
  }, [offerList])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  useEffect(() => {
    // Check if there are any previously stored queryParams in the localStorage.
    let data = localStorage?.getItem('queryParams') ? JSON?.parse(localStorage?.getItem('queryParams')) : {}
    // If there are no queryParams stored, create a new data object with the current location.search value.
    // Otherwise, update the OfferManagement property of the existing data object with the current location.search value.
    !Object?.keys(data)?.length
      ? data = { OfferManagement: location?.search }
      : data.OfferManagement = location?.search
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      setSearch(searchProp?.trim())
      setPageNo(1)
    }
    // If the searchProp has changed and the flag is true, debounce the search service call.
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

  // will be called when page change occured
  useEffect(() => {
    if ((previousProps?.start !== start || previousProps?.offset !== offset) && paginationFlag?.current) {
      // getList(start, offset, sort, order, search)

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

  function warningWithDeleteMessage (Id, eType) {
    setType(eType)
    setModalWarning(true)
    setDeleteId(Id)
  }

  function onDelete () {
    deleteOfferFun(deleteId)
  }

  function onCancel () {
    toggleWarning()
    setDeleteId('')
  }

  // update status from list and dispatch action
  function onStatusUpdate () {
    const status = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updatedOfferData = {
      Title: selectedData?.sTitle,
      offerImage: selectedData?.sImage,
      Details: selectedData?.sDetail,
      Description: selectedData?.sDescription,
      Active: status,
      offerId: selectedData?._id
    }
    updateOfferFun(updatedOfferData)
    toggleWarning()
    setSelectedData({})
  }

  /**
 * Process data for Excel export.
 *
 * @param {Array} data - An array of objects representing the data to be processed.
 * @returns {Array} An array of processed objects for Excel export.
 */
  const processExcelExportData = data => data?.map((offersList) => {
    let eStatus = offersList?.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    // Create a temporary HTML element to extract innerText from sDetail.
    let sDetail = document?.createElement('div')
    sDetail.innerHTML = offersList?.sDetail
    sDetail = sDetail?.innerText
    return {
      ...offersList,
      eStatus,
      sDetail
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'Offers.xlsx' }
      exporter?.current?.save()
    }
  }
  // Expose the onExport function to the parent component through the ref.
  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      {modalMessage && message && (
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      )}
      <ExcelExport ref={exporter} data={list} fileName="Offer.xlsx">
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="sDetail" title="Details" />
      </ExcelExport>
      {
      !isLoading && list?.length === 0
        ? (
          <DataNotFound message="Offers" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="content-table1">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th> Status </th>
                    <th>Image</th>
                    <th>Title</th>
                    <th> Short Description</th>
                    <th> Actions </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {
                    list && list?.length !== 0 && list?.map((data, i) => {
                      return (
                        <tr key={data?._id} className={data?._id}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td className="success-text">
                            <CustomInput
                              key={'key' + data?._id}
                              checked={data?.eStatus === 'Y'}
                              disabled={adminPermission?.OFFER === 'R'}
                              id={'id' + data?._id}
                              name={'name' + data?._id}
                              onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                              type='switch'
                            />
                          </td>
                          <td>
                            {data?.sImage
                              ? <img alt="Offer Image" className='theme-image-offer' src={url + data?.sImage}/>
                              : <img alt="No Image" className='theme-image-offer' src={noImage}/>
                            }
                          </td>
                          <td>{data?.sTitle}</td>
                          <td>{data?.sDescription}</td>
                          <td>
                            <ul className="action-list mb-0 d-flex">
                              <li>
                                <NavLink className="view" color="link" to={'/settings/offer-details/' + data._id}>
                                  <Button className='edit-btn-icon'>
                                    <img alt="View" src={editButton} />
                                  </Button>
                                </NavLink>
                              </li>
                              {
                              ((Auth && Auth === 'SUPER') || (adminPermission?.OFFER !== 'R')) &&
                              (
                              <Fragment>
                                <li>
                                  <Button className='delete-btn-icon' color="link" onClick={() => warningWithDeleteMessage(data?._id, 'delete')}>
                                    <span><img alt="Delete" src={deleteIcon} /></span>
                                  </Button>
                                </li>
                              </Fragment>
                              )}
                            </ul>
                          </td>
                        </tr>
                      )
                    })}
                      </Fragment>
                      )}
                </tbody>
              </table>
            </div>
          </div>
          )}

      { list?.length !== 0 && (
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

OfferManagementContent.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  search: PropTypes.string,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  offerList: PropTypes.arrayOf(PropTypes.object),
  updateOfferFunction: PropTypes.func,
  offers: PropTypes.string,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  order: PropTypes.string,
  setOrder: PropTypes.func,
  sort: PropTypes.string,
  start: PropTypes.number,
  setStart: PropTypes.func,
  setSearch: PropTypes.func,
  isLoading: PropTypes.bool
}

OfferManagementContent.displayName = OfferManagementContent
export default connect(null, null, null, { forwardRef: true })(OfferManagementContent)
