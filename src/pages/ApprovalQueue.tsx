import { useState } from 'react';
import { invoices, alerts, policyConfig, Invoice, type StableCoin } from '@/lib/mock-data';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, FileText, X, Send, Ban, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const coinColors: Record<StableCoin, { bg: string; text: string; border: string }> = {
  USDC: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  USDT: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  EURC: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
};

const pendingApprovals = invoices.filter(i => i.status === 'needs-approval');

const reasons: Record<string, string[]> = {
  'INV-002': ['Amount ($12,500) exceeds $200 threshold', 'Amount 68% above vendor average'],
  'INV-005': ['Amount ($34,200) exceeds $200 threshold', 'Wallet address changed from prior invoice'],
  'INV-007': ['Amount ($4,800) exceeds $200 threshold'],
  'INV-008': ['Amount ($67,500) exceeds $200 threshold', 'Suspicious attachment detected'],
  'INV-010': ['First invoice from new vendor', 'Amount ($2,200) exceeds $200 threshold'],
};

function InvoicePdfModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const [paid, setPaid] = useState(false);
  const fraudAlerts = alerts.filter(a => a.vendor === invoice.vendor);
  const dueDate = new Date(invoice.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const receivedDate = new Date(invoice.receivedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[93vh] flex flex-col rounded-xl border border-warning/50 shadow-2xl bg-card">

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

        <div className="shrink-0 border-b px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Amount</p>
              <p className="text-xl font-semibold font-mono">{invoice.settlementCoin === 'EURC' ? '€' : '$'}{invoice.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-muted-foreground">{invoice.settlementCoin}</span></p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{invoice.currency} {invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">Payment status</p>
              <div className="mt-1"><StatusBadge status={invoice.status} /></div>
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

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>Risk score: <span className="font-semibold text-foreground">{invoice.riskScore}/100</span></span>
            <span>·</span>
            <span>Route: <span className="font-medium text-foreground">{invoice.paymentRoute}</span></span>
            <span>·</span>
            <span>Source: <span className="font-medium text-foreground capitalize">{invoice.source}</span></span>
            <span>·</span>
            <span>Country: <span className="font-medium text-foreground">{invoice.vendorCountry}</span></span>
          </div>

          {(reasons[invoice.id] || fraudAlerts.length > 0) && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 space-y-2">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-warning">Why approval is required</p>
              {(reasons[invoice.id] || []).map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-warning">▸</span>
                  <span>{r}</span>
                </div>
              ))}
              {fraudAlerts.map(a => (
                <div key={a.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="mt-0.5 shrink-0 text-warning">▸</span>
                  <span><span className="font-medium text-foreground">{a.type}:</span> {a.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="shrink-0 border-b px-5 py-3 flex items-center gap-3">
          {paid ? (
            <div className="flex items-center gap-2 text-success text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              Payment approved — {invoice.currency} {invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} sent via {invoice.paymentRoute}
            </div>
          ) : (
            <>
              <button
                onClick={() => setPaid(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                Pay {invoice.settlementCoin === 'EURC' ? '€' : '$'}{invoice.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {invoice.settlementCoin}
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <Ban className="h-3.5 w-3.5" />
                Reject
              </button>
            </>
          )}
        </div>

        <div className="flex-1 overflow-hidden rounded-b-xl" style={{ minHeight: '300px' }}>
          <embed src="/invoice-template.pdf" type="application/pdf" className="w-full h-full" style={{ minHeight: '300px' }} />
        </div>
      </div>
    </div>
  );
}

type SortKey = 'amount-desc' | 'amount-asc' | 'due-date';

export default function ApprovalQueue() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('amount-desc');

  const pending = pendingApprovals
    .filter(i => !approved.has(i.id) && !rejected.has(i.id))
    .filter(i => !search || i.vendor.toLowerCase().includes(search.toLowerCase()) || i.invoiceNumber.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'amount-desc') return b.amount - a.amount;
      if (sort === 'amount-asc') return a.amount - b.amount;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approval Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">{pending.length} invoices awaiting human approval</p>
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search vendor or invoice…"
            className="w-full h-9 rounded-md border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="h-9 rounded-md border bg-card px-3 text-sm text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="amount-desc">Amount: High → Low</option>
          <option value="amount-asc">Amount: Low → High</option>
          <option value="due-date">Due Date</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {/* Approved / Rejected confirmations */}
        {pendingApprovals.filter(i => approved.has(i.id) || rejected.has(i.id)).map(inv => {
          const isApproved = approved.has(inv.id);
          return (
            <div key={inv.id} className={cn('rounded-lg border p-5 flex items-center gap-3', isApproved ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5')}>
              {isApproved
                ? <CheckCircle className="h-4 w-4 text-success shrink-0" />
                : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{inv.vendor}</p>
                <p className="text-xs text-muted-foreground">{inv.invoiceNumber} · {inv.settlementCoin === 'EURC' ? '€' : '$'}{inv.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} {inv.settlementCoin}</p>
              </div>
              <span className={cn('text-xs font-medium', isApproved ? 'text-success' : 'text-destructive')}>
                {isApproved ? 'Payment approved' : 'Rejected'}
              </span>
            </div>
          );
        })}

        {/* Pending */}
        {pending.map((inv) => (
          <div key={inv.id} className="rounded-lg border bg-card p-5 hover:shadow-glow transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">{inv.vendor}</h3>
                <p className="text-xs text-muted-foreground">{inv.vendorCountry} · {inv.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className={cn('text-lg font-mono font-semibold', inv.settlementCoin === 'USDC' ? 'text-blue-400' : inv.settlementCoin === 'USDT' ? 'text-emerald-400' : 'text-amber-400')}>
                  {inv.settlementCoin === 'EURC' ? '€' : '$'}{inv.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  <span className="text-xs ml-1 font-normal opacity-80">{inv.settlementCoin}</span>
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">{inv.currency} {inv.amount.toLocaleString()} · Score {inv.riskScore}/100</p>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">Why approval is required</p>
              <div className="space-y-1">
                {(reasons[inv.id] || ['Amount exceeds threshold']).map((r, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-warning shrink-0" /> {r}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
              <span>Due: {inv.dueDate}</span>
              <span>·</span>
              <span>Source: {inv.source}</span>
              <span>·</span>
              <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold', coinColors[inv.settlementCoin].bg, coinColors[inv.settlementCoin].text, coinColors[inv.settlementCoin].border)}>
                {inv.settlementCoin} {inv.settlementCoin === 'EURC' ? '€' : '$'}{inv.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} · Solana
              </span>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground h-8"
                onClick={() => setApproved(prev => new Set([...prev, inv.id]))}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="destructive" className="flex-1 h-8"
                onClick={() => setRejected(prev => new Set([...prev, inv.id]))}>
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
              <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5" onClick={() => setSelectedInvoice(inv)}>
                <FileText className="h-3.5 w-3.5" /> Preview
              </Button>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground">Received {new Date(inv.receivedAt).toLocaleString()} → AI analyzed → Policy flagged → Sent to queue</p>
            </div>
          </div>
        ))}

        {pending.length === 0 && approved.size + rejected.size === pendingApprovals.length && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            <CheckCircle className="h-8 w-8 mx-auto mb-3 text-success" />
            All invoices have been processed.
          </div>
        )}
      </div>

      {selectedInvoice && (
        <InvoicePdfModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
}
