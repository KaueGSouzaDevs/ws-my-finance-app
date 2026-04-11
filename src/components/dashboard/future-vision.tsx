import { createClient } from '@/lib/supabase/server';

export async function FutureVision() {
  const supabase = createClient();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, date, type')
    .eq('type', 'expense')
    .gte('date', new Date().toISOString().split('T')[0]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-[2rem] p-12 text-center text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-800">
        Nenhuma despesa futura projetada.
      </div>
    );
  }

  // Group by month for the next 12 months
  const monthlyProjection: Record<string, number> = {};
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    monthlyProjection[key] = 0;
  }

  transactions.forEach(t => {
    const d = new Date(t.date + 'T00:00:00');
    const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    if (monthlyProjection.hasOwnProperty(key)) {
      monthlyProjection[key] += Number(t.amount);
    }
  });

  const maxAmount = Math.max(...Object.values(monthlyProjection), 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden border-none p-8">
      <div className="mb-8">
        <h3 className="font-bold text-slate-900 dark:text-white">Visão de Futuro</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Comprometimento da renda (Próximos 12 meses)</p>
      </div>

      <div className="flex items-end justify-between h-48 gap-2">
        {Object.entries(monthlyProjection).map(([month, amount]) => {
          const height = (amount / maxAmount) * 100;
          return (
            <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full relative flex flex-col justify-end h-full">
                <div
                  className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-lg transition-all duration-500 relative"
                  style={{ height: `${height}%` }}
                >
                  {amount > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(amount)}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
