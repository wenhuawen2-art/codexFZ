import { createContext, useContext, type ReactNode } from 'react'

export interface UeLeftPanelDimensions {
  width: number
  height: number
}

const UeLeftPanelContext = createContext<UeLeftPanelDimensions>({ width: 0, height: 0 })

export function UeLeftPanelProvider({
  value,
  children,
}: {
  value: UeLeftPanelDimensions
  children: ReactNode
}) {
  return <UeLeftPanelContext.Provider value={value}>{children}</UeLeftPanelContext.Provider>
}

export function useUeLeftPanelSize(): UeLeftPanelDimensions {
  return useContext(UeLeftPanelContext)
}
