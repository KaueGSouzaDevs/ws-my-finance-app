import { createClient } from '@/lib/supabase/server';
import { CreditCardForm } from '@/components/credit-cards/credit-card-form';
import { CreditCardList } from '@/components/credit-cards/credit-card-list';
import { CreditCard, Plus } from 'lucide-react';

export default async function CreditCardsPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: cards }, { data: transactions }] = await Promise.all([
    supabase
      .from('credit_cards' as any)
      .select('*')
      .order('name', { ascending: true }),
    supabase
      .from('transactions')
      .select('amount, date, credit_card_id, description, id')
      .not('credit_card_id', 'is', null)
  ]);

  // Calculate open invoice balances
  const invoiceBalances: Record<string, number> = {};

  if (cards && transactions) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    cards.forEach((card: any) => {
      let total = 0;

      transactions.forEach((t: any) => {
        if (t.credit_card_id !== card.id) return;

        const purchaseDate = new Date(t.date + 'T00:00:00');
        const purchaseDay = purchaseDate.getDate();

        const invoiceClosingDate = new Date(currentYear, currentMonth, card.closing_day);
        if (now > invoiceClosingDate) {
          invoiceClosingDate.setMonth(invoiceClosingDate.getMonth() + 1);
        }

        const billingDate = new Date(purchaseDate);
        if (purchaseDay > card.closing_day) {
          billingDate.setMonth(billingDate.getMonth() + 1);
        }

        if (billingDate.getMonth() === invoiceClosingDate.getMonth() &&
            billingDate.getFullYear() === invoiceClosingDate.getFullYear()) {
          total += Number(t.amount);
        }
      });

      invoiceBalances[card.id] = total;
    });
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-rose-500/10 rounded-[1.25rem] flex items-center justify-center text-rose-600">
            <CreditCard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Cartões</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Gerencie seus limites e faturas</p>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-none relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-2 mb-6 relative z-10">
          <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center text-rose-500">
            <Plus size={18} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black tracking-tight">Novo Cartão</h2>
        </div>
        <div className="relative z-10">
          <CreditCardForm />
        </div>
      </div>

      <CreditCardList
        cards={cards || []}
        invoiceBalances={invoiceBalances}
        transactions={transactions || []}
      />
    </div>
  );
}
