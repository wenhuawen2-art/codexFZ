import { CONNECTION_STATUS_LABELS } from '../../constants/labels'
import type { ConnectionStatus, DataConnectionItem } from '../../types/dashboard'

interface ConnectionListProps {
  connections: DataConnectionItem[]
}

function ConnectionStatusIcon({ status }: { status: ConnectionStatus }) {
  if (status === 'online') {
    return <span className="hud-indicator-on shrink-0" aria-hidden />
  }
  if (status === 'offline') {
    return <span className="h-1.5 w-1.5 shrink-0 bg-hud-accent" aria-hidden />
  }
  return <span className="hud-indicator-off shrink-0" aria-hidden />
}

function ConnectionList({ connections }: ConnectionListProps) {
  const legendStatuses: ConnectionStatus[] = ['online', 'offline', 'disconnected']

  return (
    <div className="flex flex-col gap-0.5">
      {connections.map((item) => (
        <div
          key={item.key}
          className="grid grid-cols-[auto_minmax(0,1fr)_18px] gap-1"
          title={
            item.lastUpdated
              ? `${item.label} · ${CONNECTION_STATUS_LABELS[item.status]} · ${item.lastUpdated}`
              : `${item.label} · ${CONNECTION_STATUS_LABELS[item.status]}`
          }
        >
          <div className="min-w-[22px] shrink-0 bg-hud-list px-1 py-px text-2xs leading-tight text-hud-text">
            {item.id}
          </div>
          <div className="truncate bg-hud-list px-1 py-px text-2xs leading-tight text-hud-text">
            {item.label}
          </div>
          <div
            className="flex items-center justify-center bg-hud-list py-px"
            aria-label={CONNECTION_STATUS_LABELS[item.status]}
          >
            <ConnectionStatusIcon status={item.status} />
          </div>
        </div>
      ))}
      <div
        className="mt-0.5 flex flex-nowrap gap-x-2 overflow-hidden border-t border-hud-border/20 pt-1"
        aria-label="连接状态图例"
      >
        {legendStatuses.map((status) => (
          <div key={status} className="flex shrink-0 items-center gap-1 text-2xs leading-none text-hud-muted">
            <ConnectionStatusIcon status={status} />
            <span className="truncate">{CONNECTION_STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ConnectionList
