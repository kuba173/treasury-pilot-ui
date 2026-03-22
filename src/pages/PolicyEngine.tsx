import { useState } from 'react';
import { policyConfig } from '@/lib/mock-data';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Zap, AlertTriangle, Play } from 'lucide-react';

export default function PolicyEngine() {
  const [config, setConfig] = useState(policyConfig);
  const [simAmount, setSimAmount] = useState('500');
  const [simVendor, setSimVendor] = useState('new');
  const [simResult, setSimResult] = useState<string | null>(null);

  const runSimulation = () => {
    const amount = parseFloat(simAmount);
    const results: string[] = [];
    if (amount <= config.autoPayThreshold && simVendor === 'known') {
      results.push('✓ Auto-approved: amount under threshold and known vendor');
    } else {
      if (amount > config.autoPayThreshold) results.push('⚠ Amount exceeds auto-pay threshold → human approval required');
      if (simVendor === 'new') results.push('⚠ New vendor → human approval required');
      if (simVendor === 'wallet-changed') results.push('🚨 Wallet changed → human approval required, payment frozen');
    }
    setSimResult(results.join('\n'));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Policy Engine</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure payment rules and controls. Blockchain enforces these rules after AI review.</p>
      </div>

      {/* Threshold Controls */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Payment Thresholds</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Auto-pay threshold (USD)</label>
            <Input type="number" value={config.autoPayThreshold} onChange={(e) => setConfig({ ...config, autoPayThreshold: Number(e.target.value) })} className="font-mono bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Daily treasury limit (USD)</label>
            <Input type="number" value={config.dailyTreasuryLimit} onChange={(e) => setConfig({ ...config, dailyTreasuryLimit: Number(e.target.value) })} className="font-mono bg-secondary/50" />
          </div>
        </div>
      </div>

      {/* Toggle Controls */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Approval Rules</h3>
        </div>
        <div className="space-y-4">
          {[
            { key: 'requireHumanAboveThreshold', label: 'Require human approval above threshold', desc: 'Invoices above the auto-pay threshold require a human approver' },
            { key: 'requireHumanFirstPayment', label: 'Require human approval for first payment to new vendor', desc: 'First-time vendors always need manual review' },
            { key: 'requireHumanWalletChange', label: 'Require human approval if wallet changes', desc: 'Flag when a vendor submits a different payout wallet' },
            { key: 'blockDuplicates', label: 'Block duplicate invoice numbers', desc: 'Automatically block invoices with matching numbers' },
            { key: 'allowedVendorListEnabled', label: 'Enforce allowed vendor list', desc: 'Only approved vendors can receive auto-payments' },
            { key: 'allowedWalletListEnabled', label: 'Enforce allowed wallet list', desc: 'Only pre-approved wallet addresses are accepted' },
          ].map((rule) => (
            <div key={rule.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm font-medium">{rule.label}</p>
                <p className="text-xs text-muted-foreground">{rule.desc}</p>
              </div>
              <Switch
                checked={config[rule.key as keyof typeof config] as boolean}
                onCheckedChange={(v) => setConfig({ ...config, [rule.key]: v })}
              />
            </div>
          ))}
        </div>
      </div>

<div className="rounded-lg border bg-card p-4">
        <p className="text-xs text-muted-foreground text-center">
          <Shield className="h-3 w-3 inline mr-1" />
          All policy rules are enforced on-chain via Solana smart contracts after AI verification completes.
        </p>
      </div>
    </div>
  );
}
