import axios from '../../axios'
const updateSport = async (updateSportData) => {
  const { sportName, key, position, Active, totalPlayers, maxPlayerOneTeam, scoreInfoLink, scoreInfoTabName, id } = updateSportData
  return await axios.put(`/gaming/admin/sport/${id}/v1`, {
    sName: sportName,
    sKey: key,
    nPosition: parseInt(position),
    eStatus: Active,
    nTotalPlayers: parseInt(totalPlayers),
    nMaxPlayerOneTeam: parseInt(maxPlayerOneTeam),
    sScoreInfoLink: scoreInfoLink,
    sScoreInfoTabName: scoreInfoTabName
  })
}

export default updateSport
