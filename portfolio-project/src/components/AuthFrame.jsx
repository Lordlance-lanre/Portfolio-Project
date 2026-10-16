import { Link } from 'react-router-dom'

function AuthFrame({ children, mode }) {
  return (
    <main className={`auth-page auth-${mode}`}>
      <section className="auth-story" aria-label="Ledgerline introduction">
        <Link className="auth-brand" to="/login"><span className="brand-mark">l<span>.</span></span><span className="brand-name">ledger<span>line</span></span></Link>
        <div className="story-copy"><span className="auth-eyebrow">FINANCE, IN GOOD ORDER</span><h1>Clarity for every<br />dollar due.</h1><p>Keep a thoughtful eye on balances, customers, and the next right follow-up.</p></div>
        <div className="story-foot"><span>Receivables, with a clearer view.</span><span>01 / 04</span></div>
      </section>
      <section className="auth-form-side">
        <div className="auth-mobile-brand"><Link className="auth-brand" to="/login"><span className="brand-mark">l<span>.</span></span><span className="brand-name">ledger<span>line</span></span></Link></div>
        <div className="auth-form-wrap">{children}</div>
        <p className="auth-legal">By continuing, you agree to keep your account information secure.</p>
      </section>
    </main>
  )
}

export default AuthFrame
