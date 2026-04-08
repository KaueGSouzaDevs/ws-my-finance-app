'use server'
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const TransactionSchema = z.object({
  amount: z.coerce.number().positive(),
  category_id: z.string().uuid(),
  description: z.string().min(1).max(255),
  date: z.string(),
  type: z.enum(['income', 'expense']),
});

export async function createTransaction(formData: z.infer<typeof TransactionSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('transactions')
    .insert({
      amount: formData.amount,
      category_id: formData.category_id,
      description: formData.description,
      date: formData.date,
      type: formData.type,
      user_id: user.id
    });

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { success: true };
}
