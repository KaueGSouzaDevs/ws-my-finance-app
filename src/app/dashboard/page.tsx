import { createClient } from '@/lib/supabase/server';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { SummaryGrid } from '@/components/dashboard/summary-grid';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Please log in to view your dashboard.</h1>
      </div>
    );
  }

  // Parallel data fetching
  const [transactionsRes, profileRes] = await Promise.all([
    supabase.from('transactions').select('amount, type'),
    supabase.from('profiles').select('*').single()
  ]);

  const totals = transactionsRes.data?.reduce((acc, curr) => {
    acc[curr.type] += Number(curr.amount);
    return acc;
  }, { income: 0, expense: 0 }) || { income: 0, expense: 0 };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <div className="text-sm text-muted-foreground">{profileRes.data?.full_name || user.email}</div>
      </header>

      <BalanceCard
        balance={totals.income - totals.expense}
        currency={profileRes.data?.currency || 'USD'}
      />

      <SummaryGrid income={totals.income} expense={totals.expense} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="bg-accent/20 rounded-xl p-8 text-center text-muted-foreground border-2 border-dashed">
          Transaction history and charts will appear here.
        </div>
      </div>
    </div>
  );
}
