import { Link } from 'react-router-dom'
import { AGING_BUCKETS, CURRENCY, STARTING_CUSTOMERS, getReceivablesSummary } from '../utils/receivables.js'
import Icon from '../components/Icon.jsx'

function OverviewPage() {
  const summary = getReceivablesSummary(STARTING_CUSTOMERS)
  const overdue = STARTING_CUSTOMERS.filter((customer) => customer.risk === 'Overdue')
  const highRisk = STARTING_CUSTOMERS.filter((customer) => customer.risk === 'High')

  return (
    <div className="page-content route-page">
      <div className="page-heading"><div><div className="eyebrow"><span /> FINANCE AT A GLANCE</div><h1>Good morning, Alex</h1><p className="page-description">Here’s the latest on your collection health.</p></div><Link className="button button-primary" to="/customers">Open customer ledger<Icon name="arrow" size={15} /></Link></div>
      <section className="summary-grid" aria-label="Receivables overview">
        <article className="summary-card total-card"><div className="summary-top"><span>Total receivables</span><span className="summary-glyph">↗</span></div><strong className="summary-value">{CURRENCY.format(summary.total)}</strong><div className="summary-foot"><span>{summary.orders} open orders</span><span className="trend positive">↑ 8.4%</span></div><div className="mini-chart total-chart">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div></article>
        {AGING_BUCKETS.map((bucket, index) => <article className="summary-card" key={bucket.key}><div className="summary-top"><span>{bucket.label}</span><span className={`bucket-dot dot-${index}`} /></div><strong className="summary-value">{CURRENCY.format(summary.buckets[index])}</strong><div className="summary-foot"><span>{summary.accountsPerBucket[index]} accounts</span><span className={`trend ${index > 1 ? 'negative' : 'positive'}`}>{index > 1 ? '↓' : '↑'} {bucket.trend.replace(/[+−]/, '')}</span></div><div className={`mini-chart bucket-chart chart-${index}`}>{Array.from({ length: 12 }, (_, item) => <i key={item} />)}</div></article>)}
      </section>
      <div className="overview-grid">
        <section className="route-panel aging-panel"><div className="route-panel-heading"><div><span className="panel-kicker">AGING SNAPSHOT</span><h2>Where balances stand</h2></div><Link to="/customers">View ledger <Icon name="arrow" size={14} /></Link></div><div className="aging-list">{AGING_BUCKETS.map((bucket, index) => <div className="aging-row" key={bucket.key}><span className={`aging-indicator dot-${index}`} /><span className="aging-label">{bucket.label}</span><strong>{CURRENCY.format(summary.buckets[index])}</strong><div className="aging-track"><i style={{ width: `${Math.max(6, summary.total ? summary.buckets[index] / summary.total * 100 : 0)}%` }} /></div><span className="aging-count">{summary.accountsPerBucket[index]} accounts</span></div>)}</div><div className="aging-total"><span>Portfolio total</span><strong>{CURRENCY.format(summary.total)}</strong></div></section>
        <section className="route-panel focus-panel"><div className="route-panel-heading"><div><span className="panel-kicker">NEEDS ATTENTION</span><h2>Collection focus</h2></div><span className="focus-count">{overdue.length + highRisk.length} accounts</span></div><div className="focus-stat"><span className="focus-icon overdue-focus"><Icon name="clock" size={17} /></span><div><strong>{overdue.length} overdue accounts</strong><p>Last payment was more than 90 days ago</p></div><b>{CURRENCY.format(overdue.reduce((sum, entry) => sum + entry.buckets.reduce((a, b) => a + b, 0), 0))}</b></div><div className="focus-stat"><span className="focus-icon high-focus">!</span><div><strong>{highRisk.length} high-risk account</strong><p>Follow up on an aging balance</p></div><b>{CURRENCY.format(highRisk.reduce((sum, entry) => sum + entry.buckets.reduce((a, b) => a + b, 0), 0))}</b></div><Link className="focus-link" to="/customers">Review accounts <Icon name="arrow" size={14} /></Link></section>
      </div>
    </div>
  )
}

export default OverviewPage