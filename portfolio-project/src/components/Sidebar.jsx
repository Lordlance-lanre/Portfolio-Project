import { NavLink, useNavigate } from 'react-router-dom'
import { NAV_ITEMS } from '../utils/receivables.js'
import { getSessionUser, signOut } from '../utils/auth.js'
import Icon from './Icon.jsx'

function Sidebar() {
  const navigate = useNavigate()
  const sessionUser = getSessionUser()
  const initials = (sessionUser?.name || 'Alex Morgan').split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase()

  function handleSignOut() {
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="sidebar sticky top-0 z-10 flex h-screen min-h-screen flex-col">
      <NavLink className="brand" to="/overview" aria-label="Ledgerline overview"><span className="brand-mark">l<span>.</span></span><span className="brand-name">ledger<span>line</span></span></NavLink>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}><Icon name={item.icon} /><span>{item.label}</span></NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="plan-banner"><div className="plan-icon">✳</div><strong>Make every day<br />a collection day.</strong><span>You're on top of it.</span><div className="plan-progress"><i /></div></div>
        <button className="profile-button" type="button" onClick={handleSignOut} aria-label="Sign out"><span className="profile-avatar">{initials}</span><span className="profile-copy"><strong>{sessionUser?.name || 'Alex Morgan'}</strong><small>Sign out</small></span><Icon name="down" size={15} /></button>
      </div>
    </aside>
  )
}

export default Sidebar