import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthFrame from '../components/AuthFrame.jsx'
import Icon from '../components/Icon.jsx'
import { loginAccount } from '../utils/auth.js'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/overview'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await loginAccount({ email, password })
      navigate(destination, { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthFrame mode="login">
      <div className="auth-heading"><span className="auth-eyebrow">WELCOME BACK</span><h2>Sign in to Ledgerline</h2><p>Your receivables workspace is ready when you are.</p></div>
      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <label className="auth-field"><span>Email address</span><input type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <div className="auth-field"><label htmlFor="login-password">Password</label><div className="auth-password-wrap"><input id="login-password" type={passwordVisible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /><button className="auth-password-toggle" type="button" aria-label={passwordVisible ? 'Hide password' : 'Show password'} aria-pressed={passwordVisible} onClick={() => setPasswordVisible((visible) => !visible)}><Icon name={passwordVisible ? 'eyeOff' : 'eye'} size={18} /></button></div></div>
        <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}<span aria-hidden="true">→</span></button>
      </form>
      <p className="auth-switch">New to Ledgerline? <Link to="/register">Create an account</Link></p>
    </AuthFrame>
  )
}

export default LoginPage
