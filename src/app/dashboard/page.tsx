import { createClient } from '@/lib/supabase/server';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { SummaryGrid } from '@/components/dashboard/summary-grid';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { LayoutDashboard } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Acesso Restrito</h1>
        <p className="text-slate-500 font-medium">Por favor, faça login para ver seu painel.</p>
      </div>
    );
  }

  // Parallel data fetching
  const [transactionsRes, profileRes] = await Promise.all([
    supabase.from('transactions').select('amount, type'),
    supabase.from('profiles').select('*').single()
  ]);

  const totals = (transactionsRes.data as any[])?.reduce((acc, curr) => {
    acc[curr.type as 'income' | 'expense'] += Number(curr.amount);
    return acc;
  }, { income: 0, expense: 0 }) || { income: 0, expense: 0 };

  const fullName = 
    (profileRes.data as any)?.full_name || 
    user.user_metadata?.full_name || 
    user.user_metadata?.name || 
    user.user_metadata?.displayName || 
    user.email;
  const firstName = fullName?.split(' ')[0];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Olá, {firstName}!</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Aqui está o resumo da sua vida financeira.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <BalanceCard
            balance={totals.income - totals.expense}
            currency={(profileRes.data as any)?.currency || 'BRL'}
          />
          <SummaryGrid income={totals.income} expense={totals.expense} />
        </div>

        <div className="lg:col-span-5">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
