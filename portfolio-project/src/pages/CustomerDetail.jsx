import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AGING_BUCKETS, CURRENCY, STARTING_CUSTOMERS, getCustomerTotal } from '../utils/receivables.js'
import '../utils/CustomerDetail.css'

function CustomerDetailPage() {
  const { customerId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const customer = STARTING_CUSTOMERS.find((entry) => entry.id === Number(customerId))
  const selectedIds = (searchParams.get('selected') || customerId).split(',').map(Number).filter((id) => STARTING_CUSTOMERS.some((entry) => entry.id === id))
  const currentPosition = selectedIds.indexOf(Number(customerId))
  const previousId = currentPosition > 0 ? selectedIds[currentPosition - 1] : null
  const nextId = currentPosition >= 0 && currentPosition < selectedIds.length - 1 ? selectedIds[currentPosition + 1] : null

  if (!customer) return <Navigate to="/customers" replace />

  const total = getCustomerTotal(customer)
  const detailTarget = (id) => `/customers/${id}?selected=${selectedIds.join(',')}`

  return (
    <div className="page-content route-page customer-detail-page">
      <div className="detail-breadcrumb"><Link to="/customers">Customers</Link><span>/</span><strong>{customer.customer}</strong></div>
      <div className="page-heading detail-heading"><div><div className="eyebrow"><span /> CUSTOMER ACCOUNT</div><div className="detail-title"><span className={`customer-avatar avatar-${customer.color}`}>{customer.initials}</span><h1>{customer.customer}</h1><span className={`risk-badge risk-${customer.risk.toLowerCase()}`}>{customer.risk}</span></div><p className="page-description">Account overview and outstanding receivables.</p></div><div className="detail-actions"><Link className="button button-secondary" to="/customers">Back to customers</Link>{selectedIds.length > 1 && <span className="selection-position">{currentPosition + 1} of {selectedIds.length} selected</span>}</div></div>

      <section className="detail-metrics" aria-label="Customer account summary">
        <article className="detail-metric balance-metric"><span>Total outstanding</span><strong>{CURRENCY.format(total)}</strong><small>{customer.orders} open {customer.orders === 1 ? 'order' : 'orders'}</small></article>
        <article className="detail-metric"><span>Payment terms</span><strong>{customer.terms}</strong><small>Current account terms</small></article>
        <article className="detail-metric"><span>Last payment</span><strong className={customer.lastPaid > 90 ? 'overdue-text' : customer.lastPaid > 45 ? 'late-text' : ''}>{customer.lastPaid} days ago</strong><small>Days since payment received</small></article>
        <article className="detail-metric"><span>Collection status</span><strong><span className={`risk-badge risk-${customer.risk.toLowerCase()}`}>{customer.risk}</span></strong><small>Based on account aging</small></article>
      </section>

      <div className="detail-content-grid">
        <section className="route-panel detail-aging-panel"><div className="route-panel-heading"><div><span className="panel-kicker">BALANCE BREAKDOWN</span><h2>Receivables by aging</h2></div><span className="detail-currency">USD</span></div><div className="detail-aging-list">{AGING_BUCKETS.map((bucket, index) => <div className="detail-aging-row" key={bucket.key}><span className={`bucket-dot dot-${index}`} /><span>{bucket.label}</span><strong>{customer.buckets[index] ? CURRENCY.format(customer.buckets[index]) : '—'}</strong></div>)}</div><div className="detail-aging-total"><span>Total outstanding</span><strong>{CURRENCY.format(total)}</strong></div></section>
        <section className="route-panel detail-notes-panel"><div className="route-panel-heading"><div><span className="panel-kicker">COLLECTION NOTES</span><h2>Latest account update</h2></div><span className="risk-badge risk-moderate">Account #{customer.id}</span></div>{customer.comment ? <blockquote>“{customer.comment}”</blockquote> : <p className="no-account-note">No collection note has been added for this customer yet.</p>}<div className="account-contact-row"><span className="account-contact-avatar">{customer.initials}</span><span><strong>Finance team</strong><small>Account owner</small></span></div></section>
      </div>

      <footer className="detail-pagination"><Link className={previousId ? 'detail-page-button' : 'detail-page-button disabled-page-button'} to={previousId ? detailTarget(previousId) : '#'} onClick={(event) => { if (!previousId) event.preventDefault() }}><span>←</span> Previous account</Link><Link className={nextId ? 'detail-page-button next-page-button' : 'detail-page-button next-page-button disabled-page-button'} to={nextId ? detailTarget(nextId) : '#'} onClick={(event) => { if (!nextId) event.preventDefault() }}>Next account <span>→</span></Link><button className="detail-close-button" onClick={() => navigate('/customers')}>Close details</button></footer>
    </div>
  )
}

export default CustomerDetailPage