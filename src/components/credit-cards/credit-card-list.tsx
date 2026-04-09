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
import { Trash2, CreditCard, Calendar, ReceiptText, X } from 'lucide-react';
import { deleteCreditCard } from '@/app/actions/credit-cards';
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import { InvoiceView } from './invoice-view';

interface CreditCardListProps {
  cards: any[];
  invoiceBalances: Record<string, number>;
  transactions: any[];
}

export function CreditCardList({ cards, invoiceBalances, transactions }: CreditCardListProps) {
  const [viewingInvoiceCardId, setViewingInvoiceCardId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cartão? Todas as transações vinculadas serão afetadas.')) {
      await deleteCreditCard(id);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden border-none p-2">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
              <TableHead className="pl-8 font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">Cartão</TableHead>
              <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest text-center">Fatura Atual</TableHead>
              <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest text-center hidden md:table-cell">Datas</TableHead>
              <TableHead className="pr-8 font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards?.map((card) => {
              const spent = invoiceBalances[card.id] || 0;
              const percentage = Math.min((spent / card.limit_amount) * 100, 100);

              return (
                <TableRow key={card.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 transition-colors group">
                  <TableCell className="py-6 pl-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform">
                        <CreditCard size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-base">{card.name}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Limite: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.limit_amount)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[200px]">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-rose-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(spent)}</span>
                        <span className="text-slate-400">{Math.round(percentage)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${percentage > 90 ? 'bg-rose-500' : percentage > 70 ? 'bg-orange-500' : 'bg-primary'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        <Calendar size={12} className="mr-1 text-slate-400" />
                        Fecha: dia {card.closing_day}
                      </div>
                      <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                        <Calendar size={12} className="mr-1 text-slate-400" />
                        Vence: dia {card.due_day}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-1">
                      <Dialog open={viewingInvoiceCardId === card.id} onOpenChange={(open) => !open && setViewingInvoiceCardId(null)}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl text-primary hover:bg-primary/10 transition-all"
                            onClick={() => setViewingInvoiceCardId(card.id)}
                          >
                            <ReceiptText size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[3rem] border-none shadow-2xl p-0 overflow-hidden max-w-[95vw] sm:max-w-2xl h-[80vh]">
                          <InvoiceView
                            card={card}
                            transactions={transactions.filter(t => t.credit_card_id === card.id)}
                          />
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all"
                        onClick={() => handleDelete(card.id)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {(!cards || cards.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-16 text-slate-400 font-medium italic">
                  Nenhum cartão cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
