import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { CustomInput, Modal, ModalBody, Row, Col, Button } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import moment from 'moment'
import qs from 'query-string'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import DataNotFound from '../../../components/DataNotFound'
import AlertMessage from '../../../components/AlertMessage'
import SkeletonTable from '../../../components/SkeletonTable'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'
import getSettingList from '../../../api/settingManagement/getSettingList'
import updateSetting from '../../../api/settingManagement/updateSetting'

const SettingManagementContent = forwardRef((props, ref) => {
  const { settingList, start, setStart, offset, setOffset, setSearch, isLoading, isFullList } = props
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
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [listLength, setListLength] = useState('10 Rows')
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [close, setClose] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [modalWarning, setModalWarning] = useState(false)
  const [fullList, setFullList] = useState([])
  const toggleWarning = () => setModalWarning(!modalWarning)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const token = useSelector(state => state?.auth?.token)
  const resStatus = useSelector((state) => state?.setting?.resStatus)
  const resMessage = useSelector((state) => state?.setting?.resMessage)
  const obj = qs?.parse(location.search)
  const searchProp = props.search
  const previousProps = useRef({
    resMessage,
    resStatus,
    settingList,
    searchProp,
    start,
    offset
  })?.current
  const paginationFlag = useRef(false)

  const { mutate: updateSettingFun } = useMutation(updateSetting, {
    onSuccess: (res) => {
      setMessage(res?.data?.message)
      setModalMessage(true)
      setStatus(true)
      queryClient?.invalidateQueries('getSettingList')
    }
  })

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
  }, [])

  //  set settingList
  useEffect(() => {
    if (settingList?.results && !isFullList?.current) {
      const userArrLength = settingList?.results?.length
      const startFrom = ((activePageNo - 1) * offset) + 1
      const end = startFrom - 1 + userArrLength
      setIndex(activePageNo)
      setStartingNo(startFrom)
      setEndingNo(end)
      setList(settingList?.results)
      setTotal(settingList?.total ? settingList?.total : 0)
    } else if (isFullList.current) {
      setFullList(settingList?.results ? settingList?.results : [])
      setIndex(activePageNo)
      setTotal(settingList?.total ? settingList?.total : 0)
      isFullList.current = false
    }
  }, [settingList?.results, isFullList?.current])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
          setPageNo(activePageNo)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalWarning(false)
          setModalMessage(true)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // to handle query params
  useEffect(() => {
    let data = localStorage?.getItem('queryParams')
      ? JSON?.parse(localStorage?.getItem('queryParams'))
      : {}
    !Object?.keys(data)?.length
      ? (data = { SettingManagement: location?.search })
      : (data.SettingManagement = location?.search)
    localStorage?.setItem('queryParams', JSON?.stringify(data))
  }, [location?.search])

  // will be called when something searched
  useEffect(() => {
    const callSearchService = () => {
      const startFrom = 0
      setSearch(searchProp?.trim())
      setStart(startFrom)
      setPageNo(1)
    }
    if (previousProps?.searchProp !== searchProp && props?.flag) {
      const deBouncer = setTimeout(() => {
        callSearchService()
      }, 1000)
      return () => {
        clearTimeout(deBouncer)
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

  function onCancel () {
    toggleWarning()
  }

  // update status from list
  function onStatusUpdate () {
    const status = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updatedSettingData = {
      Title: selectedData?.sTitle,
      Key: selectedData?.sKey,
      Max: selectedData?.nMax,
      Min: selectedData?.nMin,
      settingStatus: status,
      token,
      settingId: selectedData?._id
    }
    updateSettingFun(updatedSettingData)
    toggleWarning()
  }

  // Export Excel Report List
  const processExcelExportData = (data) =>
    data.map((PromoCodeList) => {
      let eStatus = PromoCodeList?.eStatus
      eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
      let dCreatedAt = moment(PromoCodeList?.dCreatedAt)?.local()?.format('lll')
      dCreatedAt = dCreatedAt === 'Invalid date' ? ' - ' : dCreatedAt
      const nMin = PromoCodeList?.nMin || '--'
      const nMax = PromoCodeList?.nMax || '--'
      return {
        ...PromoCodeList,
        dCreatedAt,
        nMin,
        nMax,
        eStatus
      }
    })

  const exportMutation = useMutation(() => getSettingList(0, 10, '', '', '', true), {
    onSuccess: (data) => {
      if (data.data?.data[0]?.results) {
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(data.data?.data[0]?.results || []),
          fileName: 'Setting.xlsx'
        }
        exporter?.current?.save()
      }
    }
  })

  async function onExport () {
    exportMutation?.mutate()
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  function valueFunc (key, value, max) {
    if ((key === 'FIX_DEPOSIT1') || (key === 'FIX_DEPOSIT2') || (key === 'FIX_DEPOSIT3')) {
      return value
    } else if ((key === 'BonusExpireDays') || (key === 'UserDepositRateLimit') || (key === 'UserDepositRateLimitTimeFrame') || (key === 'TDS') || (key === 'UserWithdrawRateLimit') || (key === 'UserWithdrawRateLimitTimeFrame')) {
      return max
    } else {
      return '--'
    }
  }

  return (
    <Fragment>
      <ExcelExport ref={exporter} data={fullList && fullList?.length > 0 ? fullList : list} fileName='Setting.xlsx'>
        <ExcelExportColumn field='eStatus' title='Status' />
        <ExcelExportColumn field='sTitle' title='Title' />
        <ExcelExportColumn field='sKey' title='Key' />
        <ExcelExportColumn field='nMin' title='Minimum' />
        <ExcelExportColumn field='nMax' title='Maximum' />
        <ExcelExportColumn field='dCreatedAt' title='Time' />
      </ExcelExport>
      {
      !isLoading && list?.length === 0
        ? (<DataNotFound message="Settings" obj={obj}/>)
        : (
          <div className='table-represent'>
            <div className='table-responsive'>
              <AlertMessage
                close={close}
                message={message}
                modalMessage={modalMessage}
                status={status}
              />

              <table className='setting-table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? (<SkeletonTable numberOfColumns={8} />)
                    : (
                      <Fragment>
                        {list &&
                    list?.length !== 0 && list?.map((data, i) => (
                      <tr key={data?._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>
                          <CustomInput
                            checked={data?.eStatus === 'Y'}
                            disabled={(adminPermission?.SETTING === 'R') || (data?.sKey === 'PCF') || (data?.sKey === 'PCS') || (data?.sKey === 'PUBC')}
                            id={'id' + data?._id}
                            name={'name' + data?._id}
                            onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                            type='switch'
                          />
                        </td>
                        <td>{data?.sTitle}</td>
                        <td>{data?.sDescription || '-'}</td>
                        <td>{((data?.sKey === 'PCF') || (data?.sKey === 'PCS') || (data?.sKey === 'PUBC') || (data?.sKey === 'Deposit') || (data?.sKey === 'Withdraw') || (data?.sKey === 'withdrawPermission')) ? (data?.nMin || '--') : '--'}</td>
                        <td>{((data?.sKey === 'PCF') || (data?.sKey === 'PCS') || (data?.sKey === 'PUBC') || (data?.sKey === 'Deposit') || (data?.sKey === 'Withdraw') || (data?.sKey === 'withdrawPermission')) ? (data?.nMax || '--') : '--'}</td>
                        <td>{valueFunc(data?.sKey, data?.sValue, data?.nMax)}</td>
                        <td>
                          <ul className='action-list mb-0 d-flex'>
                            <li>
                              <NavLink className='view' color='link' to={'/settings/setting-details/' + data?._id}>
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

SettingManagementContent.propTypes = {
  search: PropTypes.string,
  location: PropTypes.object,
  history: PropTypes.object,
  flag: PropTypes.bool,
  getList: PropTypes.func,
  settingList: PropTypes.object,
  start: PropTypes.number,
  setStart: PropTypes.func,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  setSearch: PropTypes.func,
  isLoading: PropTypes.func,
  sort: PropTypes.string,
  isFullList: PropTypes.string,
  setIsFullResponse: PropTypes.func,
  refetch: PropTypes.func,
  isSuccess: PropTypes.bool

}

SettingManagementContent.displayName = SettingManagementContent
export default connect(null, null, null, { forwardRef: true })(SettingManagementContent)
