import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import AddSeriesLB from './AddSeriesLB'
import Layout from '../../../../components/Layout'
import LeagueHeader from '../../../Leagues/Header/LeagueHeader'
import MainLeagueHeader from '../../../Leagues/MainHeader/MainLeagueHeader'
import { getGameCategory } from '../../../../actions/league'
import { addSeriesLeaderBoard, getSeriesLeaderBoardDetails, UpdateSeriesLeaderBoard } from '../../../../actions/seriesLeaderBoard'

function AddTemplate (props) {
  const { id } = useParams()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [SeriesStatus, setSeriesStatus] = useState('P')
  const token = useSelector(state => state.auth.token)
  const seriesLeaderBoardDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardDetails)
  const GameCategoryList = useSelector(state => state.league.GamecategoryList)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const content = useRef('')
  const dispatch = useDispatch()

  function AddNewSeries (sName, sInfo, eCategory, eStatus) {
    dispatch(addSeriesLeaderBoard(sName, sInfo, eCategory, eStatus, token))
  }

  function UpdateSeries (Id, sName, sInfo, eCategory, eStatus) {
    dispatch(UpdateSeriesLeaderBoard(Id, sName, sInfo, eCategory, eStatus, token))
  }

  function getGameCategoryFun () {
    dispatch(getGameCategory(token))
  }

  useEffect(() => {
    if (id) {
      dispatch(getSeriesLeaderBoardDetails(id, token))
    }
    getGameCategoryFun()
  }, [])

  function heading () {
    if (isCreate) {
      return 'Create Series LeaderBoard'
    }
    return !isEdit ? 'Edit Series LeaderBoard' : 'Series LeaderBoard Details'
  }
  function handleChange (event, type) {
    switch (type) {
      case 'SeriesStatus':
        setSeriesStatus(event.target.value)
        break
      default:
        break
    }
  }
  function button () {
    if (isCreate) {
      return 'Create Series'
    }
    return !isEdit ? 'Save Changes' : 'Edit Series'
  }

  function Submit () {
    content.current.Submit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="common-detail">
            <MainLeagueHeader
              {...props}
              Submit={Submit}
              addSeriesLeaderBoard
              button={button}
              cancelLink="/seriesLeaderBoard"
              heading={heading()}
              page={page}
            />
            <div className='without-pagination'>
              <LeagueHeader
                {...props}
                SeriesStatus={SeriesStatus}
                addSeriesLeaderBoard
                adminPermission={adminPermission}
                handleChange={handleChange}
                hidden
                league
              />
              <AddSeriesLB
                {...props}
                ref={content}
                AddNewSeries={AddNewSeries}
                GameCategoryList={GameCategoryList}
                SeriesStatus={SeriesStatus}
                UpdateSeries={UpdateSeries}
                adminPermission={adminPermission}
                cancelLink="/seriesLeaderBoard"
                getGameCategoryFun={getGameCategoryFun}
                isCreate={isCreate}
                isEdit={isEdit}
                seriesLeaderBoardCategory="/seriesLeaderBoardCategory"
                seriesLeaderBoardDetails={seriesLeaderBoardDetails}
                setIsCreate={setIsCreate}
                setIsEdit={setIsEdit}
                setSeriesStatus={setSeriesStatus}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

AddTemplate.propTypes = {
  match: PropTypes.object
}

export default AddTemplate
