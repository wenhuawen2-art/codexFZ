import dayjs from 'dayjs'

export function downloadCsv(
  headers: string[],
  rows: string[][],
  filenamePrefix: string,
) {
  const content = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filenamePrefix}_${dayjs().format('YYYYMMDDHHmmss')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function escapeCsvCell(value: unknown): string {
  if (value == null) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}
