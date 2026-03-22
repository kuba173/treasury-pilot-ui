import { useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { StatusBadge } from '@/components/StatusBadge';
import { invoices, alerts, statusDistribution, walletBalances, auditEvents, policyConfig, Invoice, Period, periodChartData, periodStats } from '@/lib/mock-data';
import {
  Inbox, CheckCircle, Clock, AlertTriangle, DollarSign, BrainCircuit, Shield, Wallet,
  Zap, X, FileText, ChevronRight, Send, CheckCircle2, Ban
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { cn } from '@/lib/utils';

const recentActivity = auditEvents.slice(0, 8);

type ActiveCard = 'received' | 'approved' | 'pending' | 'fraud' | null;

function getFilteredInvoices(card: ActiveCard): Invoice[] {
  switch (card) {
    case 'received': return invoices;
    case 'approved': return invoices.filter(i => i.status === 'auto-approved');
    case 'pending':  return invoices.filter(i => i.status === 'needs-approval');
    case 'fraud':    return invoices.filter(i => i.status === 'blocked');
    default: return [];
  }
}

function getBlockReason(invoice: Invoice): string | null {
  if (invoice.status !== 'blocked') return null;
  const vendorAlert = alerts.find(a => a.vendor === invoice.vendor);
  if (vendorAlert) return vendorAlert.description;
  return `Invoice blocked by Policy Engine. Risk score: ${invoice.riskScore}/100. Vendor trust score below required threshold.`;
}

function getPaymentStatusLabel(status: Invoice['status']): { label: string; color: string } {
  switch (status) {
    case 'auto-approved':  return { label: 'Auto-Approved', color: 'text-success' };
    case 'needs-approval': return { label: 'Needs Approval', color: 'text-warning' };
    case 'blocked':        return { label: 'Blocked', color: 'text-destructive' };
    default:               return { label: status, color: 'text-muted-foreground' };
  }
}

/* ── Invoice PDF Modal ── */
function InvoicePdfModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const [paid, setPaid] = useState(false);

  const blockReason = getBlockReason(invoice);
  const paymentStatus = getPaymentStatusLabel(invoice.status);
  const fraudAlerts = alerts.filter(a => a.vendor === invoice.vendor);
  const isBlocked = invoice.status === 'blocked';
  const isPending = invoice.status === 'needs-approval';
  const isOk = invoice.status === 'auto-approved';

  const borderColor = isOk ? 'border-success/50' : isPending ? 'border-warning/50' : 'border-destructive/50';
  const statusDot = isOk ? 'bg-success' : isPending ? 'bg-warning' : 'bg-destructive';

  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const receivedDate = new Date(invoice.receivedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className={cn('relative w-full max-w-4xl max-h-[93vh] flex flex-col rounded-xl border shadow-2xl bg-card', borderColor)}>

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{invoice.vendor}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-xs font-mono text-muted-foreground">{invoice.invoiceNumber}</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Info panel */}
        <div className="shrink-0 border-b px-5 py-4 space-y-3">

          {/* Row 1: key facts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Amount</p>
              <p className="text-xl font-semibold font-mono">{invoice.settlementCoin === 'EURC' ? '€' : '$'}{invoice.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">{invoice.settlementCoin}</span></p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{invoice.currency} {invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Payment status</p>
              <div className="mt-1">
                <StatusBadge status={invoice.status} />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Due date</p>
              <p className="text-sm font-medium">{dueDate}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Received</p>
              <p className="text-sm font-medium">{receivedDate}</p>
            </div>
          </div>

          {/* Row 2: meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Risk score: <span className="font-semibold text-foreground">{invoice.riskScore}/100</span></span>
            <span>·</span>
            <span>Route: <span className="font-medium text-foreground">{invoice.paymentRoute}</span></span>
            <span>·</span>
            <span>Source: <span className="font-medium text-foreground capitalize">{invoice.source}</span></span>
            <span>·</span>
            <span>Country: <span className="font-medium text-foreground">{invoice.vendorCountry}</span></span>
          </div>

          {/* Fraud / block reasons */}
          {(isBlocked || isPending) && (blockReason || fraudAlerts.length > 0) && (
            <div className={cn('rounded-lg border p-3 space-y-2', isBlocked ? 'border-destructive/30 bg-destructive/5' : 'border-warning/30 bg-warning/5')}>
              <p className={cn('text-[10px] uppercase tracking-wider font-semibold', isBlocked ? 'text-destructive' : 'text-warning')}>
                {isBlocked ? 'Powód odrzucenia' : 'Powód wstrzymania'}
              </p>
              {blockReason && (
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className={cn('mt-0.5 shrink-0', isBlocked ? 'text-destructive' : 'text-warning')}>▸</span>
                  <span>{blockReason}</span>
                </div>
              )}
              {fraudAlerts.map(a => (
                <div key={a.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className={cn('mt-0.5 shrink-0', isBlocked ? 'text-destructive' : 'text-warning')}>▸</span>
                  <span><span className="font-medium text-foreground">{a.type}:</span> {a.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action bar */}
        {isPending && (
          <div className="shrink-0 border-b px-5 py-3 flex items-center gap-3">
            {paid ? (
              <div className="flex items-center gap-2 text-success text-sm font-medium">
                <CheckCircle2 className="h-4 w-4" />
                Płatność zatwierdzona — wysłano {invoice.currency} {invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} via {invoice.paymentRoute}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setPaid(true)}
                  className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  Zapłać {invoice.currency} {invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </button>
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Ban className="h-3.5 w-3.5" />
                  Odrzuć
                </button>
                <span className="text-xs text-muted-foreground ml-1">Faktura bezpieczna — wymaga ręcznego zatwierdzenia ze względu na kwotę</span>
              </>
            )}
          </div>
        )}


        {/* PDF embed */}
        <div className="flex-1 overflow-hidden rounded-b-xl" style={{ minHeight: '300px' }}>
          <embed
            src="/invoice-template.pdf"
            type="application/pdf"
            className="w-full h-full"
            style={{ minHeight: '300px' }}
          />
        </div>

      </div>
    </div>
  );
}

/* ── Invoice List Drawer ── */
function InvoiceListDrawer({
  card,
  onClose,
  onSelectInvoice,
}: {
  card: ActiveCard;
  onClose: () => void;
  onSelectInvoice: (inv: Invoice) => void;
}) {
  if (!card) return null;
  const items = getFilteredInvoices(card);

  const titles: Record<NonNullable<ActiveCard>, string> = {
    received: 'Received Today',
    approved: 'Auto-Approved',
    pending: 'Pending Review',
    fraud: 'Fraud Alerts',
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-card border-l h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
          <div>
            <p className="text-sm font-semibold">{titles[card as keyof typeof titles]}</p>
            <p className="text-xs text-muted-foreground">{items.length} invoice{items.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {items.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground">No invoices found</div>
          )}
          {items.map(inv => (
            <button
              key={inv.id}
              onClick={() => onSelectInvoice(inv)}
              className="w-full text-left px-5 py-4 hover:bg-muted/40 transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">{inv.vendor}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{inv.invoiceNumber}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{inv.serviceDescription}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold font-mono">{inv.settlementCoin === 'EURC' ? '€' : '$'}{inv.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px] font-normal opacity-70">{inv.settlementCoin}</span></p>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mt-1 ml-auto group-hover:text-primary transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Fraud Alerts Drawer ── */
function FraudAlertsDrawer({ onClose, onSelectInvoice }: { onClose: () => void; onSelectInvoice: (inv: Invoice) => void }) {
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-card border-l h-full flex flex-col shadow-2xl">
        <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
          <div>
            <p className="text-sm font-semibold">Fraud Alerts</p>
            <p className="text-xs text-muted-foreground">{alerts.length} active alerts</p>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {alerts.map(alert => {
            const relatedInvoice =
              invoices.find(i => i.vendor === alert.vendor && ['blocked', 'needs-approval'].includes(i.status))
              ?? invoices.find(i => i.vendor === alert.vendor);
            return (
              <button
                key={alert.id}
                onClick={() => relatedInvoice && onSelectInvoice(relatedInvoice)}
                disabled={!relatedInvoice}
                className="w-full text-left px-5 py-4 hover:bg-muted/40 transition-colors group disabled:opacity-60 disabled:cursor-default"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold">{alert.vendor}</span>
                      <StatusBadge status="blocked" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{alert.type}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{alert.description}</p>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mt-1 shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const [activeCard, setActiveCard] = useState<ActiveCard>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [period, setPeriod] = useState<Period>('today');

  const toggle = (card: ActiveCard) => setActiveCard(prev => prev === card ? null : card);

  const stats = periodStats[period];
  const chartData = periodChartData[period];

  // live counts from mock data (used for today; other periods use periodStats)
  const countApproved = period === 'today' ? invoices.filter(i => i.status === 'auto-approved').length : stats.approved;
  const countPending  = period === 'today' ? invoices.filter(i => i.status === 'needs-approval').length : stats.pending;
  const countBlocked  = period === 'today' ? invoices.filter(i => i.status === 'blocked').length : stats.blocked;
  const countReceived = period === 'today' ? invoices.length : stats.received;

  const pendingTotal = invoices.filter(i => i.status === 'needs-approval').reduce((sum, i) => sum + i.amount, 0);
  const balance = walletBalances.usdc;
  const shortfall = pendingTotal - balance;
  const needsDeposit = shortfall > 0;

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'week',  label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'year',  label: 'Year' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Treasury operations overview — March 21, 2026</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1 shrink-0">
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={cn(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                period === p.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={cn(
          'flex items-center gap-6 rounded-lg border px-5 py-3 shrink-0',
          needsDeposit ? 'border-destructive/40 bg-destructive/5' : 'border-success/30 bg-success/5'
        )}>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Available Balance</p>
            <p className={cn('text-xl font-semibold font-mono', needsDeposit ? 'text-destructive' : 'text-success')}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Pending Payments</p>
            <p className="text-xl font-semibold font-mono">
              ${pendingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          {needsDeposit && (
            <>
              <div className="h-8 w-px bg-border" />
              <div className="flex items-center gap-1.5 text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="text-xs font-medium">Deposit required</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Received" value={countReceived} icon={Inbox}
          trend={{ value: stats.trend, positive: true }}
          onClick={() => toggle('received')}
          className={activeCard === 'received' ? 'ring-1 ring-primary' : ''}
        />
        <MetricCard
          title="Auto-Approved" value={countApproved.toLocaleString()} icon={CheckCircle}
          subtitle="Below $200 threshold"
          onClick={() => toggle('approved')}
          className={activeCard === 'approved' ? 'ring-1 ring-primary' : ''}
        />
        <MetricCard
          title="Pending Review" value={countPending.toLocaleString()} icon={Clock}
          subtitle="Human approval required"
          onClick={() => toggle('pending')}
          className={activeCard === 'pending' ? 'ring-1 ring-primary' : ''}
        />
        <MetricCard
          title="Fraud Alerts" value={countBlocked.toLocaleString()} icon={AlertTriangle}
          iconClassName="bg-destructive/10"
          onClick={() => toggle('fraud')}
          className={activeCard === 'fraud' ? 'ring-1 ring-destructive' : ''}
        />
        <MetricCard title="Total Payouts" value={stats.payout} icon={DollarSign} trend={{ value: stats.trend, positive: true }} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payout Volume Chart */}
        <div className="lg:col-span-2 rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Payout Volume — {period.charAt(0).toUpperCase() + period.slice(1)}</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="payoutGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="hsl(215, 15%, 55%)" tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(215, 15%, 55%)" tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'hsl(222, 25%, 11%)', border: '1px solid hsl(222, 20%, 18%)', borderRadius: '8px', fontSize: 12 }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Payout']} />
                <Area type="monotone" dataKey="amount" stroke="hsl(185, 70%, 50%)" fill="url(#payoutGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Invoice Status</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222, 25%, 11%)', border: '1px solid hsl(222, 20%, 18%)', borderRadius: '8px', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {statusDistribution.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: r.fill }} />
                  <span className="text-muted-foreground">{r.name}</span>
                </div>
                <span className="font-medium">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lower Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((event) => (
              <div key={event.id} className="flex items-start gap-3 text-xs">
                <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{event.action}</span>
                    <span className="text-muted-foreground">· {event.actor}</span>
                  </div>
                  <p className="text-muted-foreground truncate">{event.details}</p>
                </div>
                <span className="text-muted-foreground shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* AI Decisions */}
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">AI Decisions Today</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Invoices analyzed</span><span className="font-medium">10</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Auto-approved</span><span className="font-medium text-success">3</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Sent to review</span><span className="font-medium text-warning">4</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Blocked</span><span className="font-medium text-destructive">2</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duplicates caught</span><span className="font-medium text-destructive">1</span></div>
            </div>
          </div>

          {/* Policy Engine Status */}
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Policy Engine</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 text-success" />
                <span className="text-muted-foreground">Active & enforcing</span>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Auto-pay threshold</span><span className="font-mono font-medium">${policyConfig.autoPayThreshold}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Known vendors only</span><span className="font-medium text-success">Yes</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Wallet changes → human</span><span className="font-medium text-success">Yes</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Duplicates blocked</span><span className="font-medium text-success">Yes</span></div>
            </div>
          </div>

          {/* Treasury Wallet */}
          <div className="rounded-lg border border-glow bg-card p-5 shadow-glow">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Treasury Wallet</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'USDC', value: `$${walletBalances.usdc.toLocaleString()}`, dot: 'hsl(217,91%,60%)', bold: true },
                { label: 'USDT', value: `$${walletBalances.usdt.toLocaleString()}`, dot: 'hsl(158,64%,52%)', bold: false },
                { label: 'EURC', value: `€${walletBalances.eurc.toLocaleString()}`, dot: 'hsl(36,100%,50%)', bold: false },
              ].map(({ label, value, dot, bold }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full shrink-0" style={{ background: dot }} />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                  <span className={cn('font-mono', bold ? 'text-base font-semibold' : 'text-sm font-medium')}>{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1 border-t border-border/50">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: 'hsl(291,47%,60%)' }} />
                  <span className="text-xs text-muted-foreground">SOL</span>
                </div>
                <span className="text-sm font-mono font-medium">{walletBalances.sol} SOL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drawers */}
      {activeCard && (
        <InvoiceListDrawer
          card={activeCard}
          onClose={() => setActiveCard(null)}
          onSelectInvoice={(inv) => setSelectedInvoice(inv)}
        />
      )}

      {/* PDF Modal */}
      {selectedInvoice && (
        <InvoicePdfModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
