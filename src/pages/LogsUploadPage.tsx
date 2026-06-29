import LeftSidebarShell from '../components/layout/LeftSidebarShell'
import LogCategoryNav from '../components/logs/LogCategoryNav'
import LogStatBar from '../components/logs/LogStatBar'
import LogFilterBar from '../components/logs/LogFilterBar'
import LogTable from '../components/logs/LogTable'
import LogDetailPanel from '../components/logs/LogDetailPanel'
import LogActionBar from '../components/logs/LogActionBar'
import { useDashboard } from '../hooks/useDashboard'
import { useLogsPage } from '../hooks/useLogsPage'

function LogsUploadPage() {
  const { state } = useDashboard()
  const logs = useLogsPage()

  return (
    <div className="flex h-full overflow-hidden bg-transparent">
      <LeftSidebarShell systemStatus={state.realtime.systemStatus}>
        <LogCategoryNav value={logs.category} onChange={logs.setCategory} />
      </LeftSidebarShell>

      <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-hidden bg-hud-bg p-2">
        <LogStatBar
          stats={logs.stats}
          activeCategory={logs.category}
          activeUploadPreset={logs.activeUploadPreset}
          onStatClick={logs.applyStatClick}
        />
        <LogFilterBar category={logs.category} filters={logs.filters} onChange={logs.setFilters} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pr-2">
            <LogTable
              category={logs.category}
              items={logs.pageItems}
              selectedId={logs.selectedId}
              sortDesc={logs.sortDesc}
              page={logs.page}
              totalPages={logs.totalPages}
              onSelect={logs.setSelectedId}
              onToggleSort={logs.setSortDesc}
              onPageChange={logs.setPage}
            />
          </div>
          <LogDetailPanel item={logs.selectedItem} />
        </div>
        <LogActionBar
          canUpload={logs.canUpload}
          canRetry={logs.canRetry}
          canCancel={logs.canCancel}
          onExport={logs.handleExport}
          onUpload={logs.handleUpload}
          onRetry={logs.handleRetry}
          onCancel={logs.handleCancel}
          onRefresh={logs.handleRefresh}
        />
      </main>
    </div>
  )
}

export default LogsUploadPage
