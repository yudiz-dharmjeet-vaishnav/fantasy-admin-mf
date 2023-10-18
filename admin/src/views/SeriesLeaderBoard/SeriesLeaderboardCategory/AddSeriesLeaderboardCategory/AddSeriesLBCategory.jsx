import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { FormGroup, Label, Input, InputGroupText, Form, CustomInput } from 'reactstrap'
import { useSelector, useDispatch, connect } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import CKEditor from '@ckeditor/ckeditor5-react'
import DecoupledEditor from 'ckeditor5-custom-build/build/ckeditor'
import PropTypes from 'prop-types'

import Loading from '../../../../components/Loading'
import AlertMessage from '../../../../components/AlertMessage'
import RequiredField from '../../../../components/RequiredField'

import { isFloat, isNumber, isPositive, modalMessageFunc, verifyLength } from '../../../../helpers/helper'
import { getSeriesLeaderBoardDetails } from '../../../../actions/seriesLeaderBoard'

const AddSeriesLBCategory = forwardRef((props, ref) => {
  const {
    AddNewLBCategory, cancelLink, getLBCategoryIdList, UpdateLBCategory, isCreate, setIsCreate, setIsEdit, setUpdateDisableButton
  } = props
  const { id, id2 } = useParams()
  const [loading, setLoading] = useState(false)
  const [seriesLBCategory, setSeriesLBCategory] = useState('')
  const [name, setName] = useState('')
  const [errName, setErrName] = useState('')
  const [prize, setPrize] = useState('')
  const [rank, setRank] = useState('')
  const [TotalPayout, setTotalPayout] = useState('')
  const [content, setContent] = useState('')
  const [errContent, setErrContent] = useState('')
  const [errPrize, setErrPrize] = useState('')
  const [errRank, setErrRank] = useState('')
  const [errTotalPayout, setErrTotalPayout] = useState('')
  const [categoryList, setcategoryList] = useState([])
  const [modalMessage, setModalMessage] = useState(false)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [close, setClose] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const token = useSelector(state => state.auth.token)
  const seriesLeaderBoardCategoryDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardCategoryDetails)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const categoryTemplateIDList = useSelector(state => state.seriesLeaderBoard.categoryTemplateIDList)
  const seriesLeaderBoardDetails = useSelector(state => state.seriesLeaderBoard.seriesLeaderBoardDetails)
  const previousProps = useRef({
    resStatus, resMessage, categoryTemplateIDList, seriesLeaderBoardCategoryDetails, seriesLeaderBoardDetails
  }).current
  const updateDisable = seriesLeaderBoardCategoryDetails && previousProps.seriesLeaderBoardCategoryDetails !== seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sFirstPrize === prize && seriesLeaderBoardCategoryDetails.nMaxRank === parseInt(rank) && seriesLeaderBoardCategoryDetails.nTotalPayout === parseInt(TotalPayout) && seriesLeaderBoardCategoryDetails.sContent === content

  useEffect(() => {
    if (id && id2) {
      setIsCreate(false)
      setLoading(true)
    } else {
      setIsEdit(true)
    }
    id && dispatch(getSeriesLeaderBoardDetails(id, token))
    getLBCategoryIdList()
    setLoading(true)
  }, [])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  useEffect(() => {
    setUpdateDisableButton(updateDisable)
  }, [updateDisable])

  useEffect(() => {
    if (isCreate) {
      if (categoryList && categoryList.length !== 0) {
        setSeriesLBCategory(categoryList[0]._id)
      }
    }
    return () => {
      previousProps.categoryList = categoryList
    }
  }, [categoryList])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        setMessage(resMessage)
        setStatus(resStatus)
        if (resStatus && isCreate) {
          navigate(`${cancelLink}`, { state: { message: resMessage } })
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
    if (previousProps.categoryTemplateIDList !== categoryTemplateIDList) {
      if (categoryTemplateIDList && categoryTemplateIDList.length !== 0) {
        setcategoryList(categoryTemplateIDList)
        setLoading(false)
      }
    }
    return () => {
      previousProps.categoryTemplateIDList = categoryTemplateIDList
    }
  }, [categoryTemplateIDList])

  useEffect(() => {
    if (previousProps.seriesLeaderBoardCategoryDetails !== seriesLeaderBoardCategoryDetails) {
      if (seriesLeaderBoardCategoryDetails) {
        setSeriesLBCategory(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.iCategoryId)
        setName(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sName)
        setPrize(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sFirstPrize)
        setRank(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.nMaxRank)
        setTotalPayout(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.nTotalPayout)
        setContent(seriesLeaderBoardCategoryDetails && seriesLeaderBoardCategoryDetails.sContent ? seriesLeaderBoardCategoryDetails.sContent : '')
        setLoading(false)
      }
    }
    return () => {
      previousProps.seriesLeaderBoardCategoryDetails = seriesLeaderBoardCategoryDetails
    }
  }, [seriesLeaderBoardCategoryDetails])

  function handleChange (event, type) {
    switch (type) {
      case 'SeriesLBCategory':
        setSeriesLBCategory(event.target.value)
        break
      case 'Prize':
        if (!event.target.value) {
          setErrPrize('Required field')
        } else if (!isFloat(event.target.value)) {
          if (isNaN(parseFloat(event.target.value))) {
            setErrPrize('Enter number only')
          } else {
            setErrPrize('Must be 2 floating point value only')
          }
        } else if (isFloat(event.target.value)) {
          setErrPrize('')
        }
        setPrize(event.target.value)
        break
      case 'Name':
        if (verifyLength(event.target.value, 1)) {
          setErrName('')
        } else {
          setErrName('Required field')
        }
        setName(event.target.value)
        break
      case 'Rank':
        if (isNumber(event.target.value)) {
          setErrRank('')
        } else {
          setErrRank('Required field')
        }
        setRank(event.target.value)
        break
      case 'TotalPayout':
        if (isPositive(event.target.value)) {
          setErrTotalPayout('')
        } else if (!event.target.value) {
          setErrTotalPayout('Required field')
        } else if (!isPositive(event.target.value)) {
          setErrTotalPayout('Must be greater then 0')
        }
        if (parseInt(prize) <= parseInt(event.target.value)) {
          setErrPrize('')
        }
        setTotalPayout(event.target.value)
        break
      default:
        break
    }
  }

  function Submit (e) {
    if (isCreate) {
      if (verifyLength(prize, 1) && isNumber(rank) && verifyLength(content, 1) && isNumber(TotalPayout) && (parseInt(prize) <= parseInt(TotalPayout))) {
        AddNewLBCategory(id, name, seriesLBCategory, prize, rank, TotalPayout, content)
        setLoading(true)
      } else {
        if (!verifyLength(name, 1)) {
          setErrName('Required field')
        }
        if (!verifyLength(prize, 1)) {
          setErrPrize('Required field')
        }
        if (!isNumber(rank)) {
          setErrRank('Required field')
        }
        if (!verifyLength(content, 1)) {
          setErrContent('Required field')
        }
        if (!isNumber(TotalPayout)) {
          setErrTotalPayout('Required field')
        }
        if (parseInt(prize) > parseInt(TotalPayout)) {
          setErrPrize('First prize must be less than total payout')
        }
      }
    } else if (!isCreate) {
      if (verifyLength(prize, 1) && isNumber(rank) && verifyLength(content, 1) && isNumber(TotalPayout) && (parseInt(prize) <= parseInt(TotalPayout))) {
        UpdateLBCategory(id2, name, seriesLBCategory, prize, rank, TotalPayout, content)
        setLoading(true)
      } else {
        if (!verifyLength(name, 1)) {
          setErrName('Required field')
        }
        if (!verifyLength(prize, 1)) {
          setErrPrize('Required field')
        }
        if (!isNumber(rank)) {
          setErrRank('Required field')
        }
        if (!verifyLength(content, 1)) {
          setErrContent('Required field')
        }
        if (!isNumber(TotalPayout)) {
          setErrTotalPayout('Required field')
        }
        if (parseInt(prize) > parseInt(TotalPayout)) {
          setErrPrize('First prize must be less than total payout')
        }
      }
    }
  }

  useImperativeHandle(ref, () => ({
    Submit
  }))
  // forhandle onChange event for CKEditor
  function onEditorChange (evt, editor) {
    if (verifyLength(editor.getData(), 1)) {
      setErrContent('')
    } else {
      setErrContent('Required field')
    }
    setContent(editor.getData())
  }

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
          <FormGroup>
            <Label className='edit-label-setting' for="Name">
              Series LeaderBoard Category
              {' '}
              <RequiredField/>
            </Label>
            <CustomInput
              className='league-placeholder'
              disabled={(adminPermission?.SERIES_LEADERBOARD === 'R') || !isCreate}
              id="RankType"
              name="select"
              onChange={event => handleChange(event, 'SeriesLBCategory')}
              type="select"
              value={seriesLBCategory}
            >
              {
                categoryList && categoryList.length !== 0 && categoryList.map((category) => {
                  return (
                    <option key={category._id} value={category._id}>
                      {' '}
                      {category.sName}
                      {' '}
                    </option>
                  )
                })
              }
            </CustomInput>
          </FormGroup>
          <FormGroup className='mt-3'>
            <Label className='edit-label-setting' for="Name">
              Name
              {' '}
              <RequiredField/>
            </Label>
            {isCreate
              ? <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Name" onChange={event => handleChange(event, 'Name')} placeholder="Name" value={name} />
              : <InputGroupText>{name}</InputGroupText>}
            <p className="error-text">{errName}</p>
          </FormGroup>
          <FormGroup>
            <Label className='edit-label-setting' for="Prize">
              First Prize
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Prize" onChange={event => handleChange(event, 'Prize')} placeholder="Prize" value={prize} />
            <p className="error-text">{errPrize}</p>
          </FormGroup>
          <FormGroup>
            <Label className='edit-label-setting' for="Rank">
              Max Rank
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Rank" onChange={event => handleChange(event, 'Rank')} placeholder="Max Rank" type="number" value={rank} />
            <p className="error-text">{errRank}</p>
          </FormGroup>
          <FormGroup>
            <Label className='edit-label-setting' for="Payout">
              Total Payout
              {' '}
              <RequiredField/>
            </Label>
            <Input disabled={adminPermission?.SERIES_LEADERBOARD === 'R'} name="Payout" onChange={event => handleChange(event, 'TotalPayout')} placeholder="Total Payout" type="number" value={TotalPayout} />
            <p className="error-text">{errTotalPayout}</p>
          </FormGroup>
          <FormGroup>
            <Label className='edit-label-setting'>
              Content
              {' '}
              <RequiredField/>
            </Label>
            <div className={errContent ? 'ck-border' : ''} >
              <CKEditor
                config={{
                  placeholder: 'Enter Content',
                  toolbar: {
                    items: [
                      'heading',
                      '|',
                      'fontSize',
                      'fontFamily',
                      '|',
                      'fontColor',
                      'fontBackgroundColor',
                      '|',
                      'bold',
                      'italic',
                      'underline',
                      'strikethrough',
                      '|',
                      'alignment',
                      '|',
                      'numberedList',
                      'bulletedList',
                      '|',
                      'outdent',
                      'indent',
                      '|',
                      'todoList',
                      'imageUpload',
                      'link',
                      'blockQuote',
                      'insertTable',
                      'mediaEmbed',
                      '|',
                      'undo',
                      'redo',
                      'imageInsert',
                      '|'
                    ]
                  }
                }}
                data={content}
                disabled={adminPermission?.SERIES_LEADERBOARD === 'R'}
                editor={DecoupledEditor}
                onChange={onEditorChange}
                onInit={(editor) => {
                  editor.ui.getEditableElement().parentElement.insertBefore(editor.ui.view.toolbar.element, editor.ui.getEditableElement())
                }}
              />
            </div>
            <p className="error-text">{errContent}</p>
          </FormGroup>
        </Form>

      </section>
    </main>
  )
})

AddSeriesLBCategory.defaultProps = {
  history: {},
  getLBCategoryIdList: {},
  seriesLeaderBoardCategoryDetails: {},
  cancelLink: ''
}

AddSeriesLBCategory.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  AddNewLBCategory: PropTypes.func,
  UpdateLBCategory: PropTypes.func,
  getLBCategoryIdList: PropTypes.func,
  seriesLeaderBoardCategoryDetails: PropTypes.object,
  cancelLink: PropTypes.string,
  match: PropTypes.object,
  setIsCreate: PropTypes.func,
  isCreate: PropTypes.string,
  isEdit: PropTypes.string,
  setIsEdit: PropTypes.func,
  setUpdateDisableButton: PropTypes.func

}
AddSeriesLBCategory.displayName = AddSeriesLBCategory

export default connect(null, null, null, { forwardRef: true })(AddSeriesLBCategory)
