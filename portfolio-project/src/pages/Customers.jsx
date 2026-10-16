import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AGING_BUCKETS, AGING_TABS, CURRENCY, PAYMENT_TERMS, RISK_LEVELS, STARTING_CUSTOMERS, getCustomerTotal, getReceivablesSummary, sortCustomers } from '../utils/receivables.js'
import { useDashboard } from '../components/useDashboard.js'
import Icon from '../components/Icon.jsx'

function CustomersPage() {
  const [customers, setCustomers] = useState(STARTING_CUSTOMERS)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [tagFilter, setTagFilter] = useState(RISK_LEVELS[0])
  const [selected, setSelected] = useState([])
  const [sort, setSort] = useState({ key: 'customer', direction: 'asc' })
  const [commentingId, setCommentingId] = useState(null)
  const [commentDraft, setCommentDraft] = useState('')
  const { announce } = useDashboard()
  const summary = getReceivablesSummary(customers)

  const visibleCustomers = useMemo(() => {
    const filtered = customers
      .filter((entry) => entry.customer.toLowerCase().includes(query.toLowerCase()))
      .filter((entry) => tagFilter === RISK_LEVELS[0] || entry.risk === tagFilter)
      .filter((entry) => activeTab === 'All' || entry.buckets[AGING_TABS.indexOf(activeTab) - 1] > 0)
    return sortCustomers(filtered, sort)
  }, [customers, query, tagFilter, activeTab, sort])

  function changeSort(key) {
    setSort((current) => ({ key, direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc' }))
  }

  function toggleAll() {
    const allSelected = visibleCustomers.length > 0 && visibleCustomers.every((entry) => selected.includes(entry.id))
    setSelected(allSelected ? [] : visibleCustomers.map((entry) => entry.id))
  }

  function exportCsv() {
    const rows = selected.length ? customers.filter((entry) => selected.includes(entry.id)) : visibleCustomers
    const heading = ['Customer', 'Terms', ...AGING_BUCKETS.map((bucket) => bucket.label), 'Total', 'Orders', 'Last paid (days)', 'Risk', 'Comments']
    const lines = [heading, ...rows.map((entry) => [entry.customer, entry.terms, ...entry.buckets, getCustomerTotal(entry), entry.orders, entry.lastPaid, entry.risk, entry.comment])]
    const csv = lines.map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    link.download = 'receivables.csv'
    link.click()
    URL.revokeObjectURL(link.href)
    announce(`Exported ${rows.length} ${rows.length === 1 ? 'account' : 'accounts'} to CSV`)
  }

  function saveComment(id) {
    if (!commentDraft.trim()) return
    setCustomers((current) => current.map((entry) => entry.id === id ? { ...entry, comment: commentDraft.trim() } : entry))
    setCommentingId(null)
    setCommentDraft('')
    announce('Comment added to account')
  }

  return (
    <div className="page-content" id="receivables">
      <div className="page-heading"><div><div className="eyebrow"><span /> COLLECTIONS OVERVIEW</div><h1>Customers</h1><p className="page-description">A clear view of what’s owed, and what to do next.</p></div><div className="heading-actions">{selected.length > 0 && <Link className="button button-primary view-details-action" to={`/customers/${selected[0]}?selected=${selected.join(',')}`}><Icon name="users" size={16} />View details <span className="button-count">{selected.length}</span><Icon name="arrow" size={14} /></Link>}<button className="button button-secondary" type="button" onClick={() => window.print()}><Icon name="print" size={16} />Print statement</button><button className="button button-primary" type="button" disabled={!selected.length} onClick={() => announce(`Added ${selected.length} ${selected.length === 1 ? 'account' : 'accounts'} to CRM`)}><Icon name="plus" size={16} />Add to CRM{selected.length > 0 && <span className="button-count">{selected.length}</span>}</button></div></div>
      <section className="summary-grid" aria-label="Receivables summary">
        <article className="summary-card total-card"><div className="summary-top"><span>Total receivables</span><span className="summary-glyph">↗</span></div><strong className="summary-value">{CURRENCY.format(summary.total)}</strong><div className="summary-foot"><span>{summary.orders} open orders</span><span className="trend positive">↑ 8.4%</span></div><div className="mini-chart total-chart">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div></article>
        {AGING_BUCKETS.map((bucket, index) => <article className="summary-card" key={bucket.key}><div className="summary-top"><span>{bucket.label}</span><span className={`bucket-dot dot-${index}`} /></div><strong className="summary-value">{CURRENCY.format(summary.buckets[index])}</strong><div className="summary-foot"><span>{summary.accountsPerBucket[index]} accounts</span><span className={`trend ${index > 1 ? 'negative' : 'positive'}`}>{index > 1 ? '↓' : '↑'} {bucket.trend.replace(/[+−]/, '')}</span></div><div className={`mini-chart bucket-chart chart-${index}`}>{Array.from({ length: 12 }, (_, item) => <i key={item} />)}</div></article>)}
      </section>
      <section className="table-section" aria-label="Customer receivables">
        <div className="table-toolbar"><label className="search-field"><Icon name="search" size={17} /><input type="search" placeholder="Search customers..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search customers" /></label><div className="toolbar-actions"><label className="filter-select"><span className="filter-label">Risk</span><select value={tagFilter} onChange={(event) => setTagFilter(event.target.value)} aria-label="Filter by risk">{RISK_LEVELS.map((risk) => <option key={risk}>{risk}</option>)}</select><Icon name="down" size={15} /></label><button className="button export-button" type="button" onClick={exportCsv}><Icon name="download" size={16} /><span>Export</span></button></div></div>
        <div className="table-tabs" role="tablist" aria-label="Filter by aging bucket">{AGING_TABS.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'tab active-tab' : 'tab'} onClick={() => setActiveTab(tab)}>{tab}<span className="tab-count">{tab === 'All' ? customers.length : customers.filter((entry) => entry.buckets[AGING_TABS.indexOf(tab) - 1] > 0).length}</span></button>)}</div>
        <div className="table-scroll"><table><thead><tr><th className="check-column"><input type="checkbox" aria-label="Select all visible customers" checked={visibleCustomers.length > 0 && visibleCustomers.every((entry) => selected.includes(entry.id))} onChange={toggleAll} /></th><th><button className="sort-button" onClick={() => changeSort('customer')}>Customer <span className="sort-glyph">↕</span></button></th><th>Terms</th>{AGING_BUCKETS.map((bucket, index) => <th className="numeric-column" key={bucket.key}><button className="sort-button" onClick={() => changeSort(`bucket-${index}`)}>{bucket.label}<span className="sort-glyph">↕</span></button></th>)}<th className="numeric-column"><button className="sort-button" onClick={() => changeSort('total')}>Total<span className="sort-glyph">↕</span></button></th><th className="numeric-column"><button className="sort-button" onClick={() => changeSort('orders')}>Orders<span className="sort-glyph">↕</span></button></th><th><button className="sort-button" onClick={() => changeSort('lastPaid')}>Last paid<span className="sort-glyph">↕</span></button></th><th>Risk</th><th>Latest note</th></tr></thead><tbody>{visibleCustomers.map((entry) => <tr key={entry.id} className={selected.includes(entry.id) ? 'selected-row' : ''}>
          <td className="check-column"><input type="checkbox" aria-label={`Select ${entry.customer}`} checked={selected.includes(entry.id)} onChange={() => setSelected((current) => current.includes(entry.id) ? current.filter((id) => id !== entry.id) : [...current, entry.id])} /></td>
          <td><button className="customer-link" onClick={() => announce(`${entry.customer} account details`)}><span className={`customer-avatar avatar-${entry.color}`}>{entry.initials}</span><span>{entry.customer}</span><Icon name="chevron" size={13} /></button></td>
          <td><select className="terms-select" aria-label={`${entry.customer} payment terms`} value={entry.terms} onChange={(event) => setCustomers((current) => current.map((item) => item.id === entry.id ? { ...item, terms: event.target.value } : item))}>{PAYMENT_TERMS.map((term) => <option key={term}>{term}</option>)}</select></td>
          {entry.buckets.map((amount, index) => <td className="numeric-cell" key={index}>{amount ? CURRENCY.format(amount) : <span className="empty-value">—</span>}</td>)}
          <td className="numeric-cell total-cell">{CURRENCY.format(getCustomerTotal(entry))}</td><td className="numeric-cell orders-cell"><button className="orders-link" onClick={() => announce(`${entry.orders} open orders for ${entry.customer}`)}>{entry.orders} <span>{entry.orders === 1 ? 'order' : 'orders'}</span></button></td><td><span className={entry.lastPaid > 90 ? 'last-paid overdue-text' : entry.lastPaid > 45 ? 'last-paid late-text' : 'last-paid'}>{entry.lastPaid} days ago</span></td><td><span className={`risk-badge risk-${entry.risk.toLowerCase()}`}>{entry.risk}</span></td>
          <td className="comment-cell">{commentingId === entry.id ? <form className="comment-form" onSubmit={(event) => { event.preventDefault(); saveComment(entry.id) }}><input autoFocus value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} placeholder="Add a note..." aria-label="New account note" /><button type="submit">Save</button></form> : entry.comment ? <button className="comment-note" title={entry.comment} onClick={() => announce(`Latest note: ${entry.comment}`)}>{entry.comment}</button> : <button className="add-comment" onClick={() => { setCommentingId(entry.id); setCommentDraft('') }}><Icon name="plus" size={13} /> Add note</button>}</td>
        </tr>)}{visibleCustomers.length === 0 && <tr><td colSpan="12" className="empty-state"><span className="empty-icon"><Icon name="search" size={20} /></span><strong>No accounts found</strong><span>Try adjusting your search or filters.</span><button onClick={() => { setQuery(''); setTagFilter(RISK_LEVELS[0]); setActiveTab('All') }}>Clear filters</button></td></tr>}</tbody></table></div>
        <footer className="table-footer"><span>Showing <strong>{visibleCustomers.length ? 1 : 0}–{visibleCustomers.length}</strong> of <strong>{visibleCustomers.length}</strong> accounts</span><div className="footer-selection">{selected.length > 0 && <><span>{selected.length} selected</span><button onClick={() => announce(`Payment reminder queued for ${selected.length} accounts`)}><Icon name="mail" size={14} />Send reminder</button><button onClick={exportCsv}><Icon name="download" size={14} />Export selected</button></>}</div><span className="updated-label"><span />Updated just now</span></footer>
      </section>
      <div className="page-footnote"><span>Receivables data as of Oct 13, 2026</span><span>USD · All amounts shown in US dollars</span><Link to="/reports">View collection reports <Icon name="arrow" size={13} /></Link></div>
    </div>
  )
}

export default CustomersPage