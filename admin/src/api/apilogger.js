const apiLogger = {
  apiCalls: [],

  logApiCall: (method, url, data) => {
    apiLogger.apiCalls.push({ method, url, data })
  },
  getApiCalls: () => {
    return apiLogger.apiCalls
  },
  clearApiCalls: () => {
    apiLogger.apiCalls = []
  }
}

export default apiLogger
