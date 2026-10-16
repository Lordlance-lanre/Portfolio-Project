import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { RECENT_ACTIVITY } from '../utils/receivables.js'
import Icon from './Icon.jsx'
import Sidebar from './Sidebar.jsx'

function AppLayout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ar-theme') || 'light')
  const [activityOpen, setActivityOpen] = useState(false)
  const [notice, setNotice] = useState('')

  function toggleTheme() {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('ar-theme', nextTheme)
  }

  function announce(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  return (
    <div className={`app-shell flex min-h-screen transition-colors duration-300 theme-${theme}`}>
      <Sidebar />
      <main className="main-content min-w-0 flex-1">
        <header className="topbar relative z-10 flex items-center justify-between">
          <div className="breadcrumb"><span>Finance</span><span className="crumb-separator">/</span><strong>Receivables</strong></div>
          <div className="top-actions">
            <button className="icon-button theme-button" type="button" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={toggleTheme}><Icon name={theme === 'light' ? 'moon' : 'sun'} /></button>
            <button className="activity-button" type="button" onClick={() => setActivityOpen((open) => !open)}><Icon name="clock" size={16} /><span>Activity</span><span className="activity-dot" /></button>
            <span className="top-avatar">AM</span>
          </div>
          {activityOpen && <div className="activity-popover"><div className="popover-heading"><strong>Recent activity</strong><button className="icon-button" type="button" onClick={() => setActivityOpen(false)} aria-label="Close activity"><Icon name="close" size={16} /></button></div>{RECENT_ACTIVITY.map((activity) => <div className="activity-item" key={activity.title}><span className={`activity-marker ${activity.tone}-marker`} /><div><strong>{activity.title}</strong><p>{activity.detail}</p><small>{activity.time}</small></div></div>)}</div>}
        </header>
        <Outlet context={{ theme, setTheme, announce }} />
      </main>
      {notice && <div className="toast" role="status">{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}><Icon name="close" size={15} /></button></div>}
    </div>
  )
}

export default AppLayout