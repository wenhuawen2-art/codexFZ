import LeftDashboard from '../components/LeftDashboard'
import LeftSidebarShell from '../components/layout/LeftSidebarShell'
import RightDashboard from '../components/RightDashboard'
import UeViewport from '../components/UeViewport'
import ConfirmDialog from '../components/controls/ConfirmDialog'
import { useDashboard } from '../hooks/useDashboard'
import { useDeviceControlHandlers } from '../hooks/useDeviceControlHandlers'
import { syncDeviceState, syncScene } from '../lib/ueBridge'
import { useEffect } from 'react'

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

  const controlHandlers = useDeviceControlHandlers(
    requestControl,
    realtime.controls,
    realtime.params.skylightStatus,
  )

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
        {...controlHandlers}
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
