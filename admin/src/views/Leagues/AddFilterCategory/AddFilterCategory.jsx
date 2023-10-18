import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loading from '../../../components/Loading'
import AlertMessage from '../../../components/AlertMessage'
import RequiredField from '../../../components/RequiredField'

import { modalMessageFunc, verifyLength } from '../../../helpers/helper'

const AddFilterCategory = forwardRef((props, ref) => {
  const {
    AddNewLeagueCategory, UpdateLeagueCategory, FilterCategoryDetails, setIsEdit, setSubmitDisableButton, Title, setTitle, Remark, setRemark, adminPermission
  } = props
  const navigate = useNavigate()
  const { id } = useParams()
  const [errTitle, seterrTitle] = useState('')
  const [errRemark, seterrRemark] = useState('')
  const [loading, setLoading] = useState(false)
  const [isCreate, setIsCreate] = useState(true)
  const [message, setMessage] = useState('')
  const [close, setClose] = useState(false)
  const [status, setStatus] = useState(false)
  const resStatus = useSelector(state => state.leaguecategory.resStatus)
  const resMessage = useSelector(state => state.leaguecategory.resMessage)
  const previousProps = useRef({ resStatus, resMessage, FilterCategoryDetails }).current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = FilterCategoryDetails && previousProps.FilterCategoryDetails !== FilterCategoryDetails && FilterCategoryDetails.sTitle === Title && FilterCategoryDetails.sRemark === Remark

  useEffect(() => {
    if (id) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  // to handle response
  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          navigate(`${props.cancelLink}`, { state: { message: resMessage } })
        } else {
          if (resStatus) {
            setIsEdit(false)
          }
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // use effect to set filter category details
  useEffect(() => {
    if (previousProps.FilterCategoryDetails !== FilterCategoryDetails) {
      if (FilterCategoryDetails) {
        setTitle(FilterCategoryDetails.sTitle ? FilterCategoryDetails.sTitle : '')
        setRemark(FilterCategoryDetails.sRemark ? FilterCategoryDetails.sRemark : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.FilterCategoryDetails = FilterCategoryDetails
    }
  }, [FilterCategoryDetails])

  // handleChange function to handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (!event?.target?.value) {
          seterrTitle('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          seterrTitle('No Initial Space Allowed')
        } else {
          seterrTitle('')
        }
        setTitle(event.target.value.trimStart())
        break
      case 'Remark':
        if (!event?.target?.value) {
          seterrRemark('Required field')
        } else if (event?.target?.value.trimStart().length === 0) {
          seterrRemark('No Initial Space Allowed')
        } else {
          seterrRemark('')
        }
        setRemark(event.target.value.trimStart())
        break
      default:
        break
    }
  }

  // onSubmit function for validate the fields and to dispatch action
  function onSubmit (e) {
    if (Title.trimStart() && Remark.trimStart() && !errTitle && !errRemark) {
      if (isCreate) {
        AddNewLeagueCategory(Title, Remark)
      } else {
        UpdateLeagueCategory(Title, Remark)
      }
      setLoading(true)
    } else {
      if (!verifyLength(Remark, 1)) {
        seterrRemark('Required field')
      }
      if (!verifyLength(Title, 1)) {
        seterrTitle('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  return (
    <main className="main-content">
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {loading && <Loading />}
      <section className="common-form-block">
        <Form>
          <Row>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Title">
                  Title
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errTitle ? 'league-placeholder-error ' : 'league-placeholder'}
                  disabled={adminPermission?.LEAGUE === 'R'}
                  name="Title"
                  onChange={event => handleChange(event, 'Title')}
                  placeholder="Enter Title"
                  type="text"
                  value={Title}
                />
                <p className="error-text">{errTitle}</p>
              </FormGroup>
            </Col>
          </Row>

          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Remark">
                  Remark
                  {' '}
                  <RequiredField/>
                </Label>
                <Input className={errRemark ? 'league-placeholder-error ' : 'league-placeholder'}
                  disabled={adminPermission?.LEAGUE === 'R'}
                  name="Remark"
                  onChange={event => handleChange(event, 'Remark')}
                  placeholder="Enter Remark"
                  type="text"
                  value={Remark}
                />
                <p className="error-text">{errRemark}</p>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </section>
    </main>
  )
})

AddFilterCategory.propTypes = {
  cancelLink: PropTypes.string,
  AddNewLeagueCategory: PropTypes.string,
  UpdateLeagueCategory: PropTypes.string,
  FilterCategoryDetails: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object,
  setIsEdit: PropTypes.func,
  setSubmitDisableButton: PropTypes.func,
  Title: PropTypes.string,
  setTitle: PropTypes.func,
  Remark: PropTypes.string,
  setRemark: PropTypes.func,
  adminPermission: PropTypes.string

}
AddFilterCategory.displayName = AddFilterCategory
export default connect(null, null, null, { forwardRef: true })(AddFilterCategory)
