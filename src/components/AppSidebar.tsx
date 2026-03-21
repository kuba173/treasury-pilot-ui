import {
  LayoutDashboard,
  Inbox,
  CreditCard,
  Settings,
  Users,
  AlertTriangle,
  CheckCircle,
  ScrollText,
  Shield,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { walletBalances } from '@/lib/mock-data';

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Invoice Inbox', url: '/invoices', icon: Inbox },
  { title: 'Payments', url: '/payments', icon: CreditCard },
  { title: 'Approvals', url: '/approvals', icon: CheckCircle },
];

const riskNav = [
  { title: 'Alerts', url: '/alerts', icon: AlertTriangle },
  { title: 'Vendors', url: '/vendors', icon: Users },
  { title: 'Audit Trail', url: '/audit', icon: ScrollText },
];

const configNav = [
  { title: 'Policy Engine', url: '/policy', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof mainNav) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === '/'}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  activeClassName="bg-primary/10 text-primary"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold tracking-tight text-foreground">Treasury Pilot</h1>
              <p className="text-[10px] text-muted-foreground">AI-Powered AP</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        {renderGroup('Operations', mainNav)}
        {renderGroup('Risk & Compliance', riskNav)}
        {renderGroup('Configuration', configNav)}
      </SidebarContent>
      {!collapsed && (
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">Treasury</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">USDC</span>
              <span className="font-mono font-medium text-foreground">${walletBalances.usdc.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">SOL</span>
              <span className="font-mono font-medium text-foreground">{walletBalances.sol}</span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
