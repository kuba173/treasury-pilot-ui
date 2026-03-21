export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type InvoiceStatus = 'auto-approved' | 'pending-review' | 'blocked' | 'duplicate-suspected' | 'awaiting-approval' | 'paid-on-chain';
export type InvoiceSource = 'email' | 'upload' | 'erp';

export interface Invoice {
  id: string;
  vendor: string;
  vendorCountry: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  dueDate: string;
  riskScore: number;
  riskLevel: RiskLevel;
  status: InvoiceStatus;
  source: InvoiceSource;
  paymentRoute: string;
  walletAddress: string;
  serviceDescription: string;
  receivedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  country: string;
  trustScore: number;
  totalInvoices: number;
  totalPaid: number;
  avgAmount: number;
  walletAddress: string;
  domain: string;
  domainVerified: boolean;
  autoPayApproved: boolean;
  riskEvents: number;
  lastPayment: string;
}

export interface Alert {
  id: string;
  type: string;
  severity: RiskLevel;
  vendor: string;
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved' | 'escalated';
  analystNotes?: string;
}

export interface AuditEvent {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  actor: string;
  invoiceId?: string;
  txHash?: string;
}

export const invoices: Invoice[] = [
  {
    id: 'INV-001',
    vendor: 'Müller GmbH',
    vendorCountry: 'Germany',
    invoiceNumber: 'MG-2024-0891',
    amount: 145.00,
    currency: 'EUR',
    dueDate: '2026-03-28',
    riskScore: 8,
    riskLevel: 'low',
    status: 'auto-approved',
    source: 'email',
    paymentRoute: 'USDC → Solana',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    serviceDescription: 'Monthly SaaS subscription – Analytics module',
    receivedAt: '2026-03-21T08:15:00Z',
  },
  {
    id: 'INV-002',
    vendor: 'Nakamura Corp',
    vendorCountry: 'Japan',
    invoiceNumber: 'NC-78234',
    amount: 12500.00,
    currency: 'USD',
    dueDate: '2026-04-05',
    riskScore: 42,
    riskLevel: 'medium',
    status: 'pending-review',
    source: 'erp',
    paymentRoute: 'USDC → Solana',
    walletAddress: '3Fk8gMBs4k2YbJRmEzF7XVJgk3MkN7yvnBbz1KQaC8Ab',
    serviceDescription: 'Q1 consulting services – market research',
    receivedAt: '2026-03-21T09:22:00Z',
  },
  {
    id: 'INV-003',
    vendor: 'Santos & Filhos Ltda',
    vendorCountry: 'Brazil',
    invoiceNumber: 'SF-00421',
    amount: 8750.00,
    currency: 'USD',
    dueDate: '2026-03-30',
    riskScore: 87,
    riskLevel: 'high',
    status: 'blocked',
    source: 'email',
    paymentRoute: 'USDC → Solana',
    walletAddress: '9pGEF3rD1HqLgTeA3WmQjZxJk4YtBb2cFpNqRvUiG7Xs',
    serviceDescription: 'Hardware procurement – server equipment',
    receivedAt: '2026-03-21T07:45:00Z',
  },
  {
    id: 'INV-004',
    vendor: 'CloudServe Ltd',
    vendorCountry: 'United Kingdom',
    invoiceNumber: 'CS-2024-112',
    amount: 89.99,
    currency: 'USD',
    dueDate: '2026-04-01',
    riskScore: 5,
    riskLevel: 'low',
    status: 'paid-on-chain',
    source: 'email',
    paymentRoute: 'USDC → Solana',
    walletAddress: '5tYh3KxN8qWvPjR2Gm7dLsVpCfT9AeB4nZuXkF6wY1M',
    serviceDescription: 'Cloud hosting – March 2026',
    receivedAt: '2026-03-20T14:30:00Z',
  },
  {
    id: 'INV-005',
    vendor: 'TechFlow Singapore',
    vendorCountry: 'Singapore',
    invoiceNumber: 'TF-SG-0098',
    amount: 34200.00,
    currency: 'USD',
    dueDate: '2026-04-15',
    riskScore: 65,
    riskLevel: 'high',
    status: 'awaiting-approval',
    source: 'upload',
    paymentRoute: 'USDC → Solana',
    walletAddress: '2mR7VbNpQ4xJh8LsT3KwF5Yc6dGnA9eU1ZjXrP0iW4S',
    serviceDescription: 'Software development – Phase 2 milestone',
    receivedAt: '2026-03-21T11:00:00Z',
  },
  {
    id: 'INV-006',
    vendor: 'Müller GmbH',
    vendorCountry: 'Germany',
    invoiceNumber: 'MG-2024-0891',
    amount: 145.00,
    currency: 'EUR',
    dueDate: '2026-03-28',
    riskScore: 92,
    riskLevel: 'critical',
    status: 'duplicate-suspected',
    source: 'email',
    paymentRoute: 'USDC → Solana',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    serviceDescription: 'Monthly SaaS subscription – Analytics module',
    receivedAt: '2026-03-21T08:45:00Z',
  },
  {
    id: 'INV-007',
    vendor: 'Dubois Consulting',
    vendorCountry: 'France',
    invoiceNumber: 'DC-FR-2055',
    amount: 4800.00,
    currency: 'EUR',
    dueDate: '2026-04-10',
    riskScore: 28,
    riskLevel: 'low',
    status: 'awaiting-approval',
    source: 'erp',
    paymentRoute: 'USDC → Solana',
    walletAddress: '8nS4RmKvL2pXj9BtQ7wYh3FcD6gTrA1eU5ZxJkN0iW2P',
    serviceDescription: 'Strategy consulting – Market expansion plan',
    receivedAt: '2026-03-20T16:20:00Z',
  },
  {
    id: 'INV-008',
    vendor: 'Al-Rashid Trading',
    vendorCountry: 'UAE',
    invoiceNumber: 'ART-8841',
    amount: 67500.00,
    currency: 'USD',
    dueDate: '2026-04-20',
    riskScore: 78,
    riskLevel: 'high',
    status: 'pending-review',
    source: 'email',
    paymentRoute: 'USDC → Solana',
    walletAddress: '4kT9HmWvN3pYr7BsQ2xJh8LcF5dGnA6eU1ZjXkP0iR3S',
    serviceDescription: 'Commodity procurement – rare materials',
    receivedAt: '2026-03-21T06:30:00Z',
  },
  {
    id: 'INV-009',
    vendor: 'Nordic Soft AS',
    vendorCountry: 'Norway',
    invoiceNumber: 'NS-2024-445',
    amount: 175.00,
    currency: 'EUR',
    dueDate: '2026-03-25',
    riskScore: 12,
    riskLevel: 'low',
    status: 'auto-approved',
    source: 'erp',
    paymentRoute: 'USDC → Solana',
    walletAddress: '6pW2RnKvM4qXj5BtH8cYh1FaD3gTsA7eU9ZxJkN0iW5L',
    serviceDescription: 'License renewal – project management tools',
    receivedAt: '2026-03-21T10:10:00Z',
  },
  {
    id: 'INV-010',
    vendor: 'Patel & Associates',
    vendorCountry: 'India',
    invoiceNumber: 'PA-IN-7732',
    amount: 2200.00,
    currency: 'USD',
    dueDate: '2026-04-02',
    riskScore: 35,
    riskLevel: 'medium',
    status: 'pending-review',
    source: 'upload',
    paymentRoute: 'USDC → Solana',
    walletAddress: '1mN8VbKpQ3xJh6LsT5RwF2Yc9dGnA4eU7ZjXrP0iW8K',
    serviceDescription: 'Legal services – international compliance review',
    receivedAt: '2026-03-21T12:45:00Z',
  },
];

export const vendors: Vendor[] = [
  {
    id: 'V-001', name: 'Müller GmbH', country: 'Germany', trustScore: 94,
    totalInvoices: 48, totalPaid: 156200, avgAmount: 3254, walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    domain: 'muller-gmbh.de', domainVerified: true, autoPayApproved: true, riskEvents: 0, lastPayment: '2026-03-15',
  },
  {
    id: 'V-002', name: 'Nakamura Corp', country: 'Japan', trustScore: 78,
    totalInvoices: 12, totalPaid: 89000, avgAmount: 7416, walletAddress: '3Fk8gMBs4k2YbJRmEzF7XVJgk3MkN7yvnBbz1KQaC8Ab',
    domain: 'nakamura-corp.jp', domainVerified: true, autoPayApproved: false, riskEvents: 1, lastPayment: '2026-02-28',
  },
  {
    id: 'V-003', name: 'Santos & Filhos Ltda', country: 'Brazil', trustScore: 32,
    totalInvoices: 3, totalPaid: 12500, avgAmount: 4166, walletAddress: '9pGEF3rD1HqLgTeA3WmQjZxJk4YtBb2cFpNqRvUiG7Xs',
    domain: 'santosfilhos.com.br', domainVerified: false, autoPayApproved: false, riskEvents: 4, lastPayment: '2026-01-10',
  },
  {
    id: 'V-004', name: 'CloudServe Ltd', country: 'United Kingdom', trustScore: 97,
    totalInvoices: 36, totalPaid: 3240, avgAmount: 90, walletAddress: '5tYh3KxN8qWvPjR2Gm7dLsVpCfT9AeB4nZuXkF6wY1M',
    domain: 'cloudserve.co.uk', domainVerified: true, autoPayApproved: true, riskEvents: 0, lastPayment: '2026-03-20',
  },
  {
    id: 'V-005', name: 'TechFlow Singapore', country: 'Singapore', trustScore: 61,
    totalInvoices: 6, totalPaid: 87000, avgAmount: 14500, walletAddress: '2mR7VbNpQ4xJh8LsT3KwF5Yc6dGnA9eU1ZjXrP0iW4S',
    domain: 'techflow.sg', domainVerified: true, autoPayApproved: false, riskEvents: 2, lastPayment: '2026-03-01',
  },
];

export const alerts: Alert[] = [
  {
    id: 'ALT-001', type: 'Duplicate Invoice', severity: 'critical', vendor: 'Müller GmbH',
    description: 'Invoice MG-2024-0891 submitted twice within 30 minutes. Identical amount and invoice number.',
    timestamp: '2026-03-21T08:46:00Z', status: 'open',
  },
  {
    id: 'ALT-002', type: 'Wallet Change', severity: 'high', vendor: 'TechFlow Singapore',
    description: 'Payout wallet changed from previous address. New wallet has no prior transaction history.',
    timestamp: '2026-03-21T11:02:00Z', status: 'investigating',
    analystNotes: 'Contacted vendor via verified email to confirm wallet change.',
  },
  {
    id: 'ALT-003', type: 'Domain Mismatch', severity: 'high', vendor: 'Santos & Filhos Ltda',
    description: 'Invoice email sent from santosfilhos-invoices.com instead of santosfilhos.com.br. Possible spoofed domain.',
    timestamp: '2026-03-21T07:46:00Z', status: 'escalated',
  },
  {
    id: 'ALT-004', type: 'Amount Spike', severity: 'medium', vendor: 'Nakamura Corp',
    description: 'Invoice amount $12,500 is 68% above average ($7,416). Unusual for this vendor.',
    timestamp: '2026-03-21T09:25:00Z', status: 'investigating',
  },
  {
    id: 'ALT-005', type: 'Suspicious Attachment', severity: 'medium', vendor: 'Al-Rashid Trading',
    description: 'Invoice PDF contains embedded JavaScript. Potential malicious payload detected.',
    timestamp: '2026-03-21T06:35:00Z', status: 'open',
  },
  {
    id: 'ALT-006', type: 'New Vendor', severity: 'low', vendor: 'Patel & Associates',
    description: 'First invoice from this vendor. No prior payment history. Manual verification required.',
    timestamp: '2026-03-21T12:46:00Z', status: 'open',
  },
];

export const auditEvents: AuditEvent[] = [
  { id: 'AE-001', action: 'Invoice Ingested', details: 'Invoice MG-2024-0891 received via email from Müller GmbH', timestamp: '2026-03-21T08:15:00Z', actor: 'System', invoiceId: 'INV-001' },
  { id: 'AE-002', action: 'AI Analysis Complete', details: 'Risk score: 8/100. Low risk. Vendor verified. Amount under threshold.', timestamp: '2026-03-21T08:15:12Z', actor: 'AI Engine', invoiceId: 'INV-001' },
  { id: 'AE-003', action: 'Policy Check Passed', details: 'Auto-approve policy matched: amount $145 < $200 threshold, known vendor, approved wallet.', timestamp: '2026-03-21T08:15:14Z', actor: 'Policy Engine', invoiceId: 'INV-001' },
  { id: 'AE-004', action: 'Payment Auto-Approved', details: 'Invoice MG-2024-0891 auto-approved per company policy.', timestamp: '2026-03-21T08:15:15Z', actor: 'Policy Engine', invoiceId: 'INV-001' },
  { id: 'AE-005', action: 'Payment Executed', details: 'USDC payment of $145.00 sent to 7xKX...gAsU on Solana.', timestamp: '2026-03-21T08:15:22Z', actor: 'Treasury Bot', invoiceId: 'INV-001', txHash: '4sGjMXvMk...R8KpNqF' },
  { id: 'AE-006', action: 'Transaction Confirmed', details: 'On-chain confirmation received. Block #245892341.', timestamp: '2026-03-21T08:15:35Z', actor: 'Solana Network', invoiceId: 'INV-001', txHash: '4sGjMXvMk...R8KpNqF' },
  { id: 'AE-007', action: 'Invoice Ingested', details: 'Invoice SF-00421 received via email from Santos & Filhos Ltda', timestamp: '2026-03-21T07:45:00Z', actor: 'System', invoiceId: 'INV-003' },
  { id: 'AE-008', action: 'AI Analysis Complete', details: 'Risk score: 87/100. HIGH RISK. Domain mismatch detected. Vendor trust score low.', timestamp: '2026-03-21T07:45:18Z', actor: 'AI Engine', invoiceId: 'INV-003' },
  { id: 'AE-009', action: 'Payment Blocked', details: 'Blocked by policy: domain verification failed, vendor trust below threshold.', timestamp: '2026-03-21T07:45:20Z', actor: 'Policy Engine', invoiceId: 'INV-003' },
  { id: 'AE-010', action: 'Alert Created', details: 'Domain mismatch alert ALT-003 created for review.', timestamp: '2026-03-21T07:46:00Z', actor: 'System', invoiceId: 'INV-003' },
  { id: 'AE-011', action: 'Human Review Requested', details: 'Invoice NC-78234 sent to approval queue. Amount exceeds threshold.', timestamp: '2026-03-21T09:22:30Z', actor: 'Policy Engine', invoiceId: 'INV-002' },
  { id: 'AE-012', action: 'Invoice Ingested', details: 'Invoice CS-2024-112 received via email from CloudServe Ltd', timestamp: '2026-03-20T14:30:00Z', actor: 'System', invoiceId: 'INV-004' },
  { id: 'AE-013', action: 'Payment Executed', details: 'USDC payment of $89.99 sent to 5tYh...wY1M on Solana.', timestamp: '2026-03-20T14:31:05Z', actor: 'Treasury Bot', invoiceId: 'INV-004', txHash: '2hFkLmNpQ...Xj9BtR7' },
  { id: 'AE-014', action: 'Duplicate Detected', details: 'Invoice MG-2024-0891 flagged as duplicate. Identical to INV-001.', timestamp: '2026-03-21T08:45:05Z', actor: 'AI Engine', invoiceId: 'INV-006' },
];

export const payoutChartData = [
  { date: 'Mar 1', amount: 24500 },
  { date: 'Mar 4', amount: 18200 },
  { date: 'Mar 7', amount: 42100 },
  { date: 'Mar 10', amount: 31800 },
  { date: 'Mar 13', amount: 55200 },
  { date: 'Mar 16', amount: 28900 },
  { date: 'Mar 19', amount: 47300 },
  { date: 'Mar 21', amount: 38600 },
];

export const riskDistribution = [
  { name: 'Low Risk', value: 62, fill: 'hsl(160, 60%, 45%)' },
  { name: 'Medium Risk', value: 23, fill: 'hsl(38, 92%, 50%)' },
  { name: 'High Risk', value: 12, fill: 'hsl(0, 72%, 51%)' },
  { name: 'Critical', value: 3, fill: 'hsl(0, 72%, 35%)' },
];

export const walletBalances = {
  usdc: 284750.42,
  sol: 12.847,
};

export const policyConfig = {
  autoPayThreshold: 200,
  requireHumanAboveThreshold: true,
  requireHumanFirstPayment: true,
  requireHumanWalletChange: true,
  blockDuplicates: true,
  dailyTreasuryLimit: 500000,
  allowedVendorListEnabled: true,
  allowedWalletListEnabled: true,
};
