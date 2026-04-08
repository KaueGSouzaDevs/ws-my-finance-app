import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableRow
} from "@/components/ui/table";

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
      <div className="bg-accent/20 rounded-xl p-8 text-center text-muted-foreground border-2 border-dashed">
        Nenhuma transação recente encontrada.
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      <Table>
        <TableBody>
          {transactions.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="py-3">
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{t.description}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-3">
                <span
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                  style={{
                    backgroundColor: (t.categories as any)?.color + '20',
                    color: (t.categories as any)?.color,
                    border: `1px solid ${(t.categories as any)?.color}40`
                  }}
                >
                  {(t.categories as any)?.icon} {(t.categories as any)?.name}
                </span>
              </TableCell>
              <TableCell className={`text-right py-3 font-semibold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
