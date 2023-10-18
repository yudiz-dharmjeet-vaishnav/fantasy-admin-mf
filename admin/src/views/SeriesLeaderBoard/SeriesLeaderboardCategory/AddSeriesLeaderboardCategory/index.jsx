import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import AddSeriesLBCategory from './AddSeriesLBCategory'
import MainLeagueHeader from '../../../Leagues/MainHeader/MainLeagueHeader'
import { addSeriesLeaderBoardCategory, UpdateLeaderBoardCategory, getLBCategoryDetails, getLBCategory } from '../../../../actions/seriesLeaderBoard'

function AddSeriesLeaderBoardCategory (props) {
  const { id, id2 } = useParams()
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [updateDisableButton, setUpdateDisableButton] = useState('')
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const dispatch = useDispatch()
  const content = useRef('')

  useEffect(() => {
    if (id && id2) {
      dispatch(getLBCategoryDetails(id2, token))
    }
  }, [])

  function AddNewLBCategory (ID, name, seriesLBCategory, prize, rank, TotalPayout, content) {
    const addSeriesLBCategoryData = {
      ID, name, seriesLBCategory, prize, rank, TotalPayout, content, token
    }
    dispatch(addSeriesLeaderBoardCategory(addSeriesLBCategoryData))
  }

  function UpdateLBCategory (ID, name, seriesLBCategory, prize, rank, TotalPayout, content) {
    const updateSeriesLBCategoryData = {
      ID, name, seriesLBCategory, prize, rank, TotalPayout, content, token
    }
    dispatch(UpdateLeaderBoardCategory(updateSeriesLBCategoryData))
  }

  function getLBCategoryIdList () {
    dispatch(getLBCategory(token))
  }

  function Submit () {
    content.current.Submit()
  }
  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="common-box common-detail">
            <MainLeagueHeader
              {...props}
              ref={content}
              Auth={Auth}
              Submit={Submit}
              addSeriesLeaderBoardCategory
              button={isCreate ? 'Create LeaderBoard Category' : !isEdit ? 'Save Changes' : 'Edit LeaderBoard Category'}
              cancelLink={`/seriesLeaderBoardCategory/${id}`}
              heading={isCreate ? 'Create Series Leader Board Category' : 'Edit Series Leader Board Category'}
              page={page}
              updateDisableButton={updateDisableButton}
            />
            <div className='without-pagination'>
              <AddSeriesLBCategory
                {...props}
                ref={content}
                AddNewLBCategory={AddNewLBCategory}
                UpdateLBCategory={UpdateLBCategory}
                addpriceBreakup="/seriesLeaderBoardPriceBreakup"
                cancelLink={`/seriesLeaderBoardCategory/${id}`}
                getLBCategoryIdList={getLBCategoryIdList}
                isCreate={isCreate}
                isEdit={isEdit}
                setIsCreate={setIsCreate}
                setIsEdit={setIsEdit}
                setUpdateDisableButton={setUpdateDisableButton}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

AddSeriesLeaderBoardCategory.propTypes = {
  match: PropTypes.object
}

export default AddSeriesLeaderBoardCategory
