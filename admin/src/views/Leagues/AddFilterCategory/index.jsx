import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../components/Layout'
import MainLeagueHeader from '../MainHeader/MainLeagueHeader'
import AddFilterCategory from './AddFilterCategory'
import { getFilterCategoryDetails, updateNewFilterCategory, addNewFilterCategory } from '../../../actions/leaguecategory'

function AddLC (props) {
  const { id } = useParams()
  const [FilterId, setFilterId] = useState('')
  const [isCreate, setIsCreate] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [Title, setTitle] = useState('')
  const [Remark, setRemark] = useState('')
  const [submitDisableButton, setSubmitDisableButton] = useState('')
  const content = useRef()
  const token = useSelector(state => state.auth.token)
  const page = JSON.parse(localStorage.getItem('queryParams'))
  const FilterCategoryDetails = useSelector(state => state.leaguecategory.FilterCategoryDetails)
  const Auth = useSelector(state => state.auth.adminData && state.auth.adminData.eType)
  const adminPermission = useSelector(state => state.auth.adminPermission)

  const dispatch = useDispatch()
  useEffect(() => {
    if (id) {
      setIsCreate(false)
      // setLoading(true)
    } else {
      setIsEdit(true)
    }
  }, [])

  function heading () {
    if (isCreate) {
      return 'Create Filter Category'
    }
    return !isEdit ? 'Edit Filter Category' : ' Filter Category Details'
  }

  useEffect(() => {
    if (id) {
      setFilterId(id)
      // dispatch action to get Filter Category Details
      dispatch(getFilterCategoryDetails(id, token))
    }
  }, [])

  // fordispatch action to add filter category
  function AddNewLeagueCategory (Title, Remark) {
    dispatch(addNewFilterCategory(Title, Remark, token))
  }

  // fordispatch action to update filter category
  function UpdateLeagueCategory (Title, Remark) {
    dispatch(updateNewFilterCategory(Title, Remark, token, FilterId))
  }

  function button () {
    if (isCreate) {
      return 'Create Filter Category'
    }
    return !isEdit ? 'Save Changes' : 'Edit Filter Category'
  }

  function onSubmit () {
    content.current.onSubmit()
  }

  return (
    <div>
      <Layout {...props} >
        <MainLeagueHeader
          AddFilterCategory
          Auth={Auth}
          Remark={Remark}
          Title={Title}
          adminPermission={adminPermission}
          button ={button()}
          cancelLink="/league/filter-category-list"
          heading={heading()}
          onSubmit={onSubmit}
          page={page}
          submitDisableButton={submitDisableButton}
        />
        <AddFilterCategory
          {...props}
          ref={content}
          AddNewLeagueCategory={AddNewLeagueCategory}
          FilterCategoryDetails={FilterCategoryDetails}
          Remark={Remark}
          Title={Title}
          UpdateLeagueCategory={UpdateLeagueCategory}
          adminPermission={adminPermission}
          cancelLink={`/league/filter-category-list/${page?.FilterCategory || ''}`}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          setRemark={setRemark}
          setSubmitDisableButton = {setSubmitDisableButton}
          setTitle={setTitle}
        />
      </Layout>
    </div>
  )
}

AddLC.propTypes = {
  match: PropTypes.object
}

export default AddLC
