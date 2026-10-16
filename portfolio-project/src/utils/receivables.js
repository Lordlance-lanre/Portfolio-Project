export const STARTING_CUSTOMERS = [
  { id: 1, customer: 'Brothers Wireless', initials: 'BW', color: 'mint', terms: 'Net 30', buckets: [123.45, 0, 0, 0], orders: 1, lastPaid: 12, risk: 'Moderate', comment: '' },
  { id: 2, customer: 'Quick Cell', initials: 'QC', color: 'peach', terms: 'Net 60', buckets: [234.56, 0, 0, 0], orders: 12, lastPaid: 3, risk: 'Moderate', comment: '' },
  { id: 3, customer: 'Shorty Wireless', initials: 'SW', color: 'blue', terms: 'Net 30', buckets: [345.67, 230.75, 0, 0], orders: 12, lastPaid: 53, risk: 'High', comment: 'Customer will pay next week' },
  { id: 4, customer: 'Bob Smart phones', initials: 'BS', color: 'yellow', terms: 'Net 60', buckets: [456.78, 260.5, 0, 0], orders: 3, lastPaid: 13, risk: 'Moderate', comment: '' },
  { id: 5, customer: 'Jose Nieves', initials: 'JN', color: 'lavender', terms: 'Net 30', buckets: [67.89, 220, 0, 250], orders: 1, lastPaid: 7, risk: 'Moderate', comment: 'Customer will pay next week' },
  { id: 6, customer: 'Juan Carlos', initials: 'JC', color: 'pink', terms: 'Net 15', buckets: [78.9, 190.99, 0, 250.75], orders: 1, lastPaid: 7, risk: 'Moderate', comment: '' },
  { id: 7, customer: 'New York Tech', initials: 'NY', color: 'blue', terms: 'Net 60', buckets: [98.01, 280.25, 200.75, 250.25], orders: 12, lastPaid: 17, risk: 'Moderate', comment: 'Customer will pay next week' },
  { id: 8, customer: 'Luigi Wireless', initials: 'LW', color: 'mint', terms: 'Net 60', buckets: [109.12, 240.99, 180.5, 220.75], orders: 12, lastPaid: 99, risk: 'Overdue', comment: '' },
  { id: 9, customer: 'Hoho Wireless', initials: 'HW', color: 'peach', terms: 'Net 60', buckets: [210.13, 270.25, 290.25, 0], orders: 12, lastPaid: 17, risk: 'Moderate', comment: '' },
  { id: 10, customer: 'Luigi Wireless', initials: 'LW', color: 'mint', terms: 'Net 60', buckets: [109.12, 240.99, 180.5, 220.75], orders: 12, lastPaid: 101, risk: 'Overdue', comment: '' },
]

export const AGING_BUCKETS = [
  { label: '1-30 days', key: 'current', trend: '+7.1%' },
  { label: '31-60 days', key: 'aging-30', trend: '+7.1%' },
  { label: '61-90 days', key: 'aging-60', trend: '-3.2%' },
  { label: '91+ days', key: 'aging-90', trend: '-3.2%' },
]

export const AGING_TABS = ['All', ...AGING_BUCKETS.map((bucket) => bucket.label)]
export const RISK_LEVELS = ['All risk levels', 'Moderate', 'High', 'Overdue']
export const PAYMENT_TERMS = ['Net 15', 'Net 30', 'Net 60', 'Net 90']
export const CURRENCY = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export const NAV_ITEMS = [
  { label: 'Overview', path: '/overview', icon: 'grid' },
  { label: 'Customers', path: '/customers', icon: 'users' },
  { label: 'Reports', path: '/reports', icon: 'chart' },
  { label: 'Settings', path: '/settings', icon: 'settings' },
]

export const RECENT_ACTIVITY = [
  { title: 'Payment received', detail: 'Quick Cell · $1,240.00', time: '24 minutes ago', tone: 'mint' },
  { title: 'Reminder sent', detail: 'Shorty Wireless · Invoice #1048', time: '2 hours ago', tone: 'coral' },
  { title: 'Terms updated', detail: 'Bob Smart phones · Net 60', time: 'Yesterday', tone: 'blue' },
]

export function getCustomerTotal(customer) {
  return customer.buckets.reduce((sum, amount) => sum + amount, 0)
}

export function getReceivablesSummary(customers) {
  return {
    total: customers.reduce((sum, customer) => sum + getCustomerTotal(customer), 0),
    orders: customers.reduce((sum, customer) => sum + customer.orders, 0),
    buckets: AGING_BUCKETS.map((_, index) => customers.reduce((sum, customer) => sum + customer.buckets[index], 0)),
    accountsPerBucket: AGING_BUCKETS.map((_, index) => customers.filter((customer) => customer.buckets[index] > 0).length),
  }
}

export function sortCustomers(customers, sort) {
  return [...customers].sort((first, second) => {
    const bucketIndex = sort.key.startsWith('bucket-') ? Number(sort.key.slice(7)) : -1
    const firstValue = bucketIndex >= 0 ? first.buckets[bucketIndex] : sort.key === 'total' ? getCustomerTotal(first) : first[sort.key]
    const secondValue = bucketIndex >= 0 ? second.buckets[bucketIndex] : sort.key === 'total' ? getCustomerTotal(second) : second[sort.key]
    const comparison = typeof firstValue === 'string' ? firstValue.localeCompare(secondValue) : firstValue - secondValue
    return sort.direction === 'asc' ? comparison : -comparison
  })
}