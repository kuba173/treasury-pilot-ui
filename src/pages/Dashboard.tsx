import { MetricCard } from '@/components/MetricCard';
import { RiskBadge, StatusBadge } from '@/components/StatusBadge';
import { invoices, payoutChartData, riskDistribution, walletBalances, auditEvents, policyConfig } from '@/lib/mock-data';
import {
  Inbox, CheckCircle, Clock, AlertTriangle, DollarSign, BrainCircuit, Shield, Wallet,
  ArrowUpRight, ArrowDownRight, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const recentActivity = auditEvents.slice(0, 8);

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Treasury operations overview — March 21, 2026</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Received Today" value="10" icon={Inbox} trend={{ value: '+3 vs yesterday', positive: true }} />
        <MetricCard title="Auto-Approved" value="3" icon={CheckCircle} subtitle="Below $200 threshold" />
        <MetricCard title="Pending Review" value="4" icon={Clock} subtitle="Human approval required" />
        <MetricCard title="Fraud Alerts" value="6" icon={AlertTriangle} iconClassName="bg-destructive/10" />
        <MetricCard title="Monthly Payouts" value="$286K" icon={DollarSign} trend={{ value: '+12% MoM', positive: true }} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payout Volume Chart */}
        <div className="lg:col-span-2 rounded-lg border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Payout Volume (March)</h3>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={payoutChartData}>
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
          <h3 className="text-sm font-semibold mb-4">Risk Distribution</h3>
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(222, 25%, 11%)', border: '1px solid hsl(222, 20%, 18%)', borderRadius: '8px', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {riskDistribution.map((r) => (
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
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">USDC Balance</span>
                <span className="text-lg font-mono font-semibold">${walletBalances.usdc.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">SOL Balance</span>
                <span className="text-sm font-mono font-medium">{walletBalances.sol} SOL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
