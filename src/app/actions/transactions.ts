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
      date: formData.date, // formData.date is 'YYYY-MM-DD'
      type: formData.type,
      user_id: user.id
    });

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}

export async function updateTransaction(id: string, formData: z.infer<typeof TransactionSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('transactions')
    .update({
      amount: formData.amount,
      category_id: formData.category_id,
      description: formData.description,
      date: formData.date,
      type: formData.type,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}

export async function deleteTransaction(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}
