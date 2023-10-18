import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { useQueryState } from 'react-router-use-location-state'
import { useQuery, useMutation } from '@tanstack/react-query'

import Layout from '../../../components/Layout'
import LeaderBoardData from './LeaderBoardData'
import MainHeading from '../component/MainHeading'
import Heading from '../component/Heading'
import getSeasonIds from '../../../api/leaderBoardData/getSeasonIds'
import addSeason from '../../../api/leaderBoardData/addSeason'
import calculateLeaderBoard from '../../../api/leaderBoardData/calculateLeaderBoard'

function LeaderBoardComponent (props) {
  // const dispatch = useDispatch('')

  const [isOpen, setIsOpen] = useQueryState('leaderboard', 'ALL_TIME')
  const [loading, setLoading] = useState(false)
  const [season, setSeason] = useState([])
  const [selectedSeasonOption, setSelectedSeasonOption] = useState([])
  const [seasonErr, setSeasonErr] = useState('')
  const [activePageSeason, setActivePageSeason] = useState(1)
  const [seasonInput, setSeasonInput] = useState('')
  const [seasonList, setSeasonList] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(false)
  const [modalMessage, setModalMessage] = useState(false)
  const [close, setClose] = useState(false)

  // const token = useSelector(state => state.auth.token)
  const Auth = useSelector(state => state?.auth?.adminData && state?.auth?.adminData?.eType)
  const adminPermission = useSelector(state => state?.auth?.adminPermission)
  const start = activePageSeason * 10
  const limit = 10

  // fetch seasonList for ID
  const { data: seasonIds } = useQuery({
    queryKey: ['getSeasonList', start, limit, seasonInput],
    queryFn: () => getSeasonIds(start, limit, seasonInput),
    select: (response) => response?.data?.data,
    enabled: !!(start || limit || seasonInput)
  })

  const length = Math?.ceil(seasonIds?.nTotal / 10)

  const { mutate: addSeasonFun } = useMutation(addSeason, {
    onSuccess: (response) => {
      setMessage(response?.data?.message)
      setModalMessage(true)
      setClose(true)
      setStatus(true)
    }
  })
  const { mutate: calculateLeaderBoardFun } = useMutation(calculateLeaderBoard, {
    onSuccess: (response) => {
    }
  })
  function toggle (event) {
    setIsOpen(event?.target?.value)
  }
  function calculateLeaderBoardData () {
    // dispatch(calculateLeaderBoard(token))
    calculateLeaderBoardFun()
  }

  function onSubmit (e) {
    e.preventDefault()
    if ((selectedSeasonOption && selectedSeasonOption?.length >= 1) && !seasonErr) {
      const selected = []
      selectedSeasonOption?.map((data) => {
        const obj = { _id: data?.value }
        selected?.push(obj)
        return selected
      })
      addSeasonFun(selected)
      setSeason([])
      setLoading(true)
    } else if (!selectedSeasonOption?.length >= 1) {
      setSeasonErr('Required field')
    }
  }

  function onSeasonSelect (selectedOption) {
    if (selectedOption) {
      setSelectedSeasonOption(selectedOption)
      if (selectedOption?.length >= 1) {
        setSeasonErr('')
      } else {
        setSeasonErr('Required field')
      }
      setSeason(selectedOption)
    } else {
      setSeason([])
      setSelectedSeasonOption([])
    }
  }

  function handleInputChange (value) {
    setSeasonInput(value)
  }

  function onSeasonPagination () {
    // const length = Math.ceil(seasonIds?.nTotal / 10)
    if (activePageSeason < length) {
      // const start = activePageSeason * 10
      // const limit = 10
      // setSeasonStart(start)
      // dispatch(getSeasonIds(start, limit, seasonInput, token))
      setActivePageSeason(activePageSeason + 1)
    }
  }

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <MainHeading
              calculateLeaderBoardData={calculateLeaderBoardData}
              heading="Leadership Board"
              leadershipBoard
            />
            <div className='without-pagination'>
              <Heading
                Auth={Auth}
                adminPermission={adminPermission}
                handleInputChange={handleInputChange}
                isOpen={isOpen}
                leadershipBoard
                loading={loading}
                onSeasonPagination={onSeasonPagination}
                onSeasonSelect={onSeasonSelect}
                onSubmit={onSubmit}
                season={season}
                seasonList={seasonList}
                selectedSeasonOption={selectedSeasonOption}
                setLoading={setLoading}
                setSeason={setSeason}
                setSeasonErr={setSeasonErr}
                toggle={toggle}
              />
              <LeaderBoardData
                {...props}
                adminPermission={adminPermission}
                isOpen={isOpen}
                loading={loading}
                seasonIds={seasonIds}
                seasonInput={seasonInput}
                seasonList={seasonList}
                setLoading={setLoading}
                setSeasonList={setSeasonList}
                message={message}
                status={status}
                close={close}
                modalMessage={modalMessage}
                setModalMessage = {setModalMessage}
                setMessage={setMessage}
                setClose= {setClose}
                setStatus={setStatus}
                getSeasonIds={getSeasonIds}
              />
            </div>
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

export default LeaderBoardComponent
