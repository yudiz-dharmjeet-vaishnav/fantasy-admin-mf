import axios from '../../axios'
const updateSetting = async (updateSettingData) => {
  const { settingId, Title, Key, Max, Min, settingStatus } = updateSettingData
  return await axios.put(`/gaming/admin/setting/${settingId}/v1`, {
    sTitle: Title, sKey: Key, nMax: Max, nMin: Min, sValue: (Key === 'FIX_DEPOSIT1' || Key === 'FIX_DEPOSIT2' || Key === 'FIX_DEPOSIT3') ? Max : '', eStatus: settingStatus
  })
}

export default updateSetting
