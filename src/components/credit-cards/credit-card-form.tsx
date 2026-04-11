'use client'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCreditCard, updateCreditCard } from '@/app/actions/credit-cards';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const CreditCardSchema = z.object({
  name: z.string().min(1, "O nome do cartão é obrigatório"),
  limit_amount: z.coerce.number().positive("O limite deve ser positivo"),
  closing_day: z.coerce.number().min(0).max(31, "Dia inválido"),
  due_day: z.coerce.number().min(0).max(31, "Dia inválido"),
});

type CreditCardFormValues = z.infer<typeof CreditCardSchema>;

interface CreditCardFormProps {
  initialData?: CreditCardFormValues & { id: string };
  onSuccess?: () => void;
}

export function CreditCardForm({ initialData, onSuccess }: CreditCardFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreditCardFormValues>({
    resolver: zodResolver(CreditCardSchema),
    defaultValues: initialData || { name: '', limit_amount: 0, closing_day: 1, due_day: 10 },
  });

  async function onSubmit(values: CreditCardFormValues) {
    setLoading(true);
    setMessage(null);
    try {
      if (initialData?.id) {
        await updateCreditCard(initialData.id, values);
        setMessage({ type: 'success', text: "Cartão atualizado com sucesso!" });
      } else {
        await createCreditCard(values);
        reset();
        setMessage({ type: 'success', text: "Cartão registrado com sucesso!" });
      }
      if (onSuccess) onSuccess();
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
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nome do Cartão</label>
          <Input {...register('name')} placeholder="Ex: Nubank, Inter..." className="font-medium" />
          {errors.name && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Limite Total (R$)</label>
          <Controller
            name="limit_amount"
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
          {errors.limit_amount && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.limit_amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Dia de Fechamento</label>
          <div className="relative">
            <select
              {...register('closing_day')}
              className={selectStyles}
            >
              {[...Array(31)].map((_, i) => (
                <option key={i+1} value={i+1}>Dia {i+1}</option>
              ))}
              <option value="0">Último dia do mês</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {errors.closing_day && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.closing_day.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Dia de Vencimento</label>
          <div className="relative">
            <select
              {...register('due_day')}
              className={selectStyles}
            >
              {[...Array(31)].map((_, i) => (
                <option key={i+1} value={i+1}>Dia {i+1}</option>
              ))}
              <option value="0">Último dia do mês</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
          {errors.due_day && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.due_day.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={loading}>
        {loading ? "Processando..." : initialData?.id ? "Salvar Alterações" : "Registrar Cartão"}
      </Button>
    </form>
  );
}
