import { useEffect } from 'react'
import type { EquipmentContextAction } from '../../constants/equipmentRoom'

interface EquipmentContextMenuProps {
  x: number
  y: number
  actions: EquipmentContextAction[]
  onAction: (action: EquipmentContextAction) => void
  onClose: () => void
}

function EquipmentContextMenu({ x, y, actions, onAction, onClose }: EquipmentContextMenuProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const handleClick = () => onClose()
    window.addEventListener('keydown', handleKey)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      window.removeEventListener('click', handleClick)
    }
  }, [onClose])

  return (
    <div
      className="pointer-events-auto fixed z-50 min-w-[120px] border border-hud-viewport bg-hud-card py-0.5 shadow-lg"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className="block w-full px-2 py-1 text-left text-2xs text-hud-text hover:bg-hud-list/60"
          onClick={() => {
            onAction(action)
            onClose()
          }}
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

export default EquipmentContextMenu
