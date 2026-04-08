import { createClient } from '@/lib/supabase/server';
import { TransactionForm } from '@/components/forms/transaction-form';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default async function TransactionsPage() {
  const supabase = createClient();

  const [{ data: transactions }, { data: categories }] = await Promise.all([
    supabase
      .from('transactions')
      .select('*, categories(name, icon)')
      .order('date', { ascending: false }),
    supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
  ]);

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
      </header>

      <div className="bg-accent/30 p-6 rounded-2xl border">
        <h2 className="text-lg font-semibold mb-4">Add New Transaction</h2>
        <TransactionForm categories={categories || []} />
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.date}</TableCell>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>{(t.categories as any)?.name}</TableCell>
                <TableCell className={`text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
            {(!transactions || transactions.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
