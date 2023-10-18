import { axios2 } from '../../actions/systemusers'

const autoKillBots = async (shutDown) => {
  return await axios2.post('/system/admin/auto-kill-agent/v1', {
    bShutdown: shutDown
  })
}

export default autoKillBots
