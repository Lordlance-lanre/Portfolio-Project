import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthFrame from '../components/AuthFrame.jsx'
import { registerAccount } from '../utils/auth.js'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/overview'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Your passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      await registerAccount({ name, email, password })
      navigate(destination, { replace: true })
    } catch (registerError) {
      setError(registerError.message || 'Unable to create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthFrame mode="register">
      <div className="auth-heading"><span className="auth-eyebrow">GET YOUR WORKSPACE</span><h2>Create your account</h2><p>Start bringing your receivables into focus.</p></div>
      <form className="auth-form register-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error" role="alert">{error}</div>}
        <label className="auth-field"><span>Your name</span><input type="text" autoComplete="name" placeholder="Alex Morgan" value={name} onChange={(event) => setName(event.target.value)} required minLength={2} /></label>
        <label className="auth-field"><span>Work email</span><input type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="auth-field"><span>Password</span><input type="password" autoComplete="new-password" placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} /></label>
        <label className="auth-field"><span>Confirm password</span><input type="password" autoComplete="new-password" placeholder="Enter your password again" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} /></label>
        <button className="auth-submit" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}<span aria-hidden="true">→</span></button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthFrame>
  )
}

export default RegisterPage
