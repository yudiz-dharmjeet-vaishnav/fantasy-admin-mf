import React, { Fragment, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { Button, Col, CustomInput, Modal, ModalBody, Row } from 'reactstrap'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useQueryState } from 'react-router-use-location-state'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import qs from 'query-string'

import editButton from '../../../assets/images/edit-pen-icon.svg'
import warningIcon from '../../../assets/images/error-warning.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import DataNotFound from '../../../components/DataNotFound'
import AlertMessage from '../../../components/AlertMessage'
import updateRule from '../../../api/commonRule/querie/updateRule'
import PaginationComponent from '../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../helpers/helper'

const CommonRuleList = forwardRef((props, ref) => {
  const { rulesList, isLoading, offset, setOffset, start, setStart } = props
  const queryClient = useQueryClient()

  // const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const exporter = useRef(null)
  const [list, setList] = useState([])
  // const [offset] = useQueryState('pageSize', 10)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [index, setIndex] = useState(1)
  const [modalMessage, setModalMessage] = useState(false)
  const [type, setType] = useState('')
  const [selectedData, setSelectedData] = useState({})
  const [modalWarning, setModalWarning] = useState(false)
  const [close, setClose] = useState(false)
  const [total, setTotal] = useState(0)
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [listLength, setListLength] = useState('10 Rows')

  const toggleWarning = () => setModalWarning(!modalWarning)
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth)
  const resStatus = useSelector((state) => state?.rule?.resStatus)
  const resMessage = useSelector((state) => state?.rule?.resMessage)
  const paginationFlag = useRef(false)
  const obj = qs?.parse(location?.search)

  const previousProps = useRef({ rulesList, resStatus, resMessage, start })?.current

  const { mutate: updateRuleFun } = useMutation(updateRule, {
    onSuccess: (data) => {
      setMessage(data?.data?.message)
      setModalMessage(true)
      setStatus(true)
      queryClient?.invalidateQueries('getRuleList')
    }
  })

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.message) {
        setMessage(location?.state?.message)
        setStatus(true)
        setModalMessage(true)
      }
    }
    // getList()
    navigate(location?.pathname, { replace: true })
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
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (rulesList) {
      if (rulesList?.data) {
        const userArrLength = rulesList?.data?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
      }
      setList(rulesList?.data || [])
      setIndex(activePageNo)
      setTotal(rulesList?.count || 0)
    }

    return () => {
      previousProps.rulesList = rulesList
    }
  }, [rulesList])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
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

  // close popup modal
  function onCancel () {
    toggleWarning()
  }

  // update status from list
  function onStatusUpdate () {
    const status = selectedData.eStatus === 'Y' ? 'N' : 'Y'
    const updatedPaymentData = {
      eRule: selectedData?.eRule,
      eType: selectedData?.eType,
      nAmount: selectedData?.nAmount,
      expiryDays: selectedData?.nExpireDays,
      sRuleName: selectedData?.sRuleName,
      eStatus: status,
      token,
      Id: selectedData?._id
    }
    updateRuleFun(updatedPaymentData)
    toggleWarning()
  }

  // Export Excel Report List
  const processExcelExportData = (data) =>
    data?.map((commonRuleList) => {
      let eStatus = commonRuleList?.eStatus
      let eType = commonRuleList?.eType
      eStatus = eStatus === 'Y' ? 'Active' : 'InAc?tive'
      eType = eType === 'B' ? 'Bonus' : eType === 'C' ? 'Cash' : eType === 'W' ? 'Withdraw' : eType === 'D' ? 'Deposit' : '--'
      return {
        ...commonRuleList,
        eStatus,
        eType
      }
    })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = {
        ...exporter?.current?.props,
        data: processExcelExportData(list),
        fileName: 'CommonRules.xlsx'
      }
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

      <ExcelExport ref={exporter} data={list} fileName='Commonrules.xlsx'>
        <ExcelExportColumn field='eStatus' title='Status' />
        <ExcelExportColumn field='sRuleName' title='Rule Name' />
        <ExcelExportColumn field='eRule' title='Rule Shortname' />
        <ExcelExportColumn field='nAmount' title='Amount' />
        <ExcelExportColumn field='eType' title='Type' />
      </ExcelExport>
      {
      !isLoading && list?.length === 0
        ? (<DataNotFound message="Common Rules" obj=""/>)
        : (
          <div className='table-represent'>
            <div className='table-responsive'>
              <table className='common-rule-table'>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Rule</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? (<SkeletonTable numberOfColumns={7} />)
                    : (
                      <Fragment>
                        {list && list?.length !== 0 && list?.map((data, i) => (
                          <tr key={data?._id}>
                            <td>{(index - 1) * offset + (i + 1)}</td>
                            <td>
                              <CustomInput
                                checked={data?.eStatus === 'Y'}
                                disabled={adminPermission?.RULE === 'R'}
                                // id={`switch${i + 1}`}
                                id={'switch' + (i + 1)}
                                // name={`switch${i + 1}`}
                                name={'switch' + (i + 1)}
                                onClick={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                                type='switch'
                              />
                            </td>
                            <td>{data?.sRuleName || '--'}</td>
                            <td>{data?.sDescription || '--'}</td>
                            <td>
                              {data?.nAmount}
                              {(data?.eRule === 'PLC' || data?.eRule === 'LCC' || data?.eRule === 'LCG' || data?.eRule === 'NULJD' || data?.eRule === 'FLJ') && ' %'}
                            </td>
                            <td>{(data?.eRule === 'LCG') ? '--' : data?.eType === 'B' ? 'Bonus' : data?.eType === 'D' ? 'Deposit' : data?.eType === 'W' ? 'Withdraw' : 'Cash'}</td>
                            <td>
                              <ul className='action-list mb-0 d-flex'>
                                <li>
                                  <Link color='link' to={'/settings/common-rules-details/' + data?._id}>
                                    <Button className='edit-btn-icon'>
                                      <img alt="View" src={editButton} />
                                    </Button>
                                  </Link>
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
            )
          }

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={onCancel} type='submit'>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button className='theme-btn danger-btn full-btn' onClick={onStatusUpdate} type='submit'>
                {`${type} It`}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </Fragment>
  )
})

CommonRuleList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  rulesList: PropTypes.arrayOf(PropTypes.object),
  getList: PropTypes.func,
  isLoading: PropTypes.bool,
  offset: PropTypes.number,
  setOffset: PropTypes.func,
  start: PropTypes.number,
  setStart: PropTypes.func
}

CommonRuleList.displayName = CommonRuleList
export default connect(null, null, null, { forwardRef: true })(CommonRuleList)
