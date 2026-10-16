import { Link } from 'react-router-dom'
import { AGING_BUCKETS, CURRENCY, STARTING_CUSTOMERS, getCustomerTotal, getReceivablesSummary } from '../utils/receivables.js'
import Icon from '../components/Icon.jsx'
import '../utils/Reports.css'

const RISK_COLORS = { Moderate: '#77ad86', High: '#e0ae59', Overdue: '#d87560' }

function makePieSlice(startAngle, endAngle) {
  const center = 100
  const radius = 82
  const toPoint = (angle) => {
    const radians = (angle - 90) * Math.PI / 180
    return [center + radius * Math.cos(radians), center + radius * Math.sin(radians)]
  }
  const [startX, startY] = toPoint(startAngle)
  const [endX, endY] = toPoint(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`
}

function ReportsPage() {
  const summary = getReceivablesSummary(STARTING_CUSTOMERS)
  const riskBreakdown = ['Moderate', 'High', 'Overdue'].map((risk) => {
    const accounts = STARTING_CUSTOMERS.filter((customer) => customer.risk === risk)
    return { risk, count: accounts.length, amount: accounts.reduce((total, customer) => total + getCustomerTotal(customer), 0) }
  })
  const riskTotal = riskBreakdown.reduce((total, item) => total + item.amount, 0)
  const chartMax = Math.ceil(Math.max(...summary.buckets) / 500) * 500
  const chartPoints = summary.buckets.map((amount, index) => ({
    x: 58 + index * 105,
    y: 174 - amount / chartMax * 138,
    amount,
  }))
  const linePath = chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const pieSlices = riskBreakdown.reduce((slices, item) => {
    const previousEnd = slices.length ? slices[slices.length - 1].endAngle : 0
    const endAngle = previousEnd + item.amount / riskTotal * 360
    slices.push({ ...item, startAngle: previousEnd, endAngle })
    return slices
  }, [])

  return (
    <div className="page-content route-page">
      <div className="page-heading"><div><div className="eyebrow"><span /> PORTFOLIO INSIGHTS</div><h1>Reports</h1><p className="page-description">Understand aging patterns and collection exposure.</p></div><Link className="button button-secondary" to="/customers"><Icon name="download" size={15} />Export account data</Link></div>
      <section className="report-metrics"><article className="route-panel report-total"><span className="panel-kicker">OUTSTANDING BALANCE</span><strong>{CURRENCY.format(summary.total)}</strong><span>Across {summary.orders} open orders</span></article><article className="route-panel report-total"><span className="panel-kicker">ACCOUNTS AT RISK</span><strong>{riskBreakdown[1].count + riskBreakdown[2].count}</strong><span>High risk or overdue</span></article><article className="route-panel report-total"><span className="panel-kicker">OVER 90 DAYS</span><strong>{CURRENCY.format(summary.buckets[3])}</strong><span>{summary.accountsPerBucket[3]} accounts</span></article></section>
      <div className="overview-grid report-grid">
        <section className="route-panel report-chart">
          <div className="route-panel-heading"><div><span className="panel-kicker">AGING DISTRIBUTION</span><h2>Outstanding by age</h2></div><span className="report-period">Current portfolio</span></div>
          <div className="line-chart-wrap">
            <svg className="aging-line-chart" viewBox="0 0 420 220" role="img" aria-label="Outstanding balance by aging bucket">
              <defs><linearGradient id="agingAreaGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#77ad86" stopOpacity=".24" /><stop offset="100%" stopColor="#77ad86" stopOpacity="0" /></linearGradient></defs>
              {[0, 1, 2, 3].map((tick) => {
                const y = 36 + tick * 46
                const value = chartMax * (3 - tick) / 3
                return <g key={tick}><line x1="48" x2="394" y1={y} y2={y} className="chart-grid-line" /><text x="40" y={y + 3} textAnchor="end" className="chart-axis-label">{value === 0 ? '$0' : `$${(value / 1000).toFixed(value >= 1000 ? 1 : 0)}k`}</text></g>
              })}
              <path d={`${linePath} L ${chartPoints[chartPoints.length - 1].x} 174 L ${chartPoints[0].x} 174 Z`} fill="url(#agingAreaGradient)" />
              <path d={linePath} className="aging-line" />
              {chartPoints.map((point, index) => <g key={AGING_BUCKETS[index].key}><circle cx={point.x} cy={point.y} r="5" className="aging-line-point"><title>{`${AGING_BUCKETS[index].label}: ${CURRENCY.format(point.amount)}`}</title></circle><text x={point.x} y="204" textAnchor="middle" className="chart-axis-label">{AGING_BUCKETS[index].label}</text></g>)}
            </svg>
          </div>
        </section>
        <section className="route-panel risk-report">
          <div className="route-panel-heading"><div><span className="panel-kicker">ACCOUNT HEALTH</span><h2>Balance by risk</h2></div><span className="report-period">{CURRENCY.format(riskTotal)}</span></div>
          <div className="risk-pie-layout">
            <div className="risk-pie-wrap">
              <svg className="risk-pie-chart" viewBox="0 0 200 200" role="img" aria-label="Share of outstanding receivables by risk level">
                {pieSlices.map((slice) => <path key={slice.risk} d={makePieSlice(slice.startAngle, slice.endAngle)} fill={RISK_COLORS[slice.risk]} className="risk-pie-slice"><title>{`${slice.risk}: ${CURRENCY.format(slice.amount)}`}</title></path>)}
              </svg>
            </div>
            <div className="risk-pie-legend">{riskBreakdown.map((item) => <div className="risk-legend-item" key={item.risk}><span className="risk-legend-dot" style={{ backgroundColor: RISK_COLORS[item.risk] }} /><div><strong>{item.risk}</strong><small>{item.count} {item.count === 1 ? 'account' : 'accounts'}</small></div><b>{CURRENCY.format(item.amount)}</b></div>)}</div>
          </div>
          <Link className="focus-link" to="/customers">Review customer accounts <Icon name="arrow" size={14} /></Link>
        </section>
      </div>
    </div>
  )
}

export default ReportsPage