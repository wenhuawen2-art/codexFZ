import { useCallback } from 'react'
import { useRequest } from 'ahooks'
import dayjs from 'dayjs'
import {
  executeControl,
  fetchHistoryCurve,
  fetchRealtime,
  patchParams,
  refreshDarkNoise,
} from '../services/dashboardService'
import { syncDeviceState, syncMagneticSettings, syncMagneticView, syncRadarView, syncScene, syncSunEarthSettings, syncSunEarthView } from '../lib/ueBridge'
import { useDashboardDispatch, useDashboardState } from '../store/dashboardStore'
import type {
  ControlCommand,
  HistoryQuery,
  MagneticSettings,
  MagneticView,
  RadarView,
  SceneId,
  SunEarthSettings,
  SunEarthView,
  SystemParams,
} from '../types/dashboard'

export function useDashboard() {
  const state = useDashboardState()
  const dispatch = useDashboardDispatch()

  useRequest(fetchRealtime, {
    pollingInterval: 1000,
    pollingWhenHidden: false,
    onSuccess: (data) => dispatch({ type: 'SET_REALTIME', payload: data }),
  })

  const swapScene = useCallback(
    (scene: SceneId) => {
      dispatch({ type: 'SWAP_SCENE', payload: scene })
      const newMain = scene
      const thumbs = state.thumbnailScenes.map((s) =>
        s === scene ? state.mainScene : s,
      ) as [SceneId, SceneId]
      syncScene(newMain, thumbs)
    },
    [dispatch, state.mainScene, state.thumbnailScenes],
  )

  const setRadarView = useCallback(
    (view: RadarView) => {
      dispatch({ type: 'SET_RADAR_VIEW', payload: view })
      syncRadarView(view)
    },
    [dispatch],
  )

  const setSunEarthView = useCallback(
    (view: SunEarthView) => {
      dispatch({ type: 'SET_SUN_EARTH_VIEW', payload: view })
      syncSunEarthView(view)
    },
    [dispatch],
  )

  const patchSunEarthSettings = useCallback(
    (patch: Partial<SunEarthSettings>) => {
      dispatch({ type: 'PATCH_SUN_EARTH_SETTINGS', payload: patch })
      syncSunEarthSettings({ ...state.sunEarthSettings, ...patch })
    },
    [dispatch, state.sunEarthSettings],
  )

  const setMagneticView = useCallback(
    (view: MagneticView) => {
      dispatch({ type: 'SET_MAGNETIC_VIEW', payload: view })
      syncMagneticView(view)
      syncMagneticSettings({
        ...state.magneticSettings,
        sectionEnabled: view === 'section',
      })
    },
    [dispatch, state.magneticSettings],
  )

  const patchMagneticSettings = useCallback(
    (patch: Partial<MagneticSettings>) => {
      dispatch({ type: 'PATCH_MAGNETIC_SETTINGS', payload: patch })
      syncMagneticSettings({ ...state.magneticSettings, ...patch })
    },
    [dispatch, state.magneticSettings],
  )

  const requestControl = useCallback(
    (cmd: ControlCommand, oldValue: string, newValue: string, risk: string) => {
      if (state.userRole === 'viewer' || state.userRole === 'display') return
      dispatch({
        type: 'SET_PENDING_CONTROL',
        payload: {
          deviceName: cmd.deviceName,
          field: cmd.field,
          oldValue,
          newValue,
          risk,
          onConfirm: async () => {
            const { controls, log } = await executeControl(cmd, state)
            dispatch({ type: 'SET_CONTROLS', payload: controls })
            dispatch({ type: 'ADD_LOG', payload: log })
            syncDeviceState(controls)
            dispatch({ type: 'SET_PENDING_CONTROL', payload: null })
          },
        },
      })
    },
    [dispatch, state],
  )

  const confirmControl = useCallback(async () => {
    if (state.pendingControl) await state.pendingControl.onConfirm()
  }, [state.pendingControl])

  const cancelControl = useCallback(() => {
    dispatch({ type: 'SET_PENDING_CONTROL', payload: null })
  }, [dispatch])

  const updateParams = useCallback(
    (params: Partial<SystemParams>) => {
      patchParams(params)
      dispatch({ type: 'PATCH_PARAMS', payload: params })
      dispatch({
        type: 'ADD_LOG',
        payload: {
          id: crypto.randomUUID(),
          timestamp: dayjs().toISOString(),
          user: 'operator',
          deviceName: '系统参数',
          eventType: 'param',
          content: '参数修改',
          oldValue: '',
          newValue: JSON.stringify(params),
          result: 'success',
        },
      })
    },
    [dispatch],
  )

  const refreshNoise = useCallback(() => {
    const darkNoise = refreshDarkNoise()
    dispatch({ type: 'REFRESH_DARK_NOISE', payload: darkNoise })
  }, [dispatch])

  const queryHistory = useCallback((query: HistoryQuery) => {
    return fetchHistoryCurve(query)
  }, [])

  return {
    state,
    swapScene,
    setRadarView,
    setSunEarthView,
    patchSunEarthSettings,
    setMagneticView,
    patchMagneticSettings,
    requestControl,
    confirmControl,
    cancelControl,
    updateParams,
    refreshNoise,
    queryHistory,
  }
}
