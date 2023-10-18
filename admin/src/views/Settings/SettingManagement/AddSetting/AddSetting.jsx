import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Form, FormGroup, Label, Input, CustomInput, InputGroupText, Row, Col } from 'reactstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import PropTypes from 'prop-types'

import removeImg from '../../../../assets/images/ep-close.svg'
import documentPlaceholder from '../../../../assets/images/upload-icon.svg'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { verifyLength, isPositive, isNumber, modalMessageFunc, isFloat, acceptFormat } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'
import getCurrencyData from '../../../../api/AddSetting/getCurrencyData'
import getSettingDetails from '../../../../api/AddSetting/getSettingDetails'
import updateSetting from '../../../../api/settingManagement/updateSetting'
import getSideBackgroundImage from '../../../../api/AddSetting/getSideBackgroundImage'
import submitSiteSideBackgroundImage from '../../../../api/AddSetting/submitSiteSideBackgroundImage'
import { updateCurrencyDetails } from '../../../../actions/setting'

const AddSetting = forwardRef((props, ref) => {
  const { adminPermission, Auth, setSubmitDisableButton, Key, setKey } = props
  const { id } = useParams()
  const [creatorBonusType, setCreatorBonusType] = useState('')
  const [valueErr, setValueErr] = useState('')
  const [typeErr, setTypeErr] = useState('')
  const [backgroundImage, setBackgroundImage] = useState('')
  const [sideImage, setSideImage] = useState('')
  const [errImage, setErrImage] = useState('')
  const [url, setUrl] = useState('')
  const [shortName, setShortName] = useState('')
  const [logo, setLogo] = useState('')
  const [description, setDescription] = useState('')
  const [errShortname, setErrShortname] = useState('')
  const [errLogo, setErrLogo] = useState('')
  const [Title, setTitle] = useState('')
  const [Max, setMax] = useState(0)
  const [Min, setMin] = useState(0)
  const [errTitle, setErrTitle] = useState('')
  const [errKey, setErrKey] = useState('')
  const [errMax, setErrMax] = useState('')
  const [errMin, setErrMin] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [settingId, setSettingId] = useState('')
  const [close, setClose] = useState(false)
  const [settingStatus, setSettingStatus] = useState('N')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(state => state?.auth?.token)
  // const settingDetails = useSelector(state => state.setting.settingDetails)
  // const sideBgImage = useSelector(state => state.setting.sideBgImage)
  const resStatus = useSelector(state => state?.setting?.resStatus)
  const resMessage = useSelector(state => state?.setting?.resMessage)
  const getUrlLink = useSelector(state => state?.url?.getUrl)
  // const currencyDetails = useSelector(state => state.setting.currencyDetails)
  const previousProps = useRef({ resStatus, resMessage, Key })?.current
  const page = JSON?.parse(localStorage?.getItem('queryParams'))
  const [modalMessage, setModalMessage] = useState(false)

  //  fetching setting Details by id
  const { data: settingDetails } = useQuery({
    queryKey: ['getSettingDetails', id],
    queryFn: () => getSettingDetails(id),
    select: (res) => res?.data?.data
  })

  const { mutate: updateSettingFun } = useMutation(updateSetting, {
    onSuccess: (res) => {
      navigate(`/settings/setting-management${page?.SettingManagement || ''}`, { state: { message: res?.data?.message } })
    }
  })

  const { mutate: submitSiteSideBackgroundImageFun } = useMutation(submitSiteSideBackgroundImage, {
    onSuccess: (res) => {
      navigate(`/settings/setting-management${page?.SettingManagement || ''}`, { state: { message: res?.data?.message } })
    }
  })
  const { data: sideBgImage } = useQuery({
    queryKey: ['getSideBgImage', Key],
    queryFn: () => getSideBackgroundImage(Key),
    select: (res) => res?.data?.data,
    enabled: !!(Key === 'BG' || Key === 'IMG')
  })
  // through this condition if there is no changes in at update time submit button will remain disable
  const submitDisable = settingDetails && previousProps?.settingDetails !== settingDetails && settingDetails?.sTitle === Title && settingDetails?.nMax === parseInt(Max) && settingDetails?.nMin === parseInt(Min) && settingDetails?.eStatus === settingStatus
  const TDSDisable = settingDetails && previousProps?.settingDetails !== settingDetails && settingDetails?.sTitle === Title && settingDetails?.nMax === parseFloat(Max) && settingDetails?.nMin === parseFloat(Min) && settingDetails?.eStatus === settingStatus
  const bgImageDisable = (settingDetails && previousProps?.settingDetails !== settingDetails && settingDetails?.sImage === backgroundImage) || errImage
  const sideImgDisable = (settingDetails && previousProps?.settingDetails !== settingDetails && settingDetails?.sImage === sideImage) || errImage
  const currencyDisable = settingDetails && previousProps?.settingDetails !== settingDetails && settingDetails?.sShortName === shortName && settingDetails?.sLogo === logo
  const streamDisable = settingDetails && previousProps?.settingDetails !== settingDetails && settingDetails?.eStatus === settingStatus && settingDetails?.sTitle === Title
  const creatorBonusDisable = settingDetails && settingDetails?.sValue === creatorBonusType && settingDetails?.eStatus === settingStatus
  const buttonDisable = Key === 'BG' ? bgImageDisable : '' || Key === 'IMG' ? sideImgDisable : '' || Key === 'STREAM_BUTTON' ? streamDisable : '' || Key === 'CURRENCY' ? currencyDisable : Key === 'TDS' ? TDSDisable : Key === 'CREATOR_BONUS' ? creatorBonusDisable : submitDisable

  const { data: currencyDetails } = useQuery({
    queryKey: ['getCurrencyDetails'],
    queryFn: () => getCurrencyData(),
    select: (res) => res?.data?.data,
    enabled: !!(Key === 'CURRENCY')
  })

  useEffect(() => {
    if (id) {
      // dispatch action to get settings details
      // dispatch(getSettingDetails(id, token))
      setSettingId(id)
      setLoading(true)
    }
  }, [])

  useEffect(() => {
    setSubmitDisableButton(buttonDisable)
  }, [buttonDisable])

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
          navigate(`/settings/setting-management${page?.SettingManagement || ''}`, { state: { message: resMessage } })
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resMessage, resStatus])

  //  set currency details
  useEffect(() => {
    // if (previousProps.currencyDetails !== currencyDetails) {
    if (currencyDetails) {
      setTitle(currencyDetails?.sTitle)
      setKey(currencyDetails?.sKey)
      setShortName(currencyDetails?.sShortName)
      setLogo(currencyDetails?.sLogo)
      setDescription(currencyDetails?.sDescription || '')
      setLoading(false)
    }
    // }
    return () => {
      previousProps.currencyDetails = currencyDetails
    }
  }, [currencyDetails])

  //  set settings details
  useEffect(() => {
    // if (previousProps.settingDetails !== settingDetails) {
    if (settingDetails) {
      setTitle(settingDetails?.sTitle)
      setKey(settingDetails?.sKey)
      setMax(settingDetails?.nMax || settingDetails?.sValue)
      setMin(settingDetails?.nMin)
      setSettingStatus(settingDetails?.eStatus)
      setDescription(settingDetails?.sDescription)
      setCreatorBonusType(settingDetails?.sValue || '')
      setLoading(false)
    }
    // }
    return () => {
      previousProps.settingDetails = settingDetails
    }
  }, [settingDetails])

  //  get image or currency data
  useEffect(() => {
    if (previousProps?.Key !== Key) {
      if (Key === 'BG' || Key === 'IMG') {
        // dispatch(getSideBackgroundImage(Key, token))
        if (!getUrlLink) {
          dispatch(getUrl('media'))
        }
      } else if (Key === 'CURRENCY') {
        // dispatch(getCurrencyData(token))
      }
    }
    return () => {
      previousProps.Key = Key
    }
  }, [Key])

  useEffect(() => {
    if (getUrlLink) {
      setUrl(getUrlLink)
    }
  }, [getUrlLink])

  //  set image
  useEffect(() => {
    if (sideBgImage) {
      sideBgImage?.sKey === 'BG' ? setBackgroundImage(sideBgImage?.sImage) : setSideImage(sideBgImage?.sImage)
    }
  }, [sideBgImage])

  // for handle onChange event
  function handleChange (event, type) {
    switch (type) {
      case 'Title':
        if (verifyLength(event?.target?.value, 1)) {
          setErrTitle('')
        } else {
          setErrTitle('Required field')
        }
        setTitle(event?.target?.value)
        break
      case 'Key':
        if (verifyLength(event?.target?.value, 1)) {
          setErrKey('')
        } else {
          setErrKey('Required field')
        }
        setKey(event?.target?.value)
        break
      case 'Value':
        if (settingDetails?.sKey === 'TDS') {
          if (isFloat(event?.target?.value) || !event?.target?.value) {
            if (event?.target?.value) {
              setErrMax('')
            } else {
              setErrMax('Required field')
            }
            setMax(event.target.value)
          }
        } else if (isNumber(event?.target?.value) || (!event?.target?.value)) {
          if (event?.target?.value) {
            setValueErr('')
          } else {
            setValueErr('Required field')
          }
          setMax(event?.target?.value)
          setMin(event?.target?.value)
        }
        break
      case 'Max':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event?.target?.value) {
            setErrMax('')
          } else {
            setErrMax('Required field')
          }
          setMax(event?.target?.value)
          if (parseInt(Min) && (parseInt(Min) > parseInt(event?.target?.value))) {
            setErrMax('Maximum amount should be greater than Minimum amount!')
          } else {
            setErrMax('')
            setErrMin('')
          }
        }
        break
      case 'Min':
        if (isNumber(event?.target?.value) || !event?.target?.value) {
          if (event.target?.value) {
            setErrMin('')
          } else {
            setErrMin('Required field')
          }
          setMin(event?.target?.value)
          if (parseInt(Max) && (parseInt(event?.target?.value) > parseInt(Max))) {
            setErrMin('Minimum amount should be less than Maximum amount!')
          } else {
            setErrMin('')
            setErrMax('')
          }
        }
        break
      case 'Status':
        setSettingStatus(event?.target?.value)
        break
      case 'Background':
        if ((event?.target?.files[0]?.size / 1024 / 1024)?.toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event?.target?.files[0] && event?.target?.files[0]?.type?.includes('image')) {
          setBackgroundImage({ imageURL: URL.createObjectURL(event?.target?.files[0]), file: event?.target?.files[0] })
          setErrImage('')
        }
        break
      case 'SideImage':
        if ((event?.target?.files[0]?.size / 1024 / 1024)?.toFixed(2) > 5) {
          setErrImage('Please select a file less than 5MB')
        } else if (event?.target?.files[0] && event?.target?.files[0]?.type?.includes('image')) {
          setSideImage({ imageURL: URL.createObjectURL(event?.target?.files[0]), file: event?.target?.files[0] })
          setErrImage('')
        }
        break
      case 'ShortName':
        if (verifyLength(event?.target?.value, 1)) {
          setErrShortname('')
        } else {
          setErrShortname('Required field')
        }
        setShortName(event?.target?.value)
        break
      case 'Logo':
        if (verifyLength(event?.target?.value, 1)) {
          setErrLogo('')
        } else {
          setErrLogo('Required field')
        }
        setLogo(event?.target?.value)
        break
      case 'CreatorBonusType':
        if (verifyLength(event?.target?.value, 1)) {
          setTypeErr('')
        } else {
          setTypeErr('Required field')
        }
        setCreatorBonusType(event?.target?.value)
        break
      case 'RemoveImage':
        setSideImage('')
        setBackgroundImage('')
        setErrImage('Required field')
        break
      default:
        break
    }
  }

  // to handle image error occurred during add time
  function onImageError (e) {
    e.target.src = documentPlaceholder
  }

  // for validate the field and dispatch action
  function onSubmit (e) {
    const streamButton = verifyLength(Title, 1) && verifyLength(Key, 1)
    const TDSButton = parseFloat(Max) && !valueErr
    const creatorBonusTypeButton = verifyLength(creatorBonusType, 1) && verifyLength(Title, 1)
    const other = isPositive(Max) && isNumber(Min) && (parseInt(Min) <= parseInt(Max)) && !errTitle && !errKey && !errMax && !errMin
    const validate = Key === 'STREAM_BUTTON' ? streamButton : Key === 'TDS' ? TDSButton : Key === 'CREATOR_BONUS' ? creatorBonusTypeButton : streamButton && other
    if (validate) {
      const updateSettingData = {
        settingId, Title, Key, Max, Min, settingStatus, creatorBonusType, token
      }
      updateSettingFun(updateSettingData)
      // dispatch(updateSetting(updateSettingData))
      setLoading(true)
    } else {
      if (Key === 'CREATOR_BONUS') {
        if (verifyLength(creatorBonusType, 1)) {
          setTypeErr('Required field')
        }
      }
      if (!verifyLength(Title, 1)) {
        setErrTitle('Required field')
      }
      if (!verifyLength(Key, 1)) {
        setErrKey('Required field')
      }
      if (parseInt(Max) < parseInt(Min)) {
        setErrMax('Maximum amount should be greater than Minimum Amount')
      }
      if (!isPositive(Max)) {
        setErrMax('Required field')
      }
      if (Min < 0) {
        setErrMin('Required field')
      }
    }
  }
  // for add image
  function imageSubmit (type) {
    if (backgroundImage && type === 'BG') {
      submitSiteSideBackgroundImageFun(backgroundImage, type)
      // dispatch(submitSiteSideBackgroundImage(backgroundImage, type, token))
    } else if (sideImage && type === 'IMG') {
      submitSiteSideBackgroundImageFun(sideImage, type)
      // dispatch(submitSiteSideBackgroundImage(sideImage, type, token))
    }
    setLoading(true)
  }

  // for update currendy data
  function updateCurrencyData () {
    if (shortName && logo && !errShortname && !errLogo) {
      const data = { Title, Key, shortName, logo, token }
      dispatch(updateCurrencyDetails(data))
    } else {
      if (!shortName) {
        setErrShortname('Required field')
      }
      if (!logo) {
        setErrLogo('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    updateCurrencyData, imageSubmit, onSubmit
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
                <Label className='edit-label-setting' for="Title">Title </Label>
                <InputGroupText>{Title}</InputGroupText>
                <p className="error-text">{errTitle}</p>
              </FormGroup>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Key">Key</Label>
                <InputGroupText>{Key}</InputGroupText>
              </FormGroup>
            </Col>
          </Row>

          {Key === 'CREATOR_BONUS' && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for='CreatorBonusType'>
                  Type
                  <RequiredField/>
                </Label>
                <CustomInput
                  className="form-control"
                  disabled={adminPermission?.SETTING === 'R'}
                  name="CreatorBonusType"
                  onChange={event => handleChange(event, 'CreatorBonusType')}
                  type="select"
                  value={creatorBonusType}
                >
                  <option value=''>Select type</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WIN">Win</option>
                  <option value="BONUS">Bonus</option>
                </CustomInput>
                <p className="error-text">{typeErr}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {Key === 'CURRENCY' && (
          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Title">
                  Shortname
                  <RequiredField/>
                </Label>
                <Input
                  disabled={adminPermission?.SETTING === 'R'}
                  name="Shortname"
                  onChange={event => handleChange(event, 'ShortName')}
                  placeholder="Enter Shortname"
                  value={shortName}
                />
                <p className="error-text">{errShortname}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Title">
                  Logo
                  <RequiredField/>
                </Label>
                <Input
                  disabled={adminPermission?.SETTING === 'R'}
                  name="Logo"
                  onChange={event => handleChange(event, 'Logo')}
                  placeholder="Enter Logo"
                  value={logo}
                />
                <p className="error-text">{errLogo}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {(Key === 'Deposit' || Key === 'PCF' || Key === 'PCS' || Key === 'PUBC' || Key === 'Withdraw' || Key === 'withdrawPermission') && (
          <Row className='mt-3'>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Min">
                  Min
                  <RequiredField/>
                </Label>
                <Input
                  disabled={adminPermission?.SETTING === 'R'}
                  name="Min"
                  onChange={event => handleChange(event, 'Min')}
                  placeholder="Enter Min"
                  type='number'
                  value={Min}
                />
                <p className="error-text">{errMin}</p>
              </FormGroup>
            </Col>
            <Col md={12} xl={6}>
              <FormGroup>
                <Label className='edit-label-setting' for="Max">
                  Max
                  <RequiredField/>
                </Label>
                <Input
                  disabled={adminPermission?.SETTING === 'R'}
                  name="Max"
                  onChange={event => handleChange(event, 'Max')}
                  placeholder="Enter Max"
                  type='number'
                  value={Max}
                />
                <p className="error-text">{errMax}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {((Key === 'BonusExpireDays') || (Key === 'UserDepositRateLimit') || (Key === 'UserDepositRateLimitTimeFrame') || (Key === 'TDS') || (Key === 'UserWithdrawRateLimit') || (Key === 'UserWithdrawRateLimitTimeFrame') || (Key === 'FIX_DEPOSIT1') || (Key === 'FIX_DEPOSIT2') || (Key === 'FIX_DEPOSIT3')) && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Value">
                  Value
                  <RequiredField/>
                </Label>
                <Input
                  disabled={adminPermission?.SETTING === 'R'}
                  name="Value"
                  onChange={event => handleChange(event, 'Value')}
                  placeholder="Enter Value"
                  type='number'
                  value={Max}
                />
                <p className="error-text">{valueErr}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {Key === 'BG' && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">
                    <div className={backgroundImage ? 'theme-img' : 'theme-img-default'}>
                      <img alt="themeImage" className={backgroundImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={backgroundImage ? backgroundImage.imageURL ? backgroundImage.imageURL : url + backgroundImage : documentPlaceholder} />
                      {backgroundImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {((Auth && Auth === 'SUPER') || (adminPermission?.SETTING === 'W')) && (
                      <CustomInput
                        accept={acceptFormat}
                        id="exampleCustomFileBrowser"
                        name="customFile"
                        onChange={event => handleChange(event, 'Background')}
                        type="file"
                      />
                      )}
                    </div>
                  </div>
                </div>
                <p className="error-text">{errImage}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {Key === 'IMG' && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <div className="theme-image text-center">
                  <div className="d-flex theme-photo">
                    <div className={sideImage ? 'theme-img' : 'theme-img-default'}>
                      <img alt="themeImage" className={sideImage ? 'custom-img' : 'custom-img-default'} onError={onImageError} src={sideImage ? sideImage.imageURL ? sideImage.imageURL : url + sideImage : documentPlaceholder} />
                      {sideImage && ((Auth && Auth === 'SUPER') || (adminPermission?.TEAM === 'W')) && <div className='remove-img-label'><img onClick={event => handleChange(event, 'RemoveImage')} src={removeImg} /></div>}
                      {((Auth && Auth === 'SUPER') || (adminPermission?.SETTING === 'W')) && (
                      <CustomInput
                        accept={acceptFormat}
                        id="exampleCustomFileBrowser"
                        name="customFile"
                        onChange={event => handleChange(event, 'SideImage')}
                        type="file"
                      />
                      )}
                    </div>
                  </div>
                </div>
                <p className="error-text">{errImage}</p>
              </FormGroup>
            </Col>
          </Row>
          )}

          {description && (
          <Row className='mt-3'>
            <Col md={12} xl={12}>
              <FormGroup>
                <Label className='edit-label-setting' for="Description">Description</Label>
                <Input className='read-only-class' readOnly type='textarea' value={description} />
              </FormGroup>
            </Col>
          </Row>
          )}

          {(Key !== 'BG' && Key !== 'IMG' && Key !== 'CURRENCY') && (
          <Row className='p-3 mt-3' >
            <div className='radio-button-div'>
              <Col md={12} xl={12}>
                <FormGroup>
                  <Label className='edit-label-setting'>Status</Label>
                  <div className="d-flex inline-input">
                    <CustomInput
                      checked={settingStatus === 'Y'}
                      disabled={(adminPermission?.SETTING === 'R') || (Key === 'PUBC' || Key === 'PCS' || Key === 'PCF')}
                      id="bannerRadio1"
                      label="Active"
                      name="bannerRadio"
                      onClick={event => handleChange(event, 'Status')}
                      type="radio"
                      value="Y"
                    />
                    <CustomInput
                      checked={settingStatus !== 'Y'}
                      disabled={(adminPermission?.SETTING === 'R') || (Key === 'PUBC' || Key === 'PCS' || Key === 'PCF')}
                      id="bannerRadio2"
                      label="In Active"
                      name="bannerRadio"
                      onClick={event => handleChange(event, 'Status')}
                      type="radio"
                      value="N"
                    />
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>
          )}
        </Form>
      </section>
    </main>
  )
})

AddSetting.defaultProps = {
  history: {}
}

AddSetting.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  }),
  match: PropTypes.object,
  adminPermission: PropTypes.object,
  setSubmitDisableButton: PropTypes.func,
  Auth: PropTypes.string,
  Key: PropTypes.string,
  setKey: PropTypes.func,
  navigate: PropTypes.object

}
AddSetting.displayName = AddSetting
export default connect(null, null, null, { forwardRef: true })(AddSetting)
