'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTransaction } from '@/app/actions/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const TransactionSchema = z.object({
  amount: z.coerce.number().positive(),
  category_id: z.string().uuid(),
  description: z.string().min(1).max(255),
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
}

export function TransactionForm({ categories }: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(TransactionSchema) as any,
    defaultValues: { type: 'expense', amount: 0, date: new Date().toISOString().split('T')[0] },
  });

  async function onSubmit(values: TransactionFormValues) {
    setLoading(true);
    setMessage(null);
    try {
      await createTransaction(values);
      reset();
      setMessage({ type: 'success', text: "Transaction recorded successfully!" });
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || "Something went wrong" });
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
          <label className="text-sm font-medium">Type</label>
          <select
            {...register('type')}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input type="number" step="0.01" {...register('amount')} placeholder="0.00" />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            {...register('category_id')}
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-xs text-red-500">{errors.category_id.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date</label>
          <Input type="date" {...register('date')} />
          {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input {...register('description')} placeholder="Dinner, Salary, etc." />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save Transaction"}
      </Button>
    </form>
  );
}
