import React, { useState, useEffect, useRef, Fragment, forwardRef, useImperativeHandle } from 'react'
import { useSelector, useDispatch, connect } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FormGroup, Input, Label, Button, Row, Col, CustomInput } from 'reactstrap'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { PrizeCalculate, RankCalculate, WinPrizeDistribution } from '../../../../actions/seriesLeaderBoard'

const AddSeriesLB = forwardRef((props, ref) => {
  const {
    AddNewSeries, UpdateSeries, seriesLeaderBoardDetails, seriesLeaderBoardCategory, GameCategoryList, setIsCreate, setIsEdit, isCreate, adminPermission
  } = props
  const { id } = useParams()
  const [SeriesName, setSeriesName] = useState('')
  const [SeriesInfo, setSeriesInfo] = useState('')
  const [Id, setId] = useState('')
  const [SeriesStatus, setSeriesStatus] = useState('P')
  const [SeriesGetStatus, setSeriesGetStatus] = useState('')
  const [errSeriesName, setErrSeriesName] = useState()
  const [gameCategoryErr, setGameCategoryErr] = useState('')
  const [GameCategory, setGameCategory] = useState('')
  const [close, setClose] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [seriesId, setSeriesId] = useState('')
  const token = useSelector(state => state.auth.token)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const previousProps = useRef({ seriesLeaderBoardDetails, resStatus, resMessage }).current
  const [modalMessage, setModalMessage] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      setSeriesId(id)
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
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

  useEffect(() => {
    if (previousProps.seriesLeaderBoardDetails !== seriesLeaderBoardDetails) {
      if (seriesLeaderBoardDetails) {
        setSeriesName(seriesLeaderBoardDetails.sName || '')
        setSeriesInfo(seriesLeaderBoardDetails.sInfo || '')
        setSeriesStatus(seriesLeaderBoardDetails.eStatus || '')
        setSeriesGetStatus(seriesLeaderBoardDetails.eStatus || '')
        setGameCategory(seriesLeaderBoardDetails.eCategory || '')
        setId(seriesLeaderBoardDetails._id)
        setLoading(false)
      }
    }
    return () => {
      previousProps.seriesLeaderBoardDetails = seriesLeaderBoardDetails
    }
  }, [seriesLeaderBoardDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'SeriesName':
        if (verifyLength(event.target.value, 1)) {
          setErrSeriesName('')
        } else {
          setErrSeriesName('Required field')
        }
        setSeriesName(event.target.value)
        break
      case 'SeriesInfo':
        setSeriesInfo(event.target.value)
        break
      case 'SeriesStatus':
        setSeriesStatus(event.target.value)
        break
      case 'GameCategory':
        if (verifyLength(event.target.value, 1)) {
          setGameCategoryErr('')
        } else {
          setGameCategoryErr('Required field')
        }
        setGameCategory(event.target.value)
        break
      default:
        break
    }
  }

  function Submit (e) {
    if (verifyLength(SeriesName, 1) && SeriesStatus && verifyLength(GameCategory, 1) && (!errSeriesName) && (!gameCategoryErr)) {
      if (isCreate) {
        AddNewSeries(SeriesName, SeriesInfo, GameCategory, SeriesStatus)
      } else {
        UpdateSeries(seriesId, SeriesName, SeriesInfo, GameCategory, SeriesStatus)
      }
      setLoading(true)
    } else {
      if (!verifyLength(SeriesName, 1)) {
        setErrSeriesName('Required field')
      }
      if (!verifyLength(GameCategory, 1)) {
        setGameCategoryErr('Required field')
      }
    }
  }

  useImperativeHandle(ref, () => ({
    Submit
  }))

  function Calculate (type) {
    if (type === 'RankCalculate') {
      dispatch(RankCalculate(id, token))
      setLoading(true)
    } else if (type === 'PrizeCalculate') {
      dispatch(PrizeCalculate(id, token))
      setLoading(true)
    } else if (type === 'WinPrizeDistribution') {
      dispatch(WinPrizeDistribution(id, token))
      setLoading(true)
    }
  }
  return (
    <Fragment>

      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {loading && <Loading />}
      <section className="common-form-block">

        <Row >
          <Col lg={12} md={12} xl={12}>
            <FormGroup>
              <Label className='edit-label-setting' for="SeriesName">
                Series Name
                {' '}
                <RequiredField/>
              </Label>
              <Input
                disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                id="SeriesName"
                onChange={event => handleChange(event, 'SeriesName')}
                placeholder="Enter Series Name"
                type="text"
                value={SeriesName}
              />
              <p className="error-text">{errSeriesName}</p>
            </FormGroup>
          </Col>
          <Col lg={12} md={12} xl={12}>
            <FormGroup>
              <Label className='edit-label-setting' for="SeriesInfo">Series Info</Label>
              <Input
                className='league-placeholder'
                disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                name="SeriesInfo"
                onChange={event => handleChange(event, 'SeriesInfo')}
                placeholder="Enter Series Info"
                type="text"
                value={SeriesInfo}
              />
            </FormGroup>
          </Col>
          <Col className='mt-3' lg={12} md={12} xl={12}>
            <FormGroup>
              <Label className='edit-label-setting' for="GameCategory">
                Game Category
                {' '}
                <RequiredField/>
              </Label>
              <CustomInput
                disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                id="GameCategory"
                name="select"
                onChange={event => handleChange(event, 'GameCategory')}
                type="select"
                value={GameCategory}
              >
                <option value=''>Select Game Category</option>
                {
                  GameCategoryList && GameCategoryList.length !== 0 && GameCategoryList.map((data, index) => {
                    return (
                      <option key={index} value={data.sKey}>{data?.sName}</option>
                    )
                  })
                }
              </CustomInput>
              <p className="error-text">{gameCategoryErr}</p>
            </FormGroup>
          </Col>
          <Col lg={12} md={12} xl={12}>
            <Label className='edit-label-setting' for="GameCategory">
              Status
              {' '}
              <RequiredField/>
              {' '}
            </Label>

            <CustomInput
              disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
              id="SeriesStatus"
              name="select"
              onChange={event => handleChange(event, 'SeriesStatus')}
              type="select"
              value={SeriesStatus}
            >
              <option value="P">Pending</option>
              <option value="L">Live</option>
              <option value="CMP">Completed</option>
            </CustomInput>
          </Col>

          <Col className='mt-3' lg={6} md={12} xl={6}>
            {
            SeriesGetStatus === 'L' && ((Auth && Auth === 'SUPER') || (adminPermission?.SERIES_LEADERBOARD === 'W')) && (
              <Fragment>
                <Button className="theme-btn-cancel w-100 " onClick={() => Calculate('RankCalculate')} >Rank Calculate</Button>
              </Fragment>
            )
          }
          </Col>
          <Col lg={ SeriesGetStatus === 'L' ? 6 : 12} md={12} xl={SeriesGetStatus === 'L' ? 6 : 12}>
            {!isCreate && (
            <Button className="theme-btn d-inline-flex justify-content-center align-items-center w-100 mt-3" tag={Link} to={`${seriesLeaderBoardCategory}/${Id}`}>
              Series LeaderBoard Category
            </Button>
            )}
          </Col>
        </Row>

      </section>
    </Fragment>
  )
})

AddSeriesLB.propTypes = {
  match: PropTypes.object,
  cancelLink: PropTypes.string,
  AddNewSeries: PropTypes.func,
  UpdateSeries: PropTypes.func,
  seriesLeaderBoardDetails: PropTypes.object,
  seriesLeaderBoardCategory: PropTypes.string,
  GameCategoryList: PropTypes.object,
  setIsEdit: PropTypes.func,
  setIsCreate: PropTypes.func,
  isCreate: PropTypes.string,
  isEdit: PropTypes.string,
  adminPermission: PropTypes.object,
  setSeriesStatus: PropTypes.func,
  SeriesStatus: PropTypes.string
}

AddSeriesLB.displayName = AddSeriesLB
export default connect(null, null, null, { forwardRef: true })(AddSeriesLB)
