import HudPanel from '../hud/HudPanel'
import HudDataRow from '../hud/HudDataRow'
import HudBadge from '../hud/HudBadge'
import {
  LOG_CATEGORY_LABELS,
  LOG_EVENT_LEVEL_LABELS,
  LOG_EVENT_TYPE_LABELS,
  UPLOAD_STATUS_LABELS,
  UPLOAD_STATUS_VARIANT,
} from '../../constants/logs'
import { formatLogTime } from '../../lib/formatLogTime'
import type { LogListItem } from '../../types/logs'
import type { OperationLog } from '../../types/dashboard'

interface LogDetailPanelProps {
  item: LogListItem | null
}

function OperationDetail({ data }: { data: OperationLog }) {
  return (
    <>
      <HudDataRow label="时间" value={formatLogTime(data.timestamp)} />
      <HudDataRow label="用户" value={data.user} />
      <HudDataRow label="设备" value={data.deviceName} />
      <HudDataRow label="类型" value={LOG_EVENT_TYPE_LABELS[data.eventType]} />
      <HudDataRow label="内容" value={data.content} />
      {data.eventType === 'param' && data.paramName && (
        <HudDataRow label="参数名" value={data.paramName} />
      )}
      {data.oldValue && <HudDataRow label="变更前" value={data.oldValue} />}
      {data.newValue && <HudDataRow label="变更后" value={data.newValue} />}
      {data.eventType === 'param' && (
        <HudDataRow label="单位" value={data.unit || '—'} />
      )}
      {data.eventType === 'user' && data.clientIp && (
        <HudDataRow label="IP" value={data.clientIp} />
      )}
      {data.eventType === 'user' && data.terminal && (
        <HudDataRow label="终端" value={data.terminal} />
      )}
      <div className="flex items-center justify-between py-0.5">
        <span className="text-2xs text-hud-muted">结果</span>
        <HudBadge
          label={data.result === 'success' ? '成功' : '失败'}
          variant={data.result === 'success' ? 'online' : 'alert'}
        />
      </div>
      {data.result === 'failure' && data.failureReason && (
        <HudDataRow label="失败原因" value={data.failureReason} valueClassName="text-hud-alert" />
      )}
    </>
  )
}

function LogDetailPanel({ item }: LogDetailPanelProps) {
  return (
    <aside className="flex h-full w-[226px] shrink-0 flex-col overflow-hidden border-l border-hud-border/30 pl-2">
      <HudPanel title="详情" className="min-h-0 flex-1 overflow-y-auto">
        {!item ? (
          <p className="text-2xs text-hud-muted">选择列表条目查看完整字段</p>
        ) : (
          <div className="space-y-0.5">
            <HudDataRow label="分类" value={LOG_CATEGORY_LABELS[item.category]} />
            {item.category === 'operation' && <OperationDetail data={item.data} />}
            {item.category === 'exception' && (
              <>
                <HudDataRow label="时间" value={formatLogTime(item.data.timestamp)} />
                <HudDataRow label="等级" value={LOG_EVENT_LEVEL_LABELS[item.data.level]} />
                <HudDataRow label="来源" value={item.data.source} />
                <HudDataRow label="设备" value={item.data.deviceName} />
                <HudDataRow label="内容" value={item.data.content} />
                <HudDataRow label="状态" value={item.data.status === 'open' ? '待处理' : '已处理'} />
                {item.data.handler && <HudDataRow label="处理人" value={item.data.handler} />}
                {item.data.remark && <HudDataRow label="处理备注" value={item.data.remark} />}
              </>
            )}
            {item.category === 'dataFile' && (
              <>
                <HudDataRow label="文件名" value={item.data.fileName} />
                <HudDataRow label="观测时间" value={formatLogTime(item.data.observeTime)} />
                <HudDataRow label="大小" value={item.data.fileSize} />
                <HudDataRow label="数据类型" value={item.data.dataType} />
                <HudDataRow label="存储路径" value={item.data.storagePath} />
                <HudDataRow label="生成状态" value={item.data.generateStatus} />
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-2xs text-hud-muted">上传状态</span>
                  <HudBadge
                    label={UPLOAD_STATUS_LABELS[item.data.uploadStatus]}
                    variant={UPLOAD_STATUS_VARIANT[item.data.uploadStatus]}
                  />
                </div>
                {item.data.failureReason && (
                  <HudDataRow label="失败原因" value={item.data.failureReason} valueClassName="text-hud-alert" />
                )}
              </>
            )}
            {item.category === 'upload' && (
              <>
                <HudDataRow label="时间" value={formatLogTime(item.data.timestamp)} />
                <HudDataRow label="文件名" value={item.data.fileName} />
                <HudDataRow label="时间范围" value={item.data.timeRange} />
                <HudDataRow label="日志类型" value={item.data.logType} />
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-2xs text-hud-muted">上传状态</span>
                  <HudBadge
                    label={UPLOAD_STATUS_LABELS[item.data.uploadStatus]}
                    variant={UPLOAD_STATUS_VARIANT[item.data.uploadStatus]}
                  />
                </div>
                {item.data.progress != null && (
                  <HudDataRow label="进度" value={`${item.data.progress}%`} />
                )}
                {item.data.completedAt && (
                  <HudDataRow label="完成时间" value={formatLogTime(item.data.completedAt)} />
                )}
                {item.data.failureReason && (
                  <HudDataRow label="失败原因" value={item.data.failureReason} valueClassName="text-hud-alert" />
                )}
              </>
            )}
            {item.category === 'export' && (
              <>
                <HudDataRow label="时间" value={formatLogTime(item.data.timestamp)} />
                <HudDataRow label="用户" value={item.data.user} />
                <HudDataRow label="分类" value={LOG_CATEGORY_LABELS[item.data.category]} />
                <HudDataRow label="筛选条件" value={item.data.filterSummary} />
                <HudDataRow label="导出行数" value={String(item.data.rowCount)} />
                <HudDataRow label="格式" value={item.data.format.toUpperCase()} />
                <HudDataRow label="结果" value={item.data.result === 'success' ? '成功' : '失败'} />
              </>
            )}
          </div>
        )}
      </HudPanel>
    </aside>
  )
}

export default LogDetailPanel
