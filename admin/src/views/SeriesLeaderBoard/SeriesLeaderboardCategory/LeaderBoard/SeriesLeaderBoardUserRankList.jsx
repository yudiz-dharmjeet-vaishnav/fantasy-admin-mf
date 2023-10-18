import React, { Fragment, useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useSelector, connect, useDispatch } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { ExcelExport, ExcelExportColumn } from '@progress/kendo-react-excel-export'
import qs from 'query-string'
import PropTypes from 'prop-types'

import noImage from '../../../../assets/images/no-image-1.svg'

import AlertMessage from '../../../../components/AlertMessage'
import DataNotFound from '../../../../components/DataNotFound'
import SkeletonTable from '../../../../components/SkeletonTable'
import PaginationComponent from '../../../../components/PaginationComponent'
import { modalMessageFunc } from '../../../../helpers/helper'
import { getUrl } from '../../../../actions/url'

const SeriesLeaderBoardUserRankList = forwardRef((props, ref) => {
  const {
    List, getList
  } = props
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const exporter = useRef(null)
  const [start, setStart] = useState(0)
  const [offset, setOffset] = useQueryState('pageSize', 10)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [activePageNo, setPageNo] = useQueryState('page', 1)
  const [startingNo, setStartingNo] = useState(0)
  const [endingNo, setEndingNo] = useState(0)
  const [index, setIndex] = useState(1)
  const [loading, setLoading] = useState(false)
  const [listLength, setListLength] = useState('10 Rows')
  const [close, setClose] = useState(false)
  const [url, setUrl] = useState('')
  const [fullList, setFullList] = useState([])
  const [selectedFieldData, setSelectedFieldData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const getUrlLink = useSelector(state => state.url.getUrl)
  const resStatus = useSelector(state => state.seriesLeaderBoard.resStatus)
  const resMessage = useSelector(state => state.seriesLeaderBoard.resMessage)
  const previousProps = useRef({ List, resMessage, resStatus, start, offset }).current
  const [modalMessage, setModalMessage] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const isFullList = useSelector(state => state.seriesLeaderBoard.isFullResponse)
  const adminPermission = useSelector(state => state.auth.adminPermission)
  const paginationFlag = useRef(false)
  const obj = qs.parse(location.search)

  useEffect(() => {
    if (location.state) {
      if (location.state.message) {
        setMessage(location.state.message)
        setStatus(true)
        setModalMessage(true)
      }
      navigate(location.pathname, { replace: true })
    }
    let page = 1
    let limit = offset
    if (obj) {
      if (obj.page) {
        page = obj.page
        setPageNo(page)
      }
      if (obj.pageSize) {
        limit = obj.pageSize
        setOffset(limit)
        setListLength(`${limit} users`)
      }
    }
    const startFrom = (page - 1) * offset
    setStart(startFrom)
    getList(startFrom, limit, false)
    setLoading(true)
    if (!getUrlLink && !url) {
      dispatch(getUrl('media'))
    }
  }, [])

  useEffect(() => {
    !url && setUrl(getUrlLink)
  }, [getUrlLink])

  useEffect(() => {
    modalMessageFunc(modalMessage, setModalMessage, setClose)
  }, [modalMessage])

  // to set list of SLBcategory
  useEffect(() => {
    if (previousProps.List !== List) {
      if (List?.data && (!isFullList)) {
        const userArrLength = List?.data?.length
        const startFrom = ((activePageNo - 1) * offset) + 1
        const end = (startFrom - 1) + userArrLength
        setStartingNo(startFrom)
        setEndingNo(end)
        setList(List?.data)
        setIndex(activePageNo)
        setTotal(List?.total || 0)
      } else if (List?.data && isFullList) {
        setFullList(List?.data || [])
        setLoading(false)
        exporter.current.props = {
          ...exporter.current.props,
          data: processExcelExportData(List?.data || []),
          fileName: 'Series LeaderBoard PrizeBreakup.xlsx'
        }
        exporter.current.save()
        setLoading(false)
      }
      setLoading(false)
    }
    return () => {
      previousProps.List = List
    }
  }, [List])

  useEffect(() => {
    let data = localStorage.getItem('queryParams') ? JSON.parse(localStorage.getItem('queryParams')) : {}
    data === {}
      ? data = {
        SeriesLeaderBoardUserRankList: location.search
      }
      : data.SeriesLeaderBoardUserRankList = location.search
    localStorage.setItem('queryParams', JSON.stringify(data))
  }, [location.search])

  useEffect(() => {
    if (previousProps.resMessage !== resMessage) {
      if (resMessage) {
        if (resStatus) {
          const startFrom = 0
          const limit = offset
          getList(startFrom, limit, false)
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setPageNo(1)
        } else {
          setMessage(resMessage)
          setStatus(resStatus)
          setModalMessage(true)
          setLoading(false)
        }
      }
    }
    return () => {
      previousProps.resMessage = resMessage
    }
  }, [resStatus, resMessage])

  useEffect(() => {
    if ((previousProps.start !== start || previousProps.offset !== offset) && paginationFlag.current) {
      getList(start, offset, false)
      setLoading(true)
    }
    return () => {
      previousProps.start = start
      previousProps.offset = offset
    }
  }, [start, offset])

  function modalOpenFunc (data) {
    setSelectedFieldData(data)
    setIsModalOpen(true)
  }

  function oUserTernary (user) {
    if (user.oUser.eType === 'B') {
      return 'Bot'
    }
    return 'Normal'
  }

  function oUserButtonTernary (data) {
    if (data?.oUser?.eType === 'U') {
      return {
        pathname: `/users/user-management/user-details/${data?.oUser?.iUserId}`,
        state: {
          isSeriesLeaderBoardUserRank: true,
          SeriesLeaderBoardUserRankLink: location.pathname
        }
      }
    }
    return {
      pathname: `/users/system-user/system-user-details/${data?.oUser?.iUserId}`,
      state: {
        isSeriesLeaderBoardUserRank: true,
        SeriesLeaderBoardUserRankLink: location.pathname
      }
    }
  }

  const processExcelExportData = (data) =>
    data.map((user, index2) => {
      const username = user?.oUser?.sUsername || '--'
      const name = user?.oUser?.sName || '--'
      const userType = user?.oUser?.eType ? oUserTernary(user) : '--'
      const userRank = user?.nUserRank || 0
      const userScore = user?.nUserScore || 0
      const prizeDistribution = (user.nPrize || '0') + (user.nBonusWin ? '(Bonus -' + Number(user.nBonusWin).toFixed(2) + ')' : '') + (user.aExtraWin && user.aExtraWin[0]?.sInfo ? '(Extra -' + user.aExtraWin[0].sInfo + ')' : '')
      return {
        ...user,
        no: index2 + 1,
        username,
        name,
        userType,
        userRank,
        userScore,
        prizeDistribution
      }
    })

  async function onExport () {
    const startFrom = 0
    getList(startFrom, offset, true)
    setLoading(true)
  }

  useImperativeHandle(ref, () => ({
    onExport
  }))

  return (
    <Fragment>
      <AlertMessage
        close={close}
        message={message}
        modalMessage={modalMessage}
        status={status}
      />
      <ExcelExport ref={exporter} data={fullList} fileName="Series LeaderBoard Prize Breakup.xlsx">
        <ExcelExportColumn field="name" title="Name" />
        <ExcelExportColumn field="username" title="Username" />
        <ExcelExportColumn field="userType" title="User Type" />
        <ExcelExportColumn field="userRank" title="User Rank" />
        <ExcelExportColumn field="userScore" title="User Score" />
        <ExcelExportColumn field="prizeDistribution" title="Win Prize" />
      </ExcelExport>
      {
      !loading && list.length === 0
        ? (
          <DataNotFound message="Series leader board user rank list" obj={obj}/>
          )
        : (
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Profile pic</th>
                    <th>Username</th>
                    <th>Rank</th>
                    <th>User Score</th>
                    <th>Prize</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <SkeletonTable numberOfColumns={6} />
                    : (
                      <Fragment>
                        {
                    list && list.length !== 0 && list.map((data, i) => {
                      return (
                        <tr key={i}>
                          <td>{(((index - 1) * offset) + (i + 1))}</td>
                          <td>
                            {data.oUser && data.oUser.sProPic
                              ? <img alt="No Image" className="theme-image" src={url + data.oUser.sProPic} />
                              : <img alt= "No Image" src={noImage}/>
                            }
                          </td>
                          <td>
                            {(adminPermission && (adminPermission.USERS !== 'N' && adminPermission.SYSTEM_USERS !== 'N')) && data?.oUser?.eType && data?.oUser?.iUserId
                              ? <Button className="total-text-link" color="link" tag={Link} to={oUserButtonTernary(data)}>{data?.oUser?.sUsername || '--'}</Button>
                              : data?.oUser?.sUsername || '--'}
                          </td>
                          <td>{data.nUserRank ? data.nUserRank : '-'}</td>
                          <td>{data.nUserScore ? data.nUserScore : '-'}</td>
                          <td>
                            <Button className="view" color="link" onClick={() => modalOpenFunc(data)}>
                              {data.nPrize || 0}
                              {data.nBonusWin ? '(Bonus -' + Number(data.nBonusWin).toFixed(2) + ')' : ''}
                              {data.aExtraWin && data.aExtraWin[0]?.sInfo ? '(Extra -' + data.aExtraWin[0].sInfo + ')' : ''}
                            </Button>
                          </td>
                        </tr>
                      )
                    })
                  }
                      </Fragment>
                      )
            }
                </tbody>
              </table>
            </div>
          </div>
          )}

      <Modal className='modal-confirm-bot' isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Prize</ModalHeader>
        <ModalBody>
          <div className='table-represent'>
            <div className="table-responsive">
              <table className="table">
                <tr>
                  <td>Cash Win</td>
                  <td><b>{selectedFieldData?.nPrize || 0}</b></td>
                </tr>
                <tr>
                  <td>Bonus</td>
                  <td><b>{Number(selectedFieldData?.nBonusWin).toFixed(2) || 0}</b></td>
                </tr>
                <tr>
                  <td>Extra Win</td>
                  <td><b>{(selectedFieldData?.aExtraWin?.length !== 0) ? [...new Set(selectedFieldData?.aExtraWin?.map(data => data.sInfo))].toString() : '--'}</b></td>
                </tr>
              </table>
            </div>
          </div>
        </ModalBody>
      </Modal>

      {List?.length !== 0 && (
      <PaginationComponent
        activePageNo={activePageNo}
        endingNo={endingNo}
        listLength={listLength}
        offset={offset}
        paginationFlag={paginationFlag}
        setListLength={setListLength}
        setLoading={setLoading}
        setOffset={setOffset}
        setPageNo={setPageNo}
        setStart={setStart}
        startingNo={startingNo}
        total={total}
      />
      )}
    </Fragment>
  )
})

SeriesLeaderBoardUserRankList.propTypes = {
  List: PropTypes.array,
  getList: PropTypes.func,
  search: PropTypes.string,
  flag: PropTypes.bool,
  location: PropTypes.object,
  history: PropTypes.object
}

SeriesLeaderBoardUserRankList.displayName = SeriesLeaderBoardUserRankList

export default connect(null, null, null, { forwardRef: true })(SeriesLeaderBoardUserRankList)
