import React, { useState, useEffect, useRef, Fragment } from 'react'
import { FormGroup, Input, Label, Button, Form, InputGroupText } from 'reactstrap'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import { isNumber, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getValidationDetails, updateValidation } from '../../../../actions/validations'

function AddValidation (props) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ValidationId, setValidationId] = useState('')
  const [name, setName] = useState('')
  const [shortName, setShortName] = useState('')
  const [MaxValue, setMaxValue] = useState(0)
  const [MinValue, setMinValue] = useState(0)
  const [errName, setErrName] = useState('')
  const [errShortName, setErrShortName] = useState('')
  const [errMaxValue, setErrMaxValue] = useState('')
  const [errMinValue, setErrMinValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const dispatch = useDispatch()
  const token = useSelector(state => state.auth.token)
  const validationDetails = useSelector(state => state.validations.validationDetails)
  const resStatus = useSelector(state => state.validations.resStatus)
  const resMessage = useSelector(state => state.validations.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({ resStatus, resMessage, validationDetails }).current
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)
  const submitDisable = validationDetails && previousProps.validationDetails !== validationDetails && validationDetails.sName === name && validationDetails.nMin === MinValue && validationDetails.nMax === MaxValue

  useEffect(() => {
    if (id) {
      dispatch(getValidationDetails(id, token))
      setValidationId(id)
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate(`/settings/validation-management${page?.ValidationManagement || ''}`, { state: { message: resMessage } })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if (previousProps.validationDetails !== validationDetails) {
      if (validationDetails) {
        setName(validationDetails.sName)
        setShortName(validationDetails.sKey)
        setMaxValue(validationDetails.nMax)
        setMinValue(validationDetails.nMin)
        setLoading(false)
      }
    }
    return () => {
      previousProps.validationDetails = validationDetails
    }
  }, [validationDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'ShortName':
        if (verifyLength(event.target.value, 1)) {
          setErrShortName('')
        } else {
          setErrShortName('Required field')
        }
        setShortName(event.target.value)
        break
      case 'Max':
        if (event.target.value) {
          if (isNumber(event.target.value)) {
            setMaxValue(parseInt(event.target.value))
            if (parseInt(MinValue) && parseInt(MinValue) >= parseInt(event.target.value)) {
              setErrMaxValue('Maximum amount should be greater than Minimum amount!')
            } else {
              setErrMinValue('')
              setErrMaxValue('')
            }
          } else {
            setErrMaxValue('Must be number')
            setMaxValue(event.target.value)
          }
        } else {
          setErrMaxValue('Required field')
          setMaxValue(event.target.value)
        }
        break
      case 'Min':
        if (event.target.value) {
          if (isNumber(event.target.value)) {
            setMinValue(parseInt(event.target.value))
            if (parseInt(MaxValue) && parseInt(event.target.value) >= parseInt(MaxValue)) {
              setErrMinValue('Minimum amount should be less than Maximum amount!')
            } else {
              setErrMinValue('')
              setErrMaxValue('')
            }
          } else {
            setErrMinValue('Must be number')
            setMinValue(event.target.value)
          }
        } else {
          setErrMinValue('Required field')
          setMinValue(event.target.value)
        }
        break
      default:
        break
    }
  }

  function onSubmit (e) {
    e.preventDefault()
    if (verifyLength(name, 1) && verifyLength(shortName, 1) && MinValue && MaxValue && (parseInt(MinValue) < parseInt(MaxValue)) && !errName && !errShortName && !errMaxValue && !errMinValue) {
      const updateValidationData = {
        ValidationId, name, MaxValue, MinValue, token
      }
      dispatch(updateValidation(updateValidationData))
      setLoading(true)
    } else {
      if (!verifyLength(name, 1)) {
        setErrName('Required field')
      }
      if (!verifyLength(shortName, 1)) {
        setErrShortName('Required field')
      }
      if (parseInt(MaxValue) < parseInt(MinValue) || parseInt(MaxValue) === parseInt(MinValue)) {
        setErrMaxValue('Maximum amount should be greater than Minimum Amount')
      }
      if (!MaxValue) {
        setErrMaxValue('Required field')
      }
      if (!MinValue) {
        setErrMinValue('Required field')
      }
    }
  }

  return (
    <main className="main-content">
      {loading && <Loading />}
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <section className="common-form-block">
        <h2>Edit Validation</h2>
        <Form>
          <FormGroup>
            <Label for="name">Validation Name</Label>
            <Input
              disabled={adminPermission?.VALIDATION === 'R'}
              id="name"
              onChange={event => handleChange(event, 'Name')}
              placeholder="Enter Validation Name"
              type="text"
              value={name}
            />
            <p className="error-text">{errName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="shortName">Validation Short Name</Label>
            <InputGroupText>{shortName}</InputGroupText>
            <p className="error-text">{errShortName}</p>
          </FormGroup>
          <FormGroup>
            <Label for="minValue">Min Value</Label>
            <Input
              disabled={adminPermission?.VALIDATION === 'R'}
              id="minValue"
              onChange={event => handleChange(event, 'Min')}
              placeholder="Enter Min Value"
              type="text"
              value={MinValue}
            />
            <p className="error-text">{errMinValue}</p>
          </FormGroup>
          <FormGroup>
            <Label for="maxValue">Max Value</Label>
            <Input
              disabled={adminPermission?.VALIDATION === 'R'}
              id="maxValue"
              onChange={event => handleChange(event, 'Max')}
              placeholder="Enter Max Value"
              type="text"
              value={MaxValue}
            />
            <p className="error-text">{errMaxValue}</p>
          </FormGroup>
          {
            ((Auth && Auth === 'SUPER') || (adminPermission?.VALIDATION !== 'R')) &&
            (
              <Fragment>
                <Button className="theme-btn full-btn" disabled={submitDisable} onClick={onSubmit}>
                  Save Changes
                </Button>
              </Fragment>
            )
          }
        </Form>
        <div className="form-footer text-center small-text">
          <NavLink to={`/settings/validation-management${page?.ValidationManagement || ''}`}>Cancel</NavLink>
        </div>
      </section>
    </main>
  )
}

AddValidation.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
}

export default AddValidation
