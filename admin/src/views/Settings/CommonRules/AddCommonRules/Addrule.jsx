/* eslint-disable react/jsx-no-undef */
import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'
import { connect, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from '@tanstack/react-query'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'
import getRuleDetails from '../../../../api/commonRule/querie/getRuleDetails'
import updateRule from '../../../../api/commonRule/querie/updateRule'

import { isPositive, isNumber, verifyLength, modalMessageFunc } from '../../../../helpers/helper'
import { getRewardsList } from '../../../../actions/rule'

const Addrule = forwardRef((props, ref) => {
  const { setSubmitDisableButton, adminPermission } = props
  const [selectRule, setselectRule] = useState('')
  const [ruleShortName, setRuleShortName] = useState('RB')
  const [description, setDescription] = useState('')
  const [amount, setamount] = useState(0)
  const [Type, setType] = useState('')
  const [kycDocType, setKycDocType] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [reward, setReward] = useState('')
  const [rewardErr, setRewardErr] = useState('')
  const [expiryDays, setExpiryDays] = useState(0)
  const [minValue, setminValue] = useState(0)
  const [maxValue, setmaxValue] = useState(0)
  const [ReferActive, setReferActive] = useState('N')
  const [erramount, seterramount] = useState('')
  const [errminValue, seterrminValue] = useState('')
  const [errmaxValue, seterrmaxValue] = useState('')
  const [errDate, seterrDate] = useState('')
  // const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [RuleId, setRuleId] = useState('')
  const [close, setClose] = useState(false)

  // const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: RuleDetails, isLoading } = useQuery({
    queryKey: ['getRuleDetailsById', id],
    queryFn: () => getRuleDetails(id),
    enabled: !!id,
    select: (response) => response?.data?.data
  })

  const { data: rewardsList } = useQuery({
    queryKey: ['getRewardsList'],
    queryFn: () => getRewardsList(),
    select: (res) => res?.data?.data
  })
  const { mutate: updateRuleFun } = useMutation(updateRule, {
    onSuccess: (data) => {
      navigate('/settings/common-rules', { state: { message: data?.data?.message } })
    }
  })
  const token = useSelector(state => state?.auth?.token)
  // const rewardsList = useSelector(state => state.rule.rewardsList)
  const resStatus = useSelector(state => state?.rule?.resStatus)
  const resMessage = useSelector(state => state?.rule?.resMessage)
  const previousProps = useRef({ RuleDetails, resStatus, resMessage })?.current
  const [modalMessage, setModalMessage] = useState(false)

  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = RuleDetails && previousProps?.RuleDetails !== RuleDetails && RuleDetails?.eRule === ruleShortName && RuleDetails?.sRuleName === selectRule && RuleDetails?.eType === Type &&
                        RuleDetails?.nAmount === amount && RuleDetails?.eStatus === ReferActive && RuleDetails?.nExpireDays === parseInt(expiryDays) && RuleDetails?.sRewardOn === reward

  useEffect(() => {
    setSubmitDisableButton(submitDisable)
  }, [submitDisable])

  // set timeout to remove pop up success/error message after given interval
  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to handle response
  useEffect(() => {
    if (previousProps?.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus) {
          navigate('/settings/common-rules', { state: { message: resMessage } })
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // for set Rule Details
  useEffect(() => {
    if (RuleDetails) {
      setRuleId(RuleDetails?._id)
      setselectRule(RuleDetails?.sRuleName)
      setRuleShortName(RuleDetails?.eRule)
      setamount(RuleDetails?.nAmount)
      setType(RuleDetails?.eType)
      setminValue(RuleDetails?.nMin)
      setmaxValue(RuleDetails?.nMax)
      setExpiryDays(RuleDetails?.nExpireDays)
      setReward(RuleDetails?.sRewardOn || '')
      setReferActive(RuleDetails?.eStatus)
      setDescription(RuleDetails?.sDescription || '')
      setKycDocType(RuleDetails?.sKYCDoc)
    }
    return () => {
      previousProps.RuleDetails = RuleDetails
    }
  }, [RuleDetails])

  // for Validate the field and dispatch action
  function onSubmit (e) {
    const rrValidation = selectRule && ruleShortName && isPositive(amount) && reward && ReferActive && verifyLength(Type, 1)
    const rCBValidation = selectRule && ruleShortName && isPositive(amount) && Type && ReferActive
    const kycValidation = selectRule && ruleShortName && kycDocType
    const validation = ruleShortName === 'RR' ? rrValidation : ruleShortName === 'KYCDOC' ? kycValidation : rCBValidation
    if (validation) {
      const updateRuleData = {
        Id: RuleId,
        sRuleName: selectRule,
        eRule: ruleShortName,
        nAmount: amount,
        eType: Type,
        nExpireDays: expiryDays,
        eStatus: ReferActive,
        sRewardOn: reward,
        sKYCDoc: kycDocType,
        token
      }
      updateRuleFun(updateRuleData)
    } else {
      if (!verifyLength(Type, 1)) {
        setTypeErr('Required field')
      }
      if (!amount) {
        seterramount('Required field')
      }
      if (!verifyLength(reward, 1)) {
        setRewardErr('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    onSubmit
  }))

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'maxValue':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            seterrmaxValue('')
          } else {
            seterrmaxValue('Required field')
          }
          setmaxValue(event?.target?.value)
        }
        break
      case 'minValue':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            seterrminValue('')
          } else {
            seterrminValue('Required field')
          }
          setminValue(event?.target?.value)
        }
        break
      case 'amount':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value > 0) {
            seterramount('')
          } else {
            seterramount('Required field')
          }
          setamount(event?.target?.value)
        }
        break
      case 'selectRule':
        setselectRule(event?.target?.value)
        break
      case 'Type':
        if (verifyLength(event?.target?.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setType(event?.target?.value)
        break
      case 'ReferActive':
        setReferActive(event?.target?.value)
        break
      case 'expiryDays':
        if (isNumber(event?.target?.value)) {
          if (event?.target?.value < 0) {
            seterrDate('Must be positive')
          } else {
            seterrDate('')
          }
        }
        setExpiryDays(event?.target?.value)
        break
      case 'Reward':
        if (verifyLength(event?.target?.value, 1)) {
          setRewardErr('')
        } else {
          setRewardErr('Required field')
        }
        setReward(event?.target?.value)
        break
      case 'kycDocType':
        setKycDocType(event?.target?.value)
        break
      default:
        break
    }
  }

  return (
    <main className="main-content">
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {isLoading && <Loading />}
      <section className="common-form-block">
        <Form>
          <Row>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="selectRule">Rule</Label>
                <InputGroupText>{selectRule}</InputGroupText>
              </FormGroup>
            </Col>
            <Col md={12} xl={12} className='mt-3'>
              <FormGroup>
                <Label className='edit-label-setting' for="ruleShortName">Key</Label>
                <InputGroupText>{ruleShortName}</InputGroupText>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            {ruleShortName !== 'AKYC' && ruleShortName !== 'KYCDOC' && ruleShortName !== 'KYCM' && (
            <Col md={ruleShortName === 'LCG' ? 12 : 12} xl={ruleShortName === 'LCG' ? 12 : 12} className='mt-3' >
              <FormGroup>
                <Label className='edit-label-setting' for="amount">
                  {
                    (ruleShortName === 'PLC' || ruleShortName === 'LCC' || ruleShortName === 'FLJ' || ruleShortName === 'NULJD')
                      ? (
                        <span>
                          Amount (%)
                          <span className="required-field">*</span>
                        </span>
                        )
                      : (
                        <span>
                          Amount
                          <span className="required-field">*</span>
                        </span>
                        )
                  }
                </Label>
                <Input
                  className={erramount ? 'league-placeholder-error ' : 'league-placeholder'}
                  disabled={adminPermission?.RULE === 'R'}
                  name="amount"
                  onChange={event => handleChange(event, 'amount')}
                  placeholder="amount"
                  type="text"
                  value={amount}
                />
                <p className="error-text">{erramount}</p>
              </FormGroup>
            </Col>
            )}
            {ruleShortName !== 'LCG' && (
              <Col md={ruleShortName === 'RR' ? 12 : 12} xl={ruleShortName === 'RR' ? 12 : 12} className='mt-3'>
                <FormGroup>
                  <Label className='edit-label-setting' for="Type">
                    Type
                    <RequiredField/>
                  </Label>
                  <CustomInput
                    className={typeErr ? 'league-placeholder-error ' : 'form-control'}
                    disabled={adminPermission?.RULE === 'R'}
                    name="Type"
                    onChange={event => handleChange(event, 'Type')}
                    type="select"
                    value={Type}
                  >
                    {
                      (ruleShortName === 'PLC')
                        ? <option value="C">Cash</option>
                        : (ruleShortName === 'KYCM' || ruleShortName === 'AKYC' || ruleShortName === 'KYCDOC' || ruleShortName === 'KYCWL')
                            ? <option value="W">Withdraw</option>
                            : (ruleShortName === 'BB')
                                ? <option value="B">Bonus</option>
                                : ruleShortName === 'LCC'
                                  ? (
                                    <Fragment>
                                      <option value=''>Select type</option>
                                      <option value="B">Bonus</option>
                                      <option value="C">Cash(Win)</option>
                                      <option value="D">Deposit</option>
                                    </Fragment>
                                    )
                                  : (ruleShortName === 'RCB' || ruleShortName === 'RR' || ruleShortName === 'RB' || ruleShortName === 'FLJ' || ruleShortName === 'NULJD')
                                      ? (
                                        <Fragment>
                                          <option value=''>Select type</option>
                                          <option value="B">Bonus</option>
                                          <option value="C">Cash</option>
                                        </Fragment>
                                        )
                                      : ''
                    }
                  </CustomInput>
                  <p className="error-text">{typeErr}</p>
                </FormGroup>
              </Col>
            )}
          </Row>
          {
            ruleShortName === 'KYCDOC' && (
              <Row>
                <Col className='mt-3' md={12} xl={12}>
                  <FormGroup>
                    <Label className='edit-label-setting' for="Reward">
                      Type
                      <RequiredField/>
                    </Label>
                    <CustomInput
                      className="form-control"
                      disabled={adminPermission?.RULE === 'R'}
                      name="kycDocType"
                      onChange={event => handleChange(event, 'kycDocType')}
                      type="select"
                      value={kycDocType}
                    >
                      <option value="">Select Reward</option>
                      <option value="A">AadhaarCard</option>
                      <option value="P"> Pancard</option>
                    </CustomInput>
                  </FormGroup>
                </Col>
              </Row>
            )
          }
          {ruleShortName === 'RR' && (
          <Row>
            <Col className='mt-3' md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Reward">
                  Reward
                  <RequiredField/>
                </Label>
                <CustomInput
                  className={rewardErr ? 'league-placeholder-error ' : 'form-control'}
                  disabled={adminPermission?.RULE === 'R'}
                  name="Reward"
                  onChange={event => handleChange(event, 'Reward')}
                  type="select"
                  value={reward}
                >
                  <option value="">Select Reward</option>
                  {
                rewardsList && rewardsList?.length !== 0 && rewardsList?.map((data, i) => {
                  return (
                    <option key={data} value={data}>{data}</option>
                  )
                })
              }
                </CustomInput>
                <p className="error-text">{rewardErr}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {
            (ruleShortName === 'DB')
              ? (
                <Fragment>
                  <FormGroup>
                    <Label className='edit-label-setting' for="minValue">Min Value</Label>
                    <Input
                      className={errminValue ? 'league-placeholder-error ' : 'form-control'}
                      disabled={adminPermission?.RULE === 'R'}
                      name="minValue"
                      onChange={event => handleChange(event, 'minValue')}
                      placeholder="minValue"
                      type="text"
                      value={minValue}
                    />
                    <p className="error-text">{errminValue}</p>
                  </FormGroup>
                  <FormGroup>
                    <Label className='edit-label-setting' for="maxValue">Max Value</Label>
                    <Input className={errmaxValue ? 'league-placeholder-error ' : 'form-control'}
                      disabled={adminPermission?.RULE === 'R'}
                      name="maxValue"
                      onChange={event => handleChange(event, 'maxValue')}
                      placeholder="maxValue"
                      type='text'
                      value={maxValue}
                    />
                    <p className="error-text">{errmaxValue}</p>
                  </FormGroup>
                </Fragment>
                )
              : null
          }
          {
            (ruleShortName === 'PLC' || ruleShortName === 'LCC' || ruleShortName === 'LCG')
              ? null
              : (
                <Fragment>
                  {
                    Type === 'B' && (
                    <Row>
                      <Col className='mt-3' md={12} xl={12}>
                        <FormGroup>
                          <Label className='edit-label-setting' for="expiredDATE">Expiry Days</Label>
                          <Input
                            className={errDate ? 'league-placeholder-error ' : 'form-control'}
                            disabled={adminPermission?.RULE === 'R'}
                            name="expiredDATE"
                            onChange={event => handleChange(event, 'expiryDays')}
                            placeholder="Expiry Days"
                            type="number"
                            value={expiryDays}
                          />
                          <p className="error-text">{errDate}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    )
                  }
                </Fragment>
                )
          }
          {description && (
            <Row>
              <Col className='mt-3' md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="Description">Description</Label>
                  <Input className='read-only-class' readOnly type='textarea' value={description} />
                </FormGroup>
              </Col>
            </Row>
          )}

          <Row className='p-3 mt-3'>
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting' for="Active">Status</Label>
                  <div className="d-flex inline-input mt-2">
                    <CustomInput
                      checked={ReferActive === 'Y'}
                      disabled={adminPermission?.RULE === 'R'}
                      id="ReferActive1"
                      label="Active"
                      name="contentRadio"
                      onClick={event => handleChange(event, 'ReferActive')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={ReferActive !== 'Y'}
                      disabled={adminPermission?.RULE === 'R'}
                      id="ReferActive2"
                      label="In Active"
                      name="contentRadio"
                      onClick={event => handleChange(event, 'ReferActive')}
                      type="radio"
                      value="N"
                    />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>
        </Form>
      </section>
    </main>
  )
})

Addrule.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  setSubmitDisableButton: PropTypes.func,
  adminPermission: PropTypes.string
}
Addrule.displayName = Addrule
export default connect(null, null, null, { forwardRef: true })(Addrule)
