import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
  iconClassName?: string;
}

export function MetricCard({ title, value, subtitle, icon: Icon, trend, className, iconClassName }: MetricCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-5 shadow-glow', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn('text-xs font-medium', trend.positive ? 'text-success' : 'text-destructive')}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div className={cn('rounded-lg p-2.5 bg-primary/10', iconClassName)}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
