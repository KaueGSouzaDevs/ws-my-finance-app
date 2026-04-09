import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, ArrowUpRight, User, LogOut, Tags, Wallet } from 'lucide-react';
import { signOut } from '@/app/actions/auth';

function BottomNavItem({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-primary transition-all active:scale-95">
      {icon}
      <span className="text-[10px] font-medium tracking-tight">{label}</span>
    </Link>
  );
}

function Logo() {
  return (
    <div className="flex items-center space-x-3 px-2">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
        <Wallet size={20} strokeWidth={2.5} />
      </div>
      <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">Finanças</span>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 backdrop-blur-xl p-6 relative z-20">
        <Logo />

        <nav className="mt-12 space-y-1.5">
          <Link href="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all font-medium group">
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
            <span>Painel</span>
          </Link>
          <Link href="/dashboard/transactions" className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all font-medium group">
            <ArrowUpRight size={20} className="group-hover:scale-110 transition-transform" />
            <span>Transações</span>
          </Link>
          <Link href="/dashboard/categories" className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all font-medium group">
            <Tags size={20} className="group-hover:scale-110 transition-transform" />
            <span>Categorias</span>
          </Link>
          <Link href="/dashboard/profile" className="flex items-center space-x-3 px-4 py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-all font-medium group">
            <User size={20} className="group-hover:scale-110 transition-transform" />
            <span>Perfil</span>
          </Link>
        </nav>

        <div className="mt-auto">
          <form action={signOut}>
            <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-500 hover:text-red-600 transition-all font-medium group">
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span>Sair da conta</span>
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-18 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl flex justify-around items-center z-50 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none px-2">
        <BottomNavItem icon={<LayoutDashboard size={22} />} label="Painel" href="/dashboard" />
        <BottomNavItem icon={<ArrowUpRight size={22} />} label="Transações" href="/dashboard/transactions" />
        <BottomNavItem icon={<Tags size={22} />} label="Categorias" href="/dashboard/categories" />
        <BottomNavItem icon={<User size={22} />} label="Perfil" href="/dashboard/profile" />
        <form action={signOut} className="flex flex-col items-center justify-center">
          <button className="flex flex-col items-center justify-center space-y-1 text-slate-400 hover:text-red-500 transition-all active:scale-95">
            <LogOut size={22} />
            <span className="text-[10px] font-medium tracking-tight">Sair</span>
          </button>
        </form>
      </nav>
    </div>
  );
}
