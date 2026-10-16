import { useDashboard } from '../components/useDashboard.js'
import Icon from '../components/Icon.jsx'

function SettingsPage() {
  const { theme, setTheme, announce } = useDashboard()

  function selectTheme(nextTheme) {
    setTheme(nextTheme)
    localStorage.setItem('ar-theme', nextTheme)
    announce(`${nextTheme === 'dark' ? 'Dark' : 'Light'} appearance enabled`)
  }

  return (
    <div className="page-content route-page">
      <div className="page-heading"><div><div className="eyebrow"><span /> PREFERENCES</div><h1>Settings</h1><p className="page-description">Manage the way your workspace looks and behaves.</p></div></div>
      <section className="route-panel settings-panel"><div className="settings-section"><div><span className="panel-kicker">APPEARANCE</span><h2>Color theme</h2><p>Choose a display preference for this browser.</p></div><div className="theme-options"><button className={theme === 'light' ? 'theme-option selected-theme' : 'theme-option'} onClick={() => selectTheme('light')}><Icon name="sun" size={17} /><span>Light</span></button><button className={theme === 'dark' ? 'theme-option selected-theme' : 'theme-option'} onClick={() => selectTheme('dark')}><Icon name="moon" size={17} /><span>Dark</span></button></div></div><div className="settings-section"><div><span className="panel-kicker">WORKSPACE</span><h2>Finance team</h2><p>Regional finance · USD reporting currency</p></div><span className="settings-readonly">Alex Morgan · Administrator</span></div><div className="settings-section"><div><span className="panel-kicker">PAYMENT COLLECTION</span><h2>Payment provider</h2><p>Payment processing is not connected yet.</p></div><span className="connection-status"><i />Not connected</span></div></section>
    </div>
  )
}

export default SettingsPage