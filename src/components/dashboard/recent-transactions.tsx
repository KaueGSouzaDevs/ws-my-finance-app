import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export async function RecentTransactions() {
  const supabase = createClient();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name, icon, color)')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-slate-100/50 dark:bg-slate-900/50 rounded-[2rem] p-12 text-center text-muted-foreground border-2 border-dashed border-slate-200 dark:border-slate-800">
        Nenhuma transação recente encontrada.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden border-none p-2">
      <div className="px-6 pt-6 pb-2 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white">Últimas Atividades</h3>
        <Link href="/dashboard/transactions" className="text-xs font-bold text-primary flex items-center hover:translate-x-1 transition-transform">
          Ver todas <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
      <Table>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-none transition-colors group">
              <TableCell className="py-4 pl-6">
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform"
                    style={{
                      backgroundColor: (t.categories as any)?.color + '15',
                      color: (t.categories as any)?.color,
                    }}
                  >
                    {(t.categories as any)?.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{t.description}</span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                      {(t.categories as any)?.name} • {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className={`text-right py-4 pr-8 font-black text-base ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                {t.type === 'income' ? '+' : '-'}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
