import type { SunEarthSite } from '../types/dashboard'

export function getPrimarySiteLabel(sites: SunEarthSite[]): string {
  return sites.find((s) => s.preset)?.label ?? sites[0]?.label ?? '昆明站'
}
