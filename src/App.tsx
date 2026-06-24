import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import EquipmentRoomPage from './pages/EquipmentRoomPage'
import LogsUploadPage from './pages/LogsUploadPage'
import { DashboardProvider } from './store/dashboardStore'

function App() {
  return (
    <HashRouter>
      <DashboardProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipment-room" element={<EquipmentRoomPage />} />
          <Route path="/logs" element={<LogsUploadPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DashboardProvider>
    </HashRouter>
  )
}

export default App
