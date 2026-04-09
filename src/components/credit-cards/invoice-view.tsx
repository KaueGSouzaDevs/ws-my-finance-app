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
import { ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react';

interface InvoiceViewProps {
  card: any;
  transactions: any[];
}

export function InvoiceView({ card, transactions }: InvoiceViewProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const changeMonth = (offset: number) => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + offset);
    setViewDate(next);
  };

  const filteredTransactions = transactions.filter(t => {
    const purchaseDate = new Date(t.date + 'T00:00:00');
    const purchaseDay = purchaseDate.getDate();

    const billingDate = new Date(purchaseDate);
    if (purchaseDay > card.closing_day) {
      billingDate.setMonth(billingDate.getMonth() + 1);
    }

    return billingDate.getMonth() === viewDate.getMonth() &&
           billingDate.getFullYear() === viewDate.getFullYear();
  });

  const total = filteredTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden border-none flex flex-col h-full">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ReceiptText size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Fatura de {viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cartão: {card.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => changeMonth(-1)} className="rounded-xl h-9 w-9">
            <ChevronLeft size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => changeMonth(1)} className="rounded-xl h-9 w-9">
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-[300px]">
        <Table>
          <TableBody>
            {filteredTransactions.map((t) => (
              <TableRow key={t.id} className="border-none hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <TableCell className="pl-8 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{t.description}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(t.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8 font-black text-rose-500">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                </TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-20 text-slate-400 font-medium italic">
                  Nenhum lançamento nesta fatura.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-8 bg-slate-50 dark:bg-slate-800/50 mt-auto">
        <div className="flex justify-between items-center">
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total da Fatura</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
