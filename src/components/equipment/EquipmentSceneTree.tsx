import clsx from 'clsx'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { viewportToDesignPoint } from '../../lib/autofit'
import {
  EQUIPMENT_SCENE_TREE,
  type EquipmentLayerKey,
  type EquipmentTreeNode,
} from '../../constants/equipmentRoom'

interface EquipmentSceneTreeProps {
  visibleLayers: Record<EquipmentLayerKey, boolean>
  selectedNodeId: string | null
  expandedIds: Set<string>
  onToggleLayer: (key: EquipmentLayerKey) => void
  onFocusNode: (node: EquipmentTreeNode) => void
  onToggleExpand: (id: string) => void
  onContextMenu: (node: EquipmentTreeNode, x: number, y: number) => void
}

interface TreeRowProps {
  node: EquipmentTreeNode
  depth: number
  visibleLayers: Record<EquipmentLayerKey, boolean>
  selectedNodeId: string | null
  expandedIds: Set<string>
  onToggleLayer: (key: EquipmentLayerKey) => void
  onFocusNode: (node: EquipmentTreeNode) => void
  onToggleExpand: (id: string) => void
  onContextMenu: (node: EquipmentTreeNode, x: number, y: number) => void
}

function TreeRow({
  node,
  depth,
  visibleLayers,
  selectedNodeId,
  expandedIds,
  onToggleLayer,
  onFocusNode,
  onToggleExpand,
  onContextMenu,
}: TreeRowProps) {
  const hasChildren = Boolean(node.children?.length)
  const expanded = expandedIds.has(node.id)
  const selected = selectedNodeId === node.id
  const paddingLeft = 4 + depth * 10

  const handleRowClick = () => {
    onFocusNode(node)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!node.contextActions?.length) return
    e.preventDefault()
    const { x, y } = viewportToDesignPoint(e.clientX, e.clientY)
    onContextMenu(node, x, y)
  }

  return (
    <>
      <div
        role="treeitem"
        aria-expanded={hasChildren ? expanded : undefined}
        className={clsx(
          'group flex min-h-[22px] cursor-pointer items-center gap-0.5 py-0.5 pr-0.5 text-2xs leading-tight',
          selected && 'bg-hud-list/50',
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={handleRowClick}
        onContextMenu={handleContextMenu}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={expanded ? '折叠' : '展开'}
            className="flex h-4 w-4 shrink-0 items-center justify-center text-hud-muted hover:text-hud-text"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand(node.id)
            }}
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            )}
          </button>
        ) : (
          <span className="inline-block h-4 w-4 shrink-0" aria-hidden />
        )}
        <span
          className={clsx(
            'min-w-0 flex-1 truncate',
            selected ? 'text-hud-accent' : 'text-hud-text',
          )}
        >
          {node.label}
        </span>
        {node.layerKey != null && (
          <input
            type="checkbox"
            checked={visibleLayers[node.layerKey]}
            aria-label={`显示 ${node.label}`}
            className="hud-checkbox ml-auto"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation()
              onToggleLayer(node.layerKey!)
            }}
          />
        )}
      </div>
      {hasChildren && expanded && (
        <div role="group">
          {node.children!.map((child) => (
            <TreeRow
              key={child.id}
              node={child}
              depth={depth + 1}
              visibleLayers={visibleLayers}
              selectedNodeId={selectedNodeId}
              expandedIds={expandedIds}
              onToggleLayer={onToggleLayer}
              onFocusNode={onFocusNode}
              onToggleExpand={onToggleExpand}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </>
  )
}

function EquipmentSceneTree({
  visibleLayers,
  selectedNodeId,
  expandedIds,
  onToggleLayer,
  onFocusNode,
  onToggleExpand,
  onContextMenu,
}: EquipmentSceneTreeProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto" role="tree">
        {EQUIPMENT_SCENE_TREE.map((node) => (
          <TreeRow
            key={node.id}
            node={node}
            depth={0}
            visibleLayers={visibleLayers}
            selectedNodeId={selectedNodeId}
            expandedIds={expandedIds}
            onToggleLayer={onToggleLayer}
            onFocusNode={onFocusNode}
            onToggleExpand={onToggleExpand}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
    </div>
  )
}

export default EquipmentSceneTree
