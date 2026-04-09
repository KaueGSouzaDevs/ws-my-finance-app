'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTransaction, updateTransaction } from '@/app/actions/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const TransactionSchema = z.object({
  amount: z.coerce.number().positive("O valor deve ser positivo"),
  category_id: z.string().uuid("Selecione uma categoria"),
  description: z.string().min(1, "A descrição é obrigatória").max(255),
  date: z.string(),
  type: z.enum(['income', 'expense']),
});

type TransactionFormValues = {
  amount: number;
  category_id: string;
  description: string;
  date: string;
  type: 'income' | 'expense';
};

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface TransactionFormProps {
  categories: Category[];
  initialData?: TransactionFormValues & { id: string };
  onSuccess?: () => void;
}

export function TransactionForm({ categories, initialData, onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionSchema) as any,
    defaultValues: initialData || {
      type: 'expense',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category_id: ''
    },
  });

  async function onSubmit(values: TransactionFormValues) {
    setLoading(true);
    setMessage(null);
    try {
      if (initialData) {
        await updateTransaction(initialData.id, values);
        setMessage({ type: 'success', text: "Transação atualizada com sucesso!" });
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      } else {
        await createTransaction(values);
        reset();
        setMessage({ type: 'success', text: "Transação registrada com sucesso!" });
        if (onSuccess) onSuccess();
      }
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || "Algo deu errado" });
    } finally {
      setLoading(false);
    }
  }

  const selectStyles = "flex h-11 w-full rounded-2xl border border-input bg-background/50 dark:bg-slate-900/50 px-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary appearance-none cursor-pointer";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div className={cn(
          "p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2",
          message.type === 'success' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
        )}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Tipo de Fluxo</label>
          <div className="relative">
            <select
              {...register('type')}
              className={selectStyles}
            >
              <option value="expense">📉 Despesa</option>
              <option value="income">📈 Receita</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {errors.type && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Valor (R$)</label>
          <Input type="number" step="0.01" {...register('amount')} placeholder="0,00" className="font-bold text-base" />
          {errors.amount && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Categoria</label>
          <div className="relative">
            <select
              {...register('category_id')}
              className={selectStyles}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {errors.category_id && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.category_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Data da Transação</label>
          <Input type="date" {...register('date')} className="font-medium" />
          {errors.date && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Descrição</label>
        <Input {...register('description')} placeholder="Ex: Jantar, Salário, etc." className="font-medium" />
        {errors.description && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.description.message}</p>}
      </div>

      <Button type="submit" className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={loading}>
        {loading ? "Processando..." : (initialData ? "Atualizar Registro" : "Confirmar Lançamento")}
      </Button>
    </form>
  );
}
