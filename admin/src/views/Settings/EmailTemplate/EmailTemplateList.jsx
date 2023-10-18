import React, { Fragment, useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { Button, Col, CustomInput, Modal, ModalBody, Row } from 'reactstrap'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import warningIcon from '../../../assets/images/error-warning.svg'
import editButton from '../../../assets/images/edit-pen-icon.svg'

import SkeletonTable from '../../../components/SkeletonTable'
import AlertMessage from '../../../components/AlertMessage'
import DataNotFound from '../../../components/DataNotFound'
import { modalMessageFunc } from '../../../helpers/helper'
import updateEmailTemplate from '../../../api/emailTemplate/updateEmailTemplate'

const EmailTemplateList = forwardRef((props, ref) => {
  const { templatesList, isLoading } = props
  const queryClient = useQueryClient()
  const exporter = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const [list, setList] = useState([])
  const [offset] = useQueryState('pageSize', 10)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [index] = useState(1)
  const [close, setClose] = useState(false)
  const [selectedData, setSelectedData] = useState({})
  const [type, setType] = useState('')
  const [modalWarning, setModalWarning] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const toggleWarning = () => setModalWarning(!modalWarning)
  const token = useSelector(state => state?.auth?.token)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const resStatus = useSelector(state => state?.users?.resStatus)
  const resMessage = useSelector(state => state?.users?.resMessage)
  const previousProps = useRef({ templatesList, resMessage, resStatus }).current

  // update Email Template Query
  const { mutate: updateEmailTemplateFun } = useMutation(updateEmailTemplate, {
    onSuccess: (response) => {
      setMessage(response?.data?.message)
      setModalMessage(true)
      setStatus(true)
      queryClient.invalidateQueries({ queryKey: ['getEmailTemplateList'] })
    }
  })

  useEffect(() => {
    if (location?.state?.message) {
      setMessage(location?.state?.message)
      setStatus(true)
      setModalMessage(true)
    }
    navigate(history)
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (templatesList?.length) {
      setList(templatesList)
    }
    return () => {
      previousProps.templatesList = templatesList
    }
  }, [templatesList])

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
  // update status from list and dispatch action
  function onStatusUpdate () {
    const status = selectedData?.eStatus === 'Y' ? 'N' : 'Y'
    const updatedOfferData = {
      Title: selectedData?.sTitle,
      Slug: selectedData?.sSlug,
      Description: selectedData?.sDescription,
      Subject: selectedData?.sSubject,
      Content: selectedData?.sContent,
      EmailStatus: status,
      token,
      ID: selectedData?._id
    }
    updateEmailTemplateFun(updatedOfferData)
    toggleWarning()
    setSelectedData({})
  }

  // Export Excel Report List
  const processExcelExportData = data => data?.map((emailTemplateList) => {
    let eStatus = emailTemplateList?.eStatus
    eStatus = eStatus === 'Y' ? 'Active' : 'InActive'
    let sContent = document?.createElement('div')
    sContent.innerHTML = emailTemplateList?.sContent
    sContent = sContent?.innerText
    return {
      ...emailTemplateList,
      eStatus,
      sContent
    }
  })

  function onExport () {
    const { length } = list
    if (length !== 0) {
      exporter.current.props = { ...exporter?.current?.props, data: processExcelExportData(list), fileName: 'EmailTemplates.xlsx' }
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
      <ExcelExport ref={exporter} data={list} fileName="EmailTemplates.xlsx">
        <ExcelExportColumn field="eStatus" title="Status" />
        <ExcelExportColumn field="sTitle" title="Title" />
        <ExcelExportColumn field="sSlug" title="Slug" />
        <ExcelExportColumn field="sSubject" title="Subject" />
        <ExcelExportColumn field="sDescription" title="Description" />
        <ExcelExportColumn field="sContent" title="Content" />
      </ExcelExport>
      {
      !isLoading && list?.length === 0
        ? (<DataNotFound message="Email" obj=""/>)
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="edit-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Status</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Subject</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading
                    ? <SkeletonTable numberOfColumns={7} />
                    : (
                      <Fragment>
                        {
                    list && list?.length !== 0 && list?.map((data, i) => (
                      <tr key={data?._id}>
                        <td>{(((index - 1) * offset) + (i + 1))}</td>
                        <td>
                          <CustomInput
                            key={'key' + data?._id}
                            checked={data?.eStatus === 'Y'}
                            disabled={adminPermission?.EMAIL_TEMPLATES === 'R'}
                            id={'id' + data?._id}
                            name={'name' + data?._id}
                            onChange={() => warningWithConfirmMessage(data, data?.eStatus === 'Y' ? 'Inactivate' : 'Activate')}
                            type='switch'
                          />
                        </td>
                        <td>{data?.sTitle || '--'}</td>
                        <td>{data?.sSlug || '--'}</td>
                        <td>{data?.sSubject || '--'}</td>
                        <td>{data?.sDescription || '--'}</td>
                        <td>
                          <ul className="action-list mb-0 d-flex">
                            <li>
                              <NavLink className="view" color="link" to={'/settings/template-details/' + data?.sSlug}>
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

      <Modal className="modal-confirm" isOpen={modalWarning} toggle={toggleWarning}>
        <ModalBody className='text-center'>
          <img alt='check' className='info-icon' src={warningIcon} />
          <h2 className='popup-modal-message'>{`Are you sure you want to ${type} it?`}</h2>
          <Row className='row-12'>
            <Col>
              <Button className='theme-btn outline-btn-cancel full-btn-cancel' onClick={toggleWarning} type='submit'>Cancel</Button>
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

EmailTemplateList.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  templatesList: PropTypes.arrayOf(PropTypes.object),
  getList: PropTypes.func,
  isLoading: PropTypes.bool
}

EmailTemplateList.displayName = EmailTemplateList
export default connect(null, null, null, { forwardRef: true })(EmailTemplateList)
