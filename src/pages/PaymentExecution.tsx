import { invoices } from '@/lib/mock-data';
import { CheckCircle, Circle, ArrowRight, Wallet, FileText, BrainCircuit, Shield, Send, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const payment = invoices[3]; // CloudServe - paid on-chain
const txHash = '4sGjMXvMkR8KpNqF2hFkLmNpQXj9BtR7wYh3FcD6gTrA1eU5Zx';

const steps = [
  { label: 'Invoice Received', time: '14:30:00', done: true, icon: FileText },
  { label: 'AI Verification', time: '14:30:08', done: true, icon: BrainCircuit },
  { label: 'Policy Check Passed', time: '14:30:10', done: true, icon: Shield },
  { label: 'Payment Signed', time: '14:30:55', done: true, icon: CheckCircle },
  { label: 'Transaction Submitted', time: '14:31:02', done: true, icon: Send },
  { label: 'Confirmed On-Chain', time: '14:31:35', done: true, icon: Link2 },
];

export default function PaymentExecution() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment Execution</h1>
        <p className="text-sm text-muted-foreground mt-1">On-chain payment details and execution status</p>
      </div>

      {/* Payment Card */}
      <div className="rounded-lg border border-glow bg-card p-6 shadow-glow">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Payment Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><span className="text-xs text-muted-foreground">Source Invoice</span><p className="font-medium">{payment.invoiceNumber}</p></div>
          <div><span className="text-xs text-muted-foreground">Vendor</span><p className="font-medium">{payment.vendor}</p></div>
          <div><span className="text-xs text-muted-foreground">Amount</span><p className="font-mono font-semibold text-lg">${payment.amount}</p></div>
          <div><span className="text-xs text-muted-foreground">Token</span><p className="font-medium">USDC</p></div>
          <div><span className="text-xs text-muted-foreground">Network</span><p className="font-medium">Solana</p></div>
          <div><span className="text-xs text-muted-foreground">Approval Path</span><p className="font-medium text-success">Auto-Approved</p></div>
          <div className="col-span-2 md:col-span-3">
            <span className="text-xs text-muted-foreground">Vendor Wallet</span>
            <p className="font-mono text-xs break-all">{payment.walletAddress}</p>
          </div>
        </div>
      </div>

      {/* Execution Stepper */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Execution Pipeline</h3>
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={cn('h-8 w-8 rounded-full flex items-center justify-center border-2',
                  step.done ? 'bg-primary/20 border-primary' : 'bg-muted border-border'
                )}>
                  <step.icon className={cn('h-3.5 w-3.5', step.done ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                {i < steps.length - 1 && <div className={cn('w-0.5 h-8', step.done ? 'bg-primary/30' : 'bg-border')} />}
              </div>
              <div className="pb-6">
                <p className={cn('text-sm font-medium', step.done ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.time} UTC</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Confirmation */}
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Transaction Confirmation</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Status</span>
            <span className="flex items-center gap-1.5 text-success font-medium"><CheckCircle className="h-3.5 w-3.5" /> Confirmed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Transaction Hash</span>
            <span className="font-mono text-xs text-primary">{txHash.slice(0, 20)}...{txHash.slice(-8)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Block</span>
            <span className="font-mono">#245,892,341</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Network Fee</span>
            <span className="font-mono">0.000005 SOL</span>
          </div>
        </div>
      </div>

      {/* Wallet Balances */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Before Payment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">USDC</span><span className="font-mono font-medium">$284,840.41</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">SOL</span><span className="font-mono font-medium">12.847005</span></div>
          </div>
        </div>
        <div className="rounded-lg border border-glow bg-card p-5 shadow-glow">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">After Payment</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">USDC</span><span className="font-mono font-medium">$284,750.42</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">SOL</span><span className="font-mono font-medium">12.847000</span></div>
          </div>
        </div>
      </div>

      {/* Policy Explanation */}
      <div className="rounded-lg border bg-card p-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Why This Payment Was Allowed</h3>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p>✓ Invoice amount ($89.99) is below the $200 auto-pay threshold</p>
          <p>✓ CloudServe Ltd is an approved vendor with 36 prior payments</p>
          <p>✓ Wallet address matches the vendor's verified payout address</p>
          <p>✓ No duplicate invoice detected</p>
          <p>✓ AI risk score (5/100) is well below the review threshold</p>
        </div>
      </div>
    </div>
  );
}
