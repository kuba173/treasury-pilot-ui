import { alerts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Pause, ArrowUpRight, Eye, MessageSquare } from 'lucide-react';

const statusStyles: Record<string, string> = {
  open: 'bg-destructive/15 text-destructive border-destructive/20',
  investigating: 'bg-warning/15 text-warning border-warning/20',
  resolved: 'bg-success/15 text-success border-success/20',
  escalated: 'bg-destructive/20 text-destructive border-destructive/30',
};

export default function AlertsCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts & Fraud Center</h1>
        <p className="text-sm text-muted-foreground mt-1">{alerts.filter(a => a.status === 'open').length} open alerts requiring attention</p>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-lg border bg-card p-5 hover:border-border/80 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={cn('mt-0.5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0',
                  alert.severity === 'critical' || alert.severity === 'high' ? 'bg-destructive/10' : 'bg-warning/10'
                )}>
                  <AlertTriangle className={cn('h-4 w-4',
                    alert.severity === 'critical' || alert.severity === 'high' ? 'text-destructive' : 'text-warning'
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{alert.type}</h3>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border capitalize', { 'bg-destructive/15 text-destructive border-destructive/20': alert.severity === 'critical' || alert.severity === 'high', 'bg-warning/15 text-warning border-warning/20': alert.severity === 'medium', 'bg-muted/15 text-muted-foreground border-border': alert.severity === 'low' })}>{alert.severity}</span>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', statusStyles[alert.status])}>
                      {alert.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{alert.vendor} · {alert.id}</p>
                  <p className="text-sm text-muted-foreground mt-2">{alert.description}</p>
                  {alert.analystNotes && (
                    <div className="mt-2 p-2.5 rounded bg-muted/50 border border-border/50 text-xs">
                      <div className="flex items-center gap-1 text-muted-foreground mb-1">
                        <MessageSquare className="h-3 w-3" /> Analyst Note
                      </div>
                      {alert.analystNotes}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button variant="outline" size="sm" className="h-7 text-xs"><Eye className="h-3 w-3 mr-1" /> Review</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs"><Pause className="h-3 w-3 mr-1" /> Freeze</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs text-destructive hover:text-destructive"><ArrowUpRight className="h-3 w-3 mr-1" /> Escalate</Button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
