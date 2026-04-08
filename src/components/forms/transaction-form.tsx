'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTransaction, updateTransaction } from '@/app/actions/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

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
      } else {
        await createTransaction(values);
        reset();
        setMessage({ type: 'success', text: "Transação registrada com sucesso!" });
      }
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || "Algo deu errado" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo</label>
          <select
            {...register('type')}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="expense">Despesa</option>
            <option value="income">Receita</option>
          </select>
          {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Valor</label>
          <Input type="number" step="0.01" {...register('amount')} placeholder="0,00" />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Categoria</label>
          <select
            {...register('category_id')}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Data</label>
          <Input type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Descrição</label>
        <Input {...register('description')} placeholder="Ex: Jantar, Salário, etc." />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : (initialData ? "Atualizar Transação" : "Salvar Transação")}
      </Button>
    </form>
  );
}
