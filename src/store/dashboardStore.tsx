import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { createInitialState } from '../mocks/dashboard'
import type { DashboardAction, DashboardState, SceneId } from '../types/dashboard'

function getThumbnails(main: SceneId): [SceneId, SceneId] {
  const all: SceneId[] = ['radar', 'sunEarth', 'magnetic']
  const rest = all.filter((s) => s !== main)
  return [rest[0], rest[1]]
}

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case 'SET_REALTIME':
      return { ...state, realtime: action.payload }
    case 'PATCH_PARAMS':
      return {
        ...state,
        realtime: {
          ...state.realtime,
          params: { ...state.realtime.params, ...action.payload },
        },
      }
    case 'SET_CONTROLS':
      return {
        ...state,
        realtime: { ...state.realtime, controls: action.payload },
      }
    case 'SWAP_SCENE': {
      const clicked = action.payload
      if (clicked === state.mainScene) return state
      const newThumbs = state.thumbnailScenes.map((s) =>
        s === clicked ? state.mainScene : s,
      ) as [SceneId, SceneId]
      return { ...state, mainScene: clicked, thumbnailScenes: newThumbs }
    }
    case 'SET_RADAR_VIEW':
      return { ...state, radarView: action.payload }
    case 'SET_SUN_EARTH_VIEW':
      return { ...state, sunEarthView: action.payload }
    case 'PATCH_SUN_EARTH_SETTINGS':
      return {
        ...state,
        sunEarthSettings: { ...state.sunEarthSettings, ...action.payload },
      }
    case 'SET_MAGNETIC_VIEW':
      return {
        ...state,
        magneticView: action.payload,
        magneticSettings: {
          ...state.magneticSettings,
          sectionEnabled: action.payload === 'section',
        },
      }
    case 'PATCH_MAGNETIC_SETTINGS':
      return {
        ...state,
        magneticSettings: { ...state.magneticSettings, ...action.payload },
      }
    case 'ADD_LOG':
      return {
        ...state,
        operationLogs: [action.payload, ...state.operationLogs].slice(0, 50),
      }
    case 'SET_PENDING_CONTROL':
      return { ...state, pendingControl: action.payload }
    case 'REFRESH_DARK_NOISE':
      return {
        ...state,
        realtime: {
          ...state.realtime,
          sceneCharts: {
            ...state.realtime.sceneCharts,
            darkNoise: action.payload,
          },
        },
      }
    default:
      return state
  }
}

const DashboardStateContext = createContext<DashboardState | null>(null)
const DashboardDispatchContext = createContext<Dispatch<DashboardAction> | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, undefined, createInitialState)
  return (
    <DashboardStateContext.Provider value={state}>
      <DashboardDispatchContext.Provider value={dispatch}>
        {children}
      </DashboardDispatchContext.Provider>
    </DashboardStateContext.Provider>
  )
}

export function useDashboardState() {
  const ctx = useContext(DashboardStateContext)
  if (!ctx) throw new Error('useDashboardState must be used within DashboardProvider')
  return ctx
}

export function useDashboardDispatch() {
  const ctx = useContext(DashboardDispatchContext)
  if (!ctx) throw new Error('useDashboardDispatch must be used within DashboardProvider')
  return ctx
}

export { getThumbnails }
