import { useEffect, useState } from 'react'
import HudButton from '../hud/HudButton'
import HudInput from '../hud/HudInput'

interface ParamEditDialogProps {
  open: boolean
  title: string
  label: string
  value: string
  inputType?: 'text' | 'number' | 'datetime-local'
  step?: string
  unit?: string
  onConfirm: (value: string) => void
  onCancel: () => void
}

function ParamEditDialog({
  open,
  title,
  label,
  value,
  inputType = 'text',
  step,
  unit,
  onConfirm,
  onCancel,
}: ParamEditDialogProps) {
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  if (!open) return null

  return (
    <div className="hud-modal-backdrop">
      <div className="hud-modal">
        <p className="text-2xs font-bold uppercase tracking-wider text-hud-viewport">
          {title}
        </p>
        <div className="mt-2 space-y-1">
          <p className="text-2xs text-hud-muted">{label}</p>
          <div className="flex items-center gap-1">
            <HudInput
              type={inputType}
              step={step}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1"
            />
            {unit && <span className="text-2xs text-hud-muted">{unit}</span>}
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <HudButton onClick={onCancel}>取消</HudButton>
          <HudButton variant="active" onClick={() => onConfirm(draft)}>
            确认
          </HudButton>
        </div>
      </div>
    </div>
  )
}

export default ParamEditDialog
