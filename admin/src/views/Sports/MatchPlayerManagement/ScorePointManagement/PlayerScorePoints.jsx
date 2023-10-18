import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { connect, useSelector } from 'react-redux'
import { Row, Col, FormGroup, Input, Label } from 'reactstrap'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import { modalMessageFunc } from '../../../../helpers/helper'
import AlertMessage from '../../../../components/AlertMessage'

const PlayerScorePoints = forwardRef((props, ref) => {
  const {
    getList, updateMPScorePoint
  } = props
  const { id1, id2 } = useParams()
  const [matchPlayerId, setmatchPlayerId] = useState('')
  const [aScorePoint, setaScorePoint] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)

  const matchPlayerScoreList = useSelector(state => state.matchplayer.matchPlayerScorePointList)
  const resStatus = useSelector(state => state.matchplayer.resStatus)
  const resMessage = useSelector(state => state.matchplayer.resMessage)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const previousProps = useRef({
    resStatus, resMessage, matchPlayerScoreList
  }).current

  const [modalMessage, setModalMessage] = useState(false)

  useEffect(() => {
    if (id1 && id2) {
      setmatchPlayerId(id2)
      getList(id2)
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
          setModalMessage(true)
        }
        setLoading(false)
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  // set id,name,scorePoint for MatchPlyerScoreList
  useEffect(() => {
    if (matchPlayerScoreList) {
      const arr = []
      if (matchPlayerScoreList.length !== 0) {
        matchPlayerScoreList.map((data) => {
          const obj = {
            _id: data._id,
            sName: data.sName,
            nScoredPoints: data.nScoredPoints
          }
          arr.push(obj)
          return arr
        })
        setaScorePoint(arr)
      }
      setLoading(false)
    }
    return () => {
      previousProps.matchPlayerScoreList = matchPlayerScoreList
    }
  }, [matchPlayerScoreList])

  useImperativeHandle(ref, () => ({
    onEdit
  }))

  function onEdit (e) {
    updateMPScorePoint(aScorePoint, matchPlayerId)
    setLoading(true)
  }

  function onChangeScorePoint (event, ID) {
    const arr = [...aScorePoint]
    const i = arr.findIndex(data => data._id === ID)
    if (event.target.value && parseFloat(event.target.value)) {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(event.target.value) }
      setaScorePoint(arr)
    } else {
      arr[i] = { ...arr[i], nScoredPoints: parseInt(0) }
      setaScorePoint(arr)
    }
  }

  return (
    <>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      {loading && <Loading />}
      <div className='common-form-block'>
        <Row className="row-12">
          {
          aScorePoint && aScorePoint.length !== 0 && aScorePoint.map((data, i) => (
            <Col key={data.sName} className='mt-3' lg={6} md={6} xl={6}>
              <FormGroup>
                <Label for="runScore">{data.sName}</Label>
                <Input
                  disabled={adminPermission?.SCORE_POINT === 'R'}
                  id={data.sKey}
                  onChange={event => onChangeScorePoint(event, data._id)}
                  placeholder={`Enter ${data.sName}`}
                  type="text"
                  value={data.nScoredPoints}
                />
              </FormGroup>
            </Col>
          ))
        }
        </Row>
      </div>

    </>
  )
})

PlayerScorePoints.propTypes = {
  getList: PropTypes.func,
  updateMPScorePoint: PropTypes.func,
  history: PropTypes.object,
  match: PropTypes.object
}

PlayerScorePoints.displayName = PlayerScorePoints
export default connect(null, null, null, { forwardRef: true })(PlayerScorePoints)
