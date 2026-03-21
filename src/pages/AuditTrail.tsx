import { auditEvents } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { ScrollText, FileText, BrainCircuit, Shield, CheckCircle, XCircle, Send, Link2 } from 'lucide-react';

const actionIcons: Record<string, typeof FileText> = {
  'Invoice Ingested': FileText,
  'AI Analysis Complete': BrainCircuit,
  'Policy Check Passed': Shield,
  'Payment Auto-Approved': CheckCircle,
  'Payment Executed': Send,
  'Transaction Confirmed': Link2,
  'Payment Blocked': XCircle,
  'Alert Created': Shield,
  'Human Review Requested': Shield,
  'Duplicate Detected': XCircle,
};

const actionColors: Record<string, string> = {
  'Invoice Ingested': 'text-info bg-info/10',
  'AI Analysis Complete': 'text-primary bg-primary/10',
  'Policy Check Passed': 'text-success bg-success/10',
  'Payment Auto-Approved': 'text-success bg-success/10',
  'Payment Executed': 'text-primary bg-primary/10',
  'Transaction Confirmed': 'text-success bg-success/10',
  'Payment Blocked': 'text-destructive bg-destructive/10',
  'Alert Created': 'text-warning bg-warning/10',
  'Human Review Requested': 'text-warning bg-warning/10',
  'Duplicate Detected': 'text-destructive bg-destructive/10',
};

export default function AuditTrail() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-sm text-muted-foreground mt-1">Immutable record of all treasury operations</p>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {auditEvents.length} events recorded
            </span>
          </div>
        </div>
        <div className="divide-y divide-border/50">
          {auditEvents.map((event) => {
            const Icon = actionIcons[event.action] || FileText;
            const colorClass = actionColors[event.action] || 'text-muted-foreground bg-muted/50';
            return (
              <div key={event.id} className="px-5 py-3.5 hover:bg-accent/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={cn('mt-0.5 h-7 w-7 rounded flex items-center justify-center shrink-0', colorClass)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">{event.action}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{event.actor}</span>
                      {event.invoiceId && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{event.invoiceId}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.details}</p>
                    {event.txHash && (
                      <p className="text-[10px] text-primary font-mono mt-1">TX: {event.txHash}</p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4 text-center">
        <p className="text-xs text-muted-foreground">
          <Shield className="h-3 w-3 inline mr-1" />
          All events are cryptographically signed and stored immutably. This log is compliance-ready and cannot be modified.
        </p>
      </div>
    </div>
  );
}
