const ACCOUNTS_KEY = 'ledgerline-accounts'
const SESSION_KEY = 'ledgerline-session'
const PASSWORD_ITERATIONS = 120000

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
  } catch {
    return []
  }
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer), (value) => value.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits'])
  const derivedBits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: encoder.encode(salt), iterations: PASSWORD_ITERATIONS }, keyMaterial, 256)
  return toHex(derivedBits)
}

export function getSessionUser() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
    return session?.email ? session : null
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return Boolean(getSessionUser())
}

export function signOut() {
  sessionStorage.removeItem(SESSION_KEY)
}

export async function registerAccount({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const accounts = readAccounts()
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.')
  }

  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)))
  const account = { name: name.trim(), email: normalizedEmail, salt, passwordHash: await hashPassword(password, salt) }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
  const session = { name: account.name, email: account.email }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export async function loginAccount({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const account = readAccounts().find((entry) => entry.email === normalizedEmail)
  if (!account || await hashPassword(password, account.salt) !== account.passwordHash) {
    throw new Error('Email or password is incorrect.')
  }

  const session = { name: account.name, email: account.email }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}
