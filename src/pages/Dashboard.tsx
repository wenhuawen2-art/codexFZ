import LeftDashboard from '../components/LeftDashboard'
import LeftSidebarShell from '../components/layout/LeftSidebarShell'
import RightDashboard from '../components/RightDashboard'
import UeViewport from '../components/UeViewport'
import ConfirmDialog from '../components/controls/ConfirmDialog'
import { useDashboard } from '../hooks/useDashboard'
import { syncDeviceState, syncScene } from '../lib/ueBridge'
import { useEffect } from 'react'
import {
  formatAcquisition,
  formatSeed,
  formatSnspd,
  formatTelescope,
  formatTriState,
} from '../utils/controlLabels'

function DashboardContent() {
  const {
    state,
    requestControl,
    confirmControl,
    cancelControl,
    updateParams,
    queryHistory,
  } = useDashboard()
  const { realtime, pendingControl, userRole, mainScene, thumbnailScenes } = state

  useEffect(() => {
    syncScene(mainScene, thumbnailScenes)
    syncDeviceState(realtime.controls)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex h-full overflow-hidden bg-transparent">
      <LeftSidebarShell systemStatus={realtime.systemStatus}>
        <LeftDashboard
          realtime={realtime}
          onParamChange={(key, value) => updateParams({ [key]: value })}
          onQuery={queryHistory}
        />
      </LeftSidebarShell>
      <UeViewport />
      <RightDashboard
        controls={realtime.controls}
        connections={realtime.connections}
        userRole={userRole}
        onLaserChange={(id, field, value) => {
          const laser = realtime.controls.lasers.find((l) => l.id === id)!
          requestControl(
            { deviceName: `激光器${id}`, field, value },
            formatTriState(laser[field]),
            formatTriState(value),
            '激光控制操作，请确认设备状态安全。',
          )
        }}
        onSeedLaserChange={(value) =>
          requestControl(
            { deviceName: '种子激光器', field: 'mode', value },
            formatSeed(realtime.controls.seedLaser),
            formatSeed(value),
            '种子激光器模式切换，请确认光路安全。',
          )
        }
        onTelescopeChange={(id, mode) => {
          const tel = realtime.controls.telescopes.find((t) => t.id === id)!
          requestControl(
            { deviceName: `望远镜${id}`, field: 'mode', value: mode },
            formatTelescope(tel.mode),
            formatTelescope(mode),
            '望远镜指向变更，请确认观测区域安全。',
          )
        }}
        onSnspdChange={(value) =>
          requestControl(
            { deviceName: '超导探测器', field: 'mode', value },
            formatSnspd(realtime.controls.snspd),
            formatSnspd(value),
            'SNSPD模式切换，请确认制冷与光路状态。',
          )
        }
        onTcspcChange={(value) =>
          requestControl(
            { deviceName: 'TCSPC', field: 'mode', value },
            formatTriState(realtime.controls.tcspc),
            formatTriState(value),
            'TCSPC开关操作，请确认计数链路状态。',
          )
        }
        onAcquisitionChange={(value) =>
          requestControl(
            { deviceName: '数据采集', field: 'mode', value },
            formatAcquisition(realtime.controls.acquisition),
            formatAcquisition(value),
            '数据采集模式变更，请确认存储与观测计划。',
          )
        }
      />
      <ConfirmDialog
        pending={pendingControl}
        onConfirm={confirmControl}
        onCancel={cancelControl}
      />
    </div>
  )
}

function Dashboard() {
  return <DashboardContent />
}

export default Dashboard
