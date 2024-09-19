import React, { useRef } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ScriptableContext,
  BarElement,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
)

export default function Charts() {
  const chartRef = useRef(null)

  const firstChartData = {
    labels: ['اليوم', '3 أشهر', '6 أشهر', '9 أشهر', 'سنة واحدة'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [3, 2, 5, 1, 4],
        borderColor: '#276749',
        backgroundColor: '#276749',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 4,
      },
      {
        label: 'Dataset 2',
        data: [1, 4, 2, 5, 3],
        borderColor: '#2C7A7B',
        backgroundColor: '#2C7A7B',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 4,
      },
      {
        label: 'Dataset 3',
        data: [2, 3, 4, 2, 5],
        borderColor: '#234E52',
        backgroundColor: '#234E52',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 4,
      },
    ],
  }

  const firstChartOptions = {
    responsive: true,

    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        reverse: true,
      },
      y: {
        grid: {
          color: '#E2E8F0',
        },
        beginAtZero: true,
      },
    },
  }

  const SecondChartData = {
    labels: ['06 ص', '07 ص', '08 ص', '09 ص', '10 ص'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [30, 20, 50, 25, 40],
        backgroundColor: (context: ScriptableContext<'bar'>) => {
          const chart = context.chart
          const { ctx, chartArea } = chart

          if (!chartArea) {
            return null
          }
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          )

          gradient.addColorStop(0, 'rgba(0, 124, 143, 0.1)')
          gradient.addColorStop(1, 'rgba(0, 124, 143, 1)')

          return gradient
        },
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 8,
        maxBarThickness: 8,
      },
    ],
  }

  const SecondChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'Arial',
            size: 14,
            weight: 'bold',
          },
          color: '#334155',
        },
      },
      y: {
        grid: {
          color: '#E2E8F0',
        },
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
      },
    },
  }

  return (
    <div className="flex flex-col md:flex-row justify-evenly items-start gap-8 mx-auto">
      {/* الجدارية الصوتية */}
      <div className="flex flex-col">
        <h1 className="text-right text-[#00758A] text-[24px]">
          الجدارية الصوتية
        </h1>
        <div className="flex flex-col items-center justify-center gap-8 p-4">
          <div
            style={{
              width: '600px',
              margin: '0 auto',
              boxShadow: '0px 3px 6px #00000016',
              borderRadius: '24px',
              border: '0.5px solid #00000016',
            }}
            className="shadow-lg rounded-2xl p-2">
            <Line data={firstChartData} options={firstChartOptions} />
          </div>
          <div className="flex items-center justify-center gap-8 p-4">
            <div className="flex items-center justify-center gap-8 p-4">
              <div className="flex flex-col items-center space-x-2">
                <div className="flex justify-between items-center gap-6">
                  <span className="text-2xl font-bold text-[#103357]">
                    1235
                  </span>
                  <span
                    className="w-3 h-3 bg-[#103357] rounded-full drop-shadow-2xl"
                    style={{
                      boxShadow: '0 0 20px 10px rgba(10, 20, 50, 0.2)',
                    }}></span>
                </div>
                <span className="flex flex-row-reverse items-center text-[#103357] mt-2">
                  الساعات المسجلة{' '}
                  <ClockIcon
                    className="ml-1"
                    style={{ width: '20px', height: '20px', fontSize: '20px' }}
                  />
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center space-x-2">
              <div className="flex justify-between items-center gap-6">
                <span className="text-2xl font-bold text-[#219F8A]">521</span>
                <span
                  className="w-3 h-3 bg-[#219F8A] rounded-full drop-shadow-2xl"
                  style={{
                    boxShadow: '0 0 20px 10px rgba(33, 159, 138, 0.2)', // Adjust the spread, blur, and color
                  }}></span>
              </div>
              <p className="flex flex-row-reverse items-center text-[#219F8A] mt-2">
                الساعات المدققة{' '}
                <CheckCircleIcon
                  className="ml-1"
                  style={{ width: '20px', height: '20px' }}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* الأصوات النشطة على الشبكة الآن */}
      <div className="flex flex-col items-start">
        <h1 className="text-right text-[#00758A] text-[24px] mb-4">
          الأصوات النشطة على الشبكة الآن
        </h1>
        <div
          style={{
            width: '600px',
            margin: '0 auto',
            boxShadow: '0px 3px 6px #00000016',
            borderRadius: '24px',
            border: '0.5px solid #00000016',
          }}
          className="p-2">
          <Bar
            ref={chartRef}
            data={SecondChartData}
            options={SecondChartOptions}
          />
        </div>
      </div>
    </div>
  )
}
