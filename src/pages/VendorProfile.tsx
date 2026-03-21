import { vendors } from '@/lib/mock-data';
import { RiskBadge } from '@/components/StatusBadge';
import { cn } from '@/lib/utils';
import { Users, Shield, Wallet, Globe, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const vendor = vendors[1]; // Nakamura Corp - medium trust

const walletHistory = [
  { address: '3Fk8gMBs4k...QaC8Ab', date: '2025-09-15', status: 'current' },
  { address: '8nP4RmKvL2...iW2P', date: '2025-06-01', status: 'previous' },
];

const riskTimeline = [
  { date: '2026-03-21', event: 'Invoice amount 68% above average', severity: 'medium' as const },
  { date: '2025-12-15', event: 'Wallet address changed', severity: 'high' as const },
  { date: '2025-09-15', event: 'First invoice received', severity: 'low' as const },
];

const recentInvoices = [
  { id: 'NC-78234', amount: 12500, date: '2026-03-21', status: 'Pending Review' },
  { id: 'NC-78100', amount: 7200, date: '2026-02-15', status: 'Paid' },
  { id: 'NC-77890', amount: 8100, date: '2026-01-10', status: 'Paid' },
  { id: 'NC-77600', amount: 6900, date: '2025-12-01', status: 'Paid' },
];

export default function VendorProfile() {
  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vendor Profiles</h1>
        <p className="text-sm text-muted-foreground mt-1">Risk assessment and payment history</p>
      </div>

      {/* Vendor Header */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{vendor.name}</h2>
              <p className="text-sm text-muted-foreground">{vendor.country} · {vendor.domain}</p>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Trust Score</span>
              <span className={cn('text-2xl font-bold font-mono', vendor.trustScore > 80 ? 'text-success' : vendor.trustScore > 50 ? 'text-warning' : 'text-destructive')}>
                {vendor.trustScore}
              </span>
            </div>
            <div className="flex items-center gap-1.5 justify-end">
              {vendor.domainVerified ? (
                <span className="text-xs text-success flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Domain Verified</span>
              ) : (
                <span className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Unverified</span>
              )}
            </div>
            <p className={cn('text-xs font-medium', vendor.autoPayApproved ? 'text-success' : 'text-warning')}>
              {vendor.autoPayApproved ? '✓ Auto-pay approved' : '⚠ Manual approval required'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stats */}
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Invoices</span><span className="font-medium">{vendor.totalInvoices}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total Paid</span><span className="font-mono font-medium">${vendor.totalPaid.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Avg Amount</span><span className="font-mono font-medium">${vendor.avgAmount.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Last Payment</span><span className="font-medium">{vendor.lastPayment}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Risk Events</span><span className={cn('font-medium', vendor.riskEvents > 0 ? 'text-warning' : 'text-success')}>{vendor.riskEvents}</span></div>
            </div>
          </div>

          {/* Wallet History */}
          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="h-4 w-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wallet History</h3>
            </div>
            <div className="space-y-3">
              {walletHistory.map((w, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium', w.status === 'current' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground')}>
                      {w.status}
                    </span>
                    <span className="text-muted-foreground">{w.date}</span>
                  </div>
                  <p className="font-mono mt-1">{w.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice History */}
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Recent Invoices</h3>
          <div className="space-y-3">
            {recentInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between text-sm py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="font-mono font-medium text-xs">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">{inv.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">${inv.amount.toLocaleString()}</p>
                  <p className={cn('text-xs', inv.status === 'Paid' ? 'text-success' : 'text-warning')}>{inv.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Timeline */}
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Risk Events</h3>
          </div>
          <div className="space-y-4">
            {riskTimeline.map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn('h-2 w-2 rounded-full mt-1.5',
                    event.severity === 'low' ? 'bg-success' : event.severity === 'medium' ? 'bg-warning' : 'bg-destructive'
                  )} />
                  {i < riskTimeline.length - 1 && <div className="w-px h-8 bg-border" />}
                </div>
                <div>
                  <p className="text-xs font-medium">{event.event}</p>
                  <p className="text-[10px] text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
