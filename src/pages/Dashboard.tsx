import { useRef } from 'react'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import LeftDashboard from '../components/LeftDashboard'
import RightDashboard from '../components/RightDashboard'
import UeViewport from '../components/UeViewport'
import type { DeviceStatus } from '../components/StatusPanel'
import type { IntensityPoint } from '../components/RadarChart'

const MOCK_STATUS: DeviceStatus = {
  connected: true,
  deviceName: 'LR-360 Pro',
  firmwareVersion: 'v2.4.1',
  scanRate: 20,
  pointCount: 128000,
  lastUpdate: new Date().toISOString(),
}

function generateChartData(): IntensityPoint[] {
  const now = dayjs()
  return Array.from({ length: 20 }, (_, i) => ({
    time: now.subtract(19 - i, 'second').format('HH:mm:ss'),
    intensity: Math.round(40 + Math.random() * 50),
    distance: Math.round(10 + Math.random() * 90),
  }))
}

async function fetchDashboardData(): Promise<{
  status: DeviceStatus
  chartData: IntensityPoint[]
}> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return {
    status: {
      ...MOCK_STATUS,
      scanRate: 18 + Math.round(Math.random() * 4),
      pointCount: 120000 + Math.round(Math.random() * 16000),
      lastUpdate: new Date().toISOString(),
    },
    chartData: generateChartData(),
  }
}

function Dashboard() {
  const { data } = useRequest(fetchDashboardData, {
    pollingInterval: 3000,
    pollingWhenHidden: false,
  })

  const lastData = useRef({
    status: MOCK_STATUS,
    chartData: [] as IntensityPoint[],
  })
  if (data) {
    lastData.current = data
  }

  const { status, chartData } = lastData.current

  return (
    <div className="flex h-full">
      <LeftDashboard status={status} chartData={chartData} />
      <UeViewport />
      <RightDashboard status={status} chartData={chartData} />
    </div>
  )
}

export default Dashboard
