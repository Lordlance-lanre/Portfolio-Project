import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import './Pages.css'
import './Auth.css'
import AppLayout from './components/AppLayout.jsx'
import CustomersPage from './pages/Customers.jsx'
import CustomerDetailPage from './pages/CustomerDetail.jsx'
import OverviewPage from './pages/Overview.jsx'
import LoginPage from './pages/Login.jsx'
import ReportsPage from './pages/Reports.jsx'
import SettingsPage from './pages/Settings.jsx'
import RegisterPage from './pages/Register.jsx'
import AuthGuard from './middleware/AuthGuard.jsx'
import ScrollToTop from './middleware/ScrollToTop.jsx'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/:customerId" element={<CustomerDetailPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App