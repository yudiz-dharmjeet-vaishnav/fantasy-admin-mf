import React, { memo, useMemo, useState } from 'react'
import { Chart, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { CustomInput } from 'reactstrap'
import PropTypes from 'prop-types'
import moment from 'moment'
import { formatCompactNumberForGraph } from '../../../helpers/helper'

Chart.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)
function LineChart ({ chartData, getCurrencyLogo }) {
  const [dayFilter, setDayFilter] = useState('month')
  function onFiltering (event) {
    setDayFilter(event.target.value)
  }

  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const weekStart = new Date(new Date().setDate(today.getDate() - today.getDay()))
  const weekEnd = new Date(new Date().setDate(weekStart.getDate() + 6))
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

  function getAllDatesBetweenTwoRange (startDate, endDate, filter) {
    if (filter === 'month') {
      const dateArray = []
      let fromDate = moment(startDate)
      const toDate = moment(endDate)
      let dayCounter = 1
      while (fromDate <= toDate) {
        dateArray.push(dayCounter % 4 === 1 ? moment(fromDate).format('D MMM') : '')
        dayCounter++
        fromDate = moment(fromDate).add(1, 'day')
      }
      return dateArray
    } else {
      const dateArray = []
      let fromDate = moment(startDate)
      const toDate = moment(endDate)
      while (fromDate <= toDate) {
        dateArray.push(moment(fromDate).format('D MMM'))
        fromDate = moment(fromDate).add(1, 'days')
      }
      return dateArray
    }
  }
  const month = chartData?.oEarning?.aMonth.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((data) =>
    data?.nCash
  )
  const week = chartData?.oEarning?.aWeek.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((data) =>
    data?.nCash
  )
  const todayData = chartData?.oEarning?.aToday[0]?.nCash || 0

  const to = moment(new Date()).format('D MMM')
  const data = {
    labels: dayFilter === 'month' ? getAllDatesBetweenTwoRange(monthStart, monthEnd, 'month') : dayFilter === 'week' ? getAllDatesBetweenTwoRange(weekStart, weekEnd, 'week') : ['', '', '', to, '', '', ''],
    datasets: [{
      labels: 'Revenue Details',
      data: dayFilter === 'today' ? Array(7).fill(todayData) : dayFilter === 'month' ? month : week,
      // backgroundColor: '#F5F8FF',
      borderColor: 'rgba(59, 119, 247, 1)'
      // fill: true
    }]
  }

  const options = useMemo(
    () => ({
      responsive: true,
      aspectRatio: 0 / 0,
      plugins: {
        legend: {
          display: false
        }
      },
      animations: {
        tension: {
          duration: 1000,
          easing: 'easeInOutCubic',
          from: 0.8,
          to: 0.4,
          loop: false
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      tooltipFillColor: 'rgba(0,0,0,0.8)',
      tooltipFontStyle: 'bold',
      scales: {
        x: {
          grid: {
            display: false,
            borderWidth: 0
          },
          beginAtZero: true
        },
        y: {
          grid: {
            drawTicks: false,
            drawBorder: true,
            color: 'rgba(211, 214, 223, 1)',
            borderDash: [5, 5],
            borderDashOffset: 5,
            borderWidth: 0
          },
          beginAtZero: true,
          ticks: {
            stepSize: 5,
            padding: 9,
            // Include a Currency sign in the ticks

            callback: function (value, index, ticks) {
              return getCurrencyLogo?.sLogo + formatCompactNumberForGraph(value)
            }
          },

          suggestedMin: todayData - 10,
          suggestedMax: todayData + 10
        }
      }
    }),
    [getCurrencyLogo]
  )
  return (
    <>
      <div className='revenue-details-heading'>
        <h1 >Revenue Details</h1>
        <CustomInput
          className='day-filter'
          id="dayFilter"
          name="dayFilter"
          onChange={(event) => onFiltering(event)}
          type="select"
          value={dayFilter}
        >
          <option value="today">Today</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </CustomInput>
      </div>
      <div className='line-chart'>
        <Line data={data} options={options} />
      </div>

    </>
  )
}

export default memo(LineChart)

LineChart.propTypes = {
  chartData: PropTypes.string,
  getCurrencyLogo: PropTypes.object
}
