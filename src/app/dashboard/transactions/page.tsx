import { createClient } from '@/lib/supabase/server';
import { TransactionForm } from '@/components/forms/transaction-form';
import { TransactionList } from '@/components/transactions/transaction-list';

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
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
      </header>

      <div className="bg-accent/30 p-6 rounded-2xl border">
        <h2 className="text-lg font-semibold mb-4">Adicionar Nova Transação</h2>
        <TransactionForm categories={categories || []} />
      </div>

      <TransactionList
        transactions={transactions || []}
        categories={categories || []}
      />
    </div>
  );
}
