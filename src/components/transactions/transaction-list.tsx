'use client'

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2, Pencil, Calendar, MoreHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { TransactionForm } from '@/components/forms/transaction-form';
import { deleteTransaction } from '@/app/actions/transactions';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TransactionListProps {
  transactions: any[];
  categories: any[];
}

export function TransactionList({ transactions, categories }: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden border-none p-2">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                <TableHead className="pl-6 font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">Detalhes</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest hidden md:table-cell">Categoria</TableHead>
                <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest text-right">Valor</TableHead>
                <TableHead className="pr-6 font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((t) => (
                <TableRow key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 transition-colors group">
                  <TableCell className="py-5 pl-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: (t.categories as any)?.color + '15',
                          color: (t.categories as any)?.color,
                        }}
                      >
                        {(t.categories as any)?.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{t.description}</span>
                        <div className="flex items-center mt-1 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                          <Calendar size={10} className="mr-1" />
                          {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                      style={{
                        backgroundColor: (t.categories as any)?.color + '15',
                        color: (t.categories as any)?.color,
                      }}
                    >
                      {(t.categories as any)?.name}
                    </span>
                  </TableCell>
                  <TableCell className={`text-right font-black text-base ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {t.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreHorizontal size={18} className="text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 dark:border-slate-800 shadow-2xl">
                        <DropdownMenuItem
                          className="rounded-xl flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 focus:bg-primary/10 focus:text-primary cursor-pointer py-2.5"
                          onClick={() => {
                            setEditingId(t.id);
                            setEditingData(t);
                          }}
                        >
                          <Pencil size={16} />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl flex items-center gap-2 font-bold text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-600 cursor-pointer py-2.5"
                          onClick={() => handleDelete(t.id)}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {(!transactions || transactions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-slate-400 font-medium italic">
                    Nenhuma transação encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[95vw] sm:max-w-lg">
          <div className="bg-primary h-2 w-full" />
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black tracking-tight">Editar Transação</DialogTitle>
            </DialogHeader>
            <TransactionForm
              categories={categories}
              initialData={editingData ? {
                id: editingData.id,
                amount: editingData.amount,
                category_id: editingData.category_id,
                description: editingData.description || '',
                date: editingData.date,
                type: editingData.type
              } : undefined}
              onSuccess={() => setEditingId(null)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
