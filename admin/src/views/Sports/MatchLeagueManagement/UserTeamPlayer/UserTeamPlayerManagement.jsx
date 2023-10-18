import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import Layout from '../../../../components/Layout'
import SportsHeader from '../../SportsHeader'
import UserTeamPlayer from './UserTeamPlayer'

import { getMatchDetails } from '../../../../actions/match'
import { getUserTeamPlayerList } from '../../../../actions/matchleague'

function UserTeamPlayerManagement (props) {
  // const {
  //   match
  // } = props
  const { id1, id2 } = useParams()
  const [matchName, setMatchName] = useState('')
  const [UserTeamName, setUserTeamName] = useState('')
  const token = useSelector(state => state.auth.token)
  const userTeamPlayerList = useSelector(state => state.matchleague.userTeamPlayerList)
  const MatchDetails = useSelector(state => state.match.matchDetails)
  const dispatch = useDispatch()

  useEffect(() => {
    if (id1 && id2) {
      dispatch(getMatchDetails(id1, token))
      dispatch(getUserTeamPlayerList(id2, token))
    }
  }, [])

  useEffect(() => {
    if (MatchDetails) {
      setMatchName(MatchDetails.sName)
    }
  }, [MatchDetails])

  useEffect(() => {
    if (userTeamPlayerList) {
      setUserTeamName(userTeamPlayerList.sName)
    }
  }, [userTeamPlayerList])

  return (
    <Fragment>
      <Layout {...props} >
        <main className="main-content">
          <section className="management-section common-box">
            <SportsHeader
              heading={(matchName && UserTeamName) ? `User Team Player Management ( ${matchName} : ${UserTeamName} )` : 'User Team Player Management'}
              hidden
              permission
            />
            <UserTeamPlayer
              {...props}
              List={userTeamPlayerList}
            />
          </section>
        </main>
      </Layout>
    </Fragment>
  )
}

UserTeamPlayerManagement.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object
}

export default UserTeamPlayerManagement
