import { cn } from '@/lib/utils';
import type { RiskLevel, InvoiceStatus } from '@/lib/mock-data';

export function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    low: 'bg-success/15 text-success border-success/20',
    medium: 'bg-warning/15 text-warning border-warning/20',
    high: 'bg-destructive/15 text-destructive border-destructive/20',
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
  };
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', styles[level])}>
      {level === 'critical' ? '● Critical' : level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  );
}

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config: Record<InvoiceStatus, { label: string; className: string }> = {
    'auto-approved': { label: 'Auto-Approved', className: 'bg-success/15 text-success border-success/20' },
    'pending-review': { label: 'Pending Review', className: 'bg-warning/15 text-warning border-warning/20' },
    'blocked': { label: 'Blocked', className: 'bg-destructive/15 text-destructive border-destructive/20' },
    'duplicate-suspected': { label: 'Duplicate', className: 'bg-destructive/15 text-destructive border-destructive/20' },
    'awaiting-approval': { label: 'Awaiting Approval', className: 'bg-info/15 text-info border-info/20' },
    'paid-on-chain': { label: 'Paid On-Chain', className: 'bg-primary/15 text-primary border-primary/20' },
  };
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', c.className)}>
      {c.label}
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: RiskLevel }) {
  return <RiskBadge level={severity} />;
}
