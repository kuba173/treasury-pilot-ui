import { invoices } from '@/lib/mock-data';
import { RiskBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, MessageSquare, Clock } from 'lucide-react';

const pendingApprovals = invoices.filter(i => i.status === 'pending-review' || i.status === 'awaiting-approval');

const reasons: Record<string, string[]> = {
  'INV-002': ['Amount ($12,500) exceeds $200 threshold', 'Amount 68% above vendor average'],
  'INV-005': ['Amount ($34,200) exceeds $200 threshold', 'Wallet address changed from prior invoice', 'Risk score 65/100'],
  'INV-007': ['Amount ($4,800) exceeds $200 threshold'],
  'INV-008': ['Amount ($67,500) exceeds $200 threshold', 'Suspicious attachment detected', 'High risk score 78/100'],
  'INV-010': ['First invoice from new vendor', 'Amount ($2,200) exceeds $200 threshold'],
};

export default function ApprovalQueue() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Approval Queue</h1>
        <p className="text-sm text-muted-foreground mt-1">{pendingApprovals.length} invoices awaiting human approval</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pendingApprovals.map((inv) => (
          <div key={inv.id} className="rounded-lg border bg-card p-5 hover:shadow-glow transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold">{inv.vendor}</h3>
                <p className="text-xs text-muted-foreground">{inv.vendorCountry} · {inv.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-mono font-semibold">${inv.amount.toLocaleString()}</p>
                <RiskBadge level={inv.riskLevel} />
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

            <div className="text-xs text-muted-foreground mb-4">
              <span>Due: {inv.dueDate}</span> · <span>Source: {inv.source}</span> · <span>{inv.paymentRoute}</span>
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-success hover:bg-success/90 text-success-foreground h-8">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
              </Button>
              <Button size="sm" variant="destructive" className="flex-1 h-8">
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
              <Button size="sm" variant="outline" className="h-8">
                <MessageSquare className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-[10px] text-muted-foreground">Audit: Received {new Date(inv.receivedAt).toLocaleString()} → AI analyzed → Policy flagged → Sent to queue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
