import { useCallback, useEffect, useState } from 'react'
import LeftSidebarShell from '../components/layout/LeftSidebarShell'
import EquipmentSiteSummary from '../components/equipment/EquipmentSiteSummary'
import EquipmentSceneTree from '../components/equipment/EquipmentSceneTree'
import EquipmentContextMenu from '../components/equipment/EquipmentContextMenu'
import EquipmentRoomViewport from '../components/equipment/EquipmentRoomViewport'
import ObjectPropertyPanel from '../components/equipment/ObjectPropertyPanel'
import ConfirmDialog from '../components/controls/ConfirmDialog'
import { useDashboard } from '../hooks/useDashboard'
import { useDeviceControlHandlers } from '../hooks/useDeviceControlHandlers'
import {
  collectDefaultExpandedIds,
  createDefaultVisibleLayers,
  getNodeFocus,
  type EquipmentContextAction,
  type EquipmentLayerKey,
  type EquipmentQuickActionId,
  type EquipmentTreeNode,
} from '../constants/equipmentRoom'
import {
  syncDeviceState,
  syncEquipmentFocus,
  syncEquipmentLayers,
  syncEquipmentQuickAction,
} from '../lib/ueBridge'
import { getPrimarySiteLabel } from '../utils/siteLabel'

interface ContextMenuState {
  node: EquipmentTreeNode
  x: number
  y: number
}

function EquipmentRoomPage() {
  const { state, requestControl, confirmControl, cancelControl } = useDashboard()
  const { realtime, pendingControl } = state
  const [visibleLayers, setVisibleLayers] = useState(createDefaultVisibleLayers)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState(() => new Set(collectDefaultExpandedIds()))
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)
  const [transparentMode, setTransparentMode] = useState(false)

  const controlHandlers = useDeviceControlHandlers(
    requestControl,
    realtime.controls,
    realtime.params.skylightStatus,
  )

  useEffect(() => {
    syncDeviceState(realtime.controls)
  }, [realtime.controls])

  const handleToggleLayer = (key: EquipmentLayerKey) => {
    setVisibleLayers((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      syncEquipmentLayers(next)
      return next
    })
  }

  const handleFocusNode = useCallback((node: EquipmentTreeNode) => {
    setSelectedNodeId(node.id)
    syncEquipmentFocus(node.id, getNodeFocus(node))
  }, [])

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleContextMenu = (node: EquipmentTreeNode, x: number, y: number) => {
    setContextMenu({ node, x, y })
  }

  const handleQuickAction = (action: EquipmentContextAction) => {
    const nodeId = contextMenu?.node.id ?? selectedNodeId ?? ''
    syncEquipmentQuickAction(action.id as EquipmentQuickActionId, nodeId)

    if (action.id === 'skylight-open') {
      controlHandlers.onSkylightChange('open')
    } else if (action.id === 'skylight-close') {
      controlHandlers.onSkylightChange('closed')
    }
  }

  const contextNode = contextMenu?.node ?? null
  const contextActions = contextNode?.contextActions ?? []

  return (
    <div className="flex h-full overflow-hidden bg-transparent">
      <LeftSidebarShell systemStatus={realtime.systemStatus}>
        <EquipmentSiteSummary
          siteName={getPrimarySiteLabel(state.sunEarthSettings.sites)}
          localTime={realtime.beijingTime}
          weather={realtime.weather}
        />
        <EquipmentSceneTree
          visibleLayers={visibleLayers}
          selectedNodeId={selectedNodeId}
          expandedIds={expandedIds}
          onToggleLayer={handleToggleLayer}
          onFocusNode={handleFocusNode}
          onToggleExpand={handleToggleExpand}
          onContextMenu={handleContextMenu}
        />
      </LeftSidebarShell>
      <EquipmentRoomViewport
        sunrise={realtime.localSunrise}
        sunset={realtime.localSunset}
        transparentMode={transparentMode}
        onTransparentToggle={() => setTransparentMode((v) => !v)}
      />
      <ObjectPropertyPanel
        selectedNodeId={selectedNodeId}
        controls={realtime.controls}
        userRole={state.userRole}
        controlHandlers={controlHandlers}
        visibleLayers={visibleLayers}
        skylightStatus={realtime.params.skylightStatus}
      />
      {contextMenu && contextActions.length > 0 && (
        <EquipmentContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          actions={contextActions}
          onAction={handleQuickAction}
          onClose={() => setContextMenu(null)}
        />
      )}
      <ConfirmDialog
        pending={pendingControl}
        onConfirm={confirmControl}
        onCancel={cancelControl}
      />
    </div>
  )
}

export default EquipmentRoomPage
