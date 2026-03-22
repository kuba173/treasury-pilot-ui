import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { walletBalances } from '@/lib/mock-data';
import { X, Copy, ExternalLink, Wallet, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const WALLET_ADDRESS = '8YLKqsh7AaKwEsHEMhpZFC6c7tMXgHBmBFzKF5dB3p7x';
const NETWORK = 'Solana Mainnet';

function WalletModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-14">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-80 rounded-xl border bg-card shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Treasury Wallet</span>
          </div>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-muted transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* User */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              AP
            </div>
            <div>
              <p className="text-sm font-semibold">Treasury Admin</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">{NETWORK}</span>
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
            {[
              { label: 'USDC', value: `$${walletBalances.usdc.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, dot: 'hsl(217,91%,60%)' },
              { label: 'USDT', value: `$${walletBalances.usdt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, dot: 'hsl(158,64%,52%)' },
              { label: 'EURC', value: `€${walletBalances.eurc.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, dot: 'hsl(36,100%,50%)' },
              { label: 'SOL',  value: `${walletBalances.sol} SOL`, dot: 'hsl(291,47%,60%)' },
            ].map(({ label, value, dot }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: dot }} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <span className="text-sm font-semibold font-mono">{value}</span>
              </div>
            ))}
          </div>

          {/* Wallet address */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Wallet Address</p>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
              <span className="text-xs font-mono flex-1 truncate">{WALLET_ADDRESS}</span>
              <button onClick={copy} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                {copied
                  ? <CheckCircle className="h-3.5 w-3.5 text-success" />
                  : <Copy className="h-3.5 w-3.5" />
                }
              </button>
            </div>
          </div>

          {/* Explorer link */}
          <a
            href={`https://solscan.io/account/${WALLET_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-lg border px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View on Solscan
          </a>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [walletOpen, setWalletOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setWalletOpen(v => !v)}
                className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary hover:bg-primary/30 transition-colors"
              >
                AP
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      {walletOpen && <WalletModal onClose={() => setWalletOpen(false)} />}
    </SidebarProvider>
  );
}
