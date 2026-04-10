'use client'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTransaction, updateTransaction } from '@/app/actions/transactions';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const TransactionSchema = z.object({
  amount: z.coerce.number().positive("O valor deve ser positivo"),
  category_id: z.string().uuid("Selecione uma categoria"),
  description: z.string().min(1, "A descrição é obrigatória").max(255),
  date: z.string(),
  type: z.enum(['income', 'expense']),
  credit_card_id: z.string().uuid().optional().nullable(),
  installments: z.coerce.number().min(1).max(72).default(1),
  is_installment: z.boolean().default(false),
});

type TransactionFormValues = z.infer<typeof TransactionSchema>;

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface TransactionFormProps {
  categories: Category[];
  initialData?: any; // To simplify handling current schema
  onSuccess?: () => void;
}

export function TransactionForm({ categories, initialData, onSuccess }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionSchema) as any,
    defaultValues: initialData || {
      type: 'expense',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category_id: '',
      credit_card_id: null,
      installments: 1,
      is_installment: false
    },
  });

  const transactionType = watch('type');
  const isInstallment = watch('is_installment');

  useEffect(() => {
    async function fetchCards() {
      const supabase = createClient();
      const { data } = await supabase.from('credit_cards' as any).select('id, name').order('name');
      if (data) setCards(data);
    }
    fetchCards();
  }, []);

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
              onChange={(e) => {
                const val = e.target.value as 'income' | 'expense';
                setValue('type', val);
                if (val === 'income') {
                  setValue('credit_card_id', null);
                  setValue('is_installment', false);
                }
              }}
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
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className="font-bold text-base"
              />
            )}
          />
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
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Método de Pagamento</label>
          <div className="relative">
            <select
              {...register('credit_card_id')}
              className={cn(selectStyles, transactionType === 'income' && "opacity-50 cursor-not-allowed")}
              disabled={transactionType === 'income'}
            >
              <option value="">💰 Saldo em Conta</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  💳 {card.name}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {errors.credit_card_id && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.credit_card_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Data da Transação</label>
          <Input type="date" {...register('date')} className="font-medium" />
          {errors.date && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.date.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Descrição</label>
          <Input {...register('description')} placeholder="Ex: Jantar, Salário, etc." className="font-medium" />
          {errors.description && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.description.message}</p>}
        </div>
      </div>

      {transactionType === 'expense' && !initialData && (
        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="is_installment" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">Esta compra é parcelada?</label>
            <div className="relative inline-flex items-center cursor-pointer">
              <input
                id="is_installment"
                type="checkbox"
                {...register('is_installment')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary rounded-full" />
            </div>
          </div>

          {isInstallment && (
            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Número de Parcelas</label>
              <Input
                type="number"
                {...register('installments')}
                min={1}
                max={72}
                className="font-bold text-center"
              />
              <p className="text-[10px] text-slate-400 italic">O valor total de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(watch('amount'))} será dividido em {watch('installments')}x de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(watch('amount') / (Number(watch('installments')) || 1))}.</p>
            </div>
          )}
        </div>
      )}

      <Button type="submit" className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={loading}>
        {loading ? "Processando..." : (initialData ? "Atualizar Registro" : "Confirmar Lançamento")}
      </Button>
    </form>
  );
}
