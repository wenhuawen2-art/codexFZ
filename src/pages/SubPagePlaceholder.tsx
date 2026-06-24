import LeftSidebarShell from '../components/layout/LeftSidebarShell'
import { useDashboard } from '../hooks/useDashboard'

interface SubPagePlaceholderProps {
  title: string
}

function SubPagePlaceholder({ title }: SubPagePlaceholderProps) {
  const { state } = useDashboard()

  return (
    <div className="flex h-full overflow-hidden bg-transparent">
      <LeftSidebarShell systemStatus={state.realtime.systemStatus} />
      <main className="flex flex-1 items-center justify-center bg-hud-bg text-sm text-hud-muted">
        {title}（待实现）
      </main>
    </div>
  )
}

export default SubPagePlaceholder
