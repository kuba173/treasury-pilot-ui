import { cn } from '@/lib/utils';
import type { InvoiceStatus } from '@/lib/mock-data';

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config: Record<InvoiceStatus, { label: string; className: string }> = {
    'auto-approved': { label: 'Auto-Approved', className: 'bg-success/15 text-success border-success/20' },
    'needs-approval': { label: 'Needs Approval', className: 'bg-warning/15 text-warning border-warning/20' },
    'blocked': { label: 'Blocked', className: 'bg-destructive/15 text-destructive border-destructive/20' },
  };
  const c = config[status];
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', c.className)}>
      {c.label}
    </span>
  );
}

