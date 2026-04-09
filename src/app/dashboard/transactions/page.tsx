import { createClient } from '@/lib/supabase/server';
import { TransactionForm } from '@/components/forms/transaction-form';
import { TransactionList } from '@/components/transactions/transaction-list';
import { LayoutDashboard, Plus } from 'lucide-react';

export default async function TransactionsPage() {
  const supabase = createClient();

  const [{ data: transactions }, { data: categories }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, categories(name, icon, color)')
      .order('date', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
  ]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-primary/10 rounded-[1.25rem] flex items-center justify-center text-primary">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Transações</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Histórico completo das suas finanças</p>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-2 mb-6 relative z-10">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Plus size={18} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black tracking-tight">Nova Transação</h2>
        </div>
        <div className="relative z-10">
          <TransactionForm categories={categories || []} />
        </div>
      </div>

      <TransactionList
        transactions={transactions || []}
        categories={categories || []}
      />
    </div>
  );
}
