import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowUpRight, User } from 'lucide-react';

function BottomNavItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center space-y-1 text-muted-foreground hover:text-primary transition-colors">
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
}

function Logo() {
  return (
    <div className="flex items-center space-x-2 font-bold text-xl">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
        $
      </div>
      <span>Finance</span>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-accent/50 p-4">
        <Logo />
        <nav className="mt-8 space-y-2">
          <Link href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link href="/dashboard/transactions" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
            <ArrowUpRight size={20} />
            <span>Transactions</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
            <User size={20} />
            <span>Profile</span>
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-md flex justify-around items-center z-50">
        <BottomNavItem icon={<LayoutDashboard size={24} />} label="Home" href="/dashboard" />
        <BottomNavItem icon={<ArrowUpRight size={24} />} label="Transact" href="/dashboard/transactions" />
        <BottomNavItem icon={<User size={24} />} label="Profile" href="/dashboard/profile" />
      </nav>
    </div>
  );
}
