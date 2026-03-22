import { useState } from 'react';
import { invoices, type Invoice, type StableCoin } from '@/lib/mock-data';
import { StatusBadge } from '@/components/StatusBadge';
import { Input } from '@/components/ui/input';
import { Search, X, FileText, BrainCircuit, Shield, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const coinColors: Record<StableCoin, { bg: string; text: string }> = {
  USDC: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  USDT: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  EURC: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
};

function CoinBadge({ coin, amount }: { coin: StableCoin; amount: number }) {
  const c = coinColors[coin];
  const prefix = coin === 'EURC' ? '€' : '$';
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', c.bg, c.text)}>
      {coin} {prefix}{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </span>
  );
}

const filters = ['all', 'approved', 'needs-approval', 'blocked', 'new-vendors', 'above-threshold'] as const;
type Filter = typeof filters[number];

const filterLabels: Record<Filter, string> = {
  all: 'All', approved: 'Auto-Approved', 'needs-approval': 'Needs Approval', blocked: 'Blocked',
  'new-vendors': 'New Vendors', 'above-threshold': 'Above Threshold',
};

function InvoiceDetailPanel({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const aiAnalysis = [
    { label: 'Vendor domain matches historical pattern', result: invoice.riskScore < 50, },
    { label: 'Wallet changed from last invoice', result: invoice.riskScore > 60, negative: true },
    { label: `Amount is ${invoice.riskScore > 40 ? '18% above' : 'within'} normal range`, result: invoice.riskScore <= 40 },
    { label: 'Invoice number similarity to prior paid invoice', result: invoice.status === 'blocked', negative: true },
    { label: 'Duplicate likelihood', result: invoice.status !== 'duplicate-suspected' },
    { label: `Fraud risk score: ${invoice.riskScore}/100`, result: invoice.riskScore < 30 },
  ];

  const policyChecks = [
    { label: 'Under threshold ($200)?', passed: invoice.amount < 200 },
    { label: 'Known vendor?', passed: invoice.riskScore < 70 },
    { label: 'Wallet approved?', passed: invoice.riskScore < 60 },
    { label: 'Duplicate check passed?', passed: invoice.status !== 'duplicate-suspected' },
  ];

  return (
    <div className="w-full max-w-md border-l border-border bg-card overflow-y-auto animate-slide-in">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">{invoice.invoiceNumber}</h3>
          <p className="text-xs text-muted-foreground">{invoice.vendor}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>

      <div className="p-5 space-y-5">
        {/* Invoice Preview */}
        <div className="rounded-lg border border-border p-4 gradient-glow">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invoice Details</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-muted-foreground">Vendor</span><p className="font-medium">{invoice.vendor}</p></div>
            <div><span className="text-muted-foreground">Country</span><p className="font-medium">{invoice.vendorCountry}</p></div>
            <div>
              <span className="text-muted-foreground">Invoice Amount</span>
              <p className="font-medium text-lg">{invoice.currency} {invoice.amount.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Settlement</span>
              <div className="mt-1">
                <CoinBadge coin={invoice.settlementCoin} amount={invoice.settlementAmount} />
              </div>
            </div>
            <div><span className="text-muted-foreground">Due Date</span><p className="font-medium">{invoice.dueDate}</p></div>
            <div><span className="text-muted-foreground">Source</span><p className="font-medium capitalize">{invoice.source}</p></div>
            <div className="col-span-2"><span className="text-muted-foreground">Wallet</span><p className="font-mono text-[10px] break-all">{invoice.walletAddress}</p></div>
            <div className="col-span-2"><span className="text-muted-foreground">Description</span><p className="font-medium">{invoice.serviceDescription}</p></div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Analysis</span>
          </div>
          <div className="space-y-2">
            {aiAnalysis.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={cn('h-1.5 w-1.5 rounded-full', item.negative ? (item.result ? 'bg-destructive' : 'bg-success') : (item.result ? 'bg-success' : 'bg-destructive'))} />
                <span className="text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Risk Score</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn('h-full rounded-full', invoice.riskScore < 30 ? 'bg-success' : invoice.riskScore < 60 ? 'bg-warning' : 'bg-destructive')} style={{ width: `${invoice.riskScore}%` }} />
                </div>
                <span className="font-mono font-medium">{invoice.riskScore}/100</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-muted-foreground">Recommended</span>
              <span className={cn('font-medium', invoice.riskScore < 30 ? 'text-success' : invoice.riskScore < 60 ? 'text-warning' : 'text-destructive')}>
                {invoice.riskScore < 30 ? 'Auto-approve' : invoice.riskScore < 60 ? 'Human review' : 'Block payment'}
              </span>
            </div>
          </div>
        </div>

        {/* Policy Check */}
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Policy Check</span>
          </div>
          <div className="space-y-2">
            {policyChecks.map((check, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{check.label}</span>
                <span className={cn('font-medium', check.passed ? 'text-success' : 'text-destructive')}>
                  {check.passed ? '✓ Yes' : '✗ No'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground">Approve</Button>
          <Button size="sm" variant="destructive" className="flex-1">Reject</Button>
          <Button size="sm" variant="outline" className="flex-1">Review</Button>
        </div>
        <Button size="sm" className="w-full" variant="default">
          Execute Payment <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export default function InvoiceInbox() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter((inv) => {
    if (search && !inv.vendor.toLowerCase().includes(search.toLowerCase()) && !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'approved') return inv.status === 'auto-approved';
    if (activeFilter === 'needs-approval') return inv.status === 'needs-approval';
    if (activeFilter === 'blocked') return inv.status === 'blocked';
    if (activeFilter === 'above-threshold') return inv.amount > 200;
    return true;
  });

  return (
    <div className="flex h-[calc(100vh-7rem)]">
      <div className="flex-1 min-w-0 space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoice Inbox</h1>
          <p className="text-sm text-muted-foreground mt-1">AP queue — {invoices.length} invoices</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search vendors or invoice numbers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary/50 border-border" />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap border',
                  activeFilter === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/50 text-muted-foreground border-border hover:bg-accent'
                )}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-3 font-medium text-muted-foreground">Vendor</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Invoice #</th>
                  <th className="text-right p-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Source</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Route</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className={cn('border-b border-border/50 cursor-pointer transition-colors hover:bg-accent/50',
                      selectedInvoice?.id === inv.id && 'bg-accent/70'
                    )}
                  >
                    <td className="p-3">
                      <div>
                        <span className="font-medium">{inv.vendor}</span>
                        <p className="text-muted-foreground text-[10px]">{inv.vendorCountry}</p>
                      </div>
                    </td>
                    <td className="p-3 font-mono">{inv.invoiceNumber}</td>
                    <td className="p-3 text-right">
                      <p className="font-mono font-semibold">{inv.settlementCoin === 'EURC' ? '€' : '$'}{inv.settlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className={cn('text-[10px]', inv.settlementCoin === 'USDC' ? 'text-blue-400' : inv.settlementCoin === 'USDT' ? 'text-emerald-400' : 'text-amber-400')}>{inv.settlementCoin}</span></p>
                      <p className="text-[10px] text-muted-foreground font-mono">{inv.currency} {inv.amount.toLocaleString()}</p>
                    </td>
                    <td className="p-3 text-muted-foreground">{inv.dueDate}</td>
                    <td className="p-3"><StatusBadge status={inv.status} /></td>
                    <td className="p-3 capitalize text-muted-foreground">{inv.source}</td>
                    <td className="p-3">
                      <CoinBadge coin={inv.settlementCoin} amount={inv.settlementAmount} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <InvoiceDetailPanel invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </div>
  );
}
