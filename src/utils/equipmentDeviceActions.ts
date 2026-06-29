export type EquipmentActionKind =
  | { type: 'laser'; id: number }
  | { type: 'telescope'; id: number }
  | { type: 'snspd' }
  | { type: 'seed-laser' }
  | { type: 'tcspc' }
  | { type: 'skylight' }
  | { type: 'cooling-readonly' }
  | { type: 'none' }

export function getEquipmentActionKind(nodeId: string | null): EquipmentActionKind {
  if (!nodeId) return { type: 'none' }

  const laserMatch = nodeId.match(/^laser-(\d+)$/)
  if (laserMatch) {
    return { type: 'laser', id: Number(laserMatch[1]) }
  }

  const telMatch = nodeId.match(/^tel-group-(\d+)$/)
  if (telMatch) {
    return { type: 'telescope', id: Number(telMatch[1]) }
  }

  if (nodeId === 'type-snspd') {
    return { type: 'snspd' }
  }

  if (nodeId === 'type-seed-laser') {
    return { type: 'seed-laser' }
  }

  if (nodeId === 'type-tcspc') {
    return { type: 'tcspc' }
  }

  if (nodeId === 'device-skylight') {
    return { type: 'skylight' }
  }

  if (nodeId === 'type-cooling') {
    return { type: 'cooling-readonly' }
  }

  return { type: 'none' }
}
