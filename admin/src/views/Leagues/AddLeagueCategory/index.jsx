import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import AddLeagueCategory from './AddLeagueCategory'
import MainLeagueHeader from '../MainHeader/MainLeagueHeader'
import { getLeagueCategoryDetails, updateNewLeagueCategory, addNewLeagueCategory } from '../../../actions/leaguecategory'

function AddLC (props) {
  const { id } = useParams()

  const [LeagueId, setLeagueId] = useState('')
  const dispatch = useDispatch()
  const [Title, setTitle] = useState('')
  const [Position, setPosition] = useState(0)
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const LeagueCategoryDetails = useSelector(state => state.leaguecategory.LeagueCategoryDetails)
  useEffect(() => {
    if (id) {
      setLeagueId(id)
      dispatch(getLeagueCategoryDetails(id, token))
    }
  }, [])

  function AddNewLeagueCategory (Title, Position, Remark, image) {
    dispatch(addNewLeagueCategory(Title, Position, Remark, image, token))
  }

  function UpdateLeagueCategory (Title, Position, Remark, image) {
    dispatch(updateNewLeagueCategory(Title, Position, Remark, image, token, id))
  }

  useEffect(() => {
    if (id) {
      setIsCreate(false)
    } else {
      setIsEdit(true)
    }
  }, [])

  function heading () {
    if (isCreate) {
      return 'Create League Category'
    }
    return !isEdit ? 'Edit League Category' : ' League Category Details'
  }

  function button () {
    if (isCreate) {
      return 'Create League Category'
    }
    return !isEdit ? 'Save Changes' : 'Edit League Category'
  }

  function onSubmit () {
    content.current.onSubmit()
  }
  return (
    <div>
      <Layout {...props} >
        <MainLeagueHeader
          Position={Position}
          Title={Title}
          addLeagueCategory
          button={button()}
          cancelLink="/league/league-category-list"
          heading={heading()}
          onSubmit={onSubmit}
          page={page}
          submitDisableButton={submitDisableButton}
        />
        <div className='without-pagination'>
          <AddLeagueCategory
            {...props}
            ref={content}
            AddNewLeagueCategory={AddNewLeagueCategory}
            LeagueCategoryDetails={LeagueCategoryDetails}
            Position={Position}
            Title={Title}
            UpdateLeagueCategory={UpdateLeagueCategory}
            addLeagueCategory={`/league/league-Prize/${LeagueId}`}
            cancelLink={`/league/league-category-list/${page?.LeagueCategory || ''}`}
            setIsEdit={setIsEdit}
            setPosition={ setPosition}
            setSubmitDisableButton={setSubmitDisableButton}
            setTitle={setTitle}
          />
        </div>
      </Layout>
    </div>
  )
}

AddLC.propTypes = {
  match: PropTypes.object
}

export default AddLC
