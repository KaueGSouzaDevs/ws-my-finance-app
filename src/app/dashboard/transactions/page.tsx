import { createClient } from '@/lib/supabase/server';
import { TransactionForm } from '@/components/forms/transaction-form';
import { deleteTransaction } from '@/app/actions/transactions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

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

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="font-medium">{t.description}</TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    style={{
                      backgroundColor: (t.categories as any)?.color + '20',
                      color: (t.categories as any)?.color,
                      border: `1px solid ${(t.categories as any)?.color}40`
                    }}
                  >
                    {(t.categories as any)?.icon} {(t.categories as any)?.name}
                  </span>
                </TableCell>
                <TableCell className={`text-right font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Transação</DialogTitle>
                      </DialogHeader>
                      <TransactionForm
                        categories={categories || []}
                        initialData={{
                          id: t.id,
                          amount: t.amount,
                          category_id: t.category_id,
                          description: t.description || '',
                          date: t.date,
                          type: t.type
                        }}
                      />
                    </DialogContent>
                  </Dialog>

                  <form action={async () => {
                    'use server'
                    await deleteTransaction(t.id);
                  }}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 size={16} />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {(!transactions || transactions.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
