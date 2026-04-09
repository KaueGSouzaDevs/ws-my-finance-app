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
  credit_card_id: z.string().uuid().optional().nullable(),
});

export async function createTransaction(formData: z.infer<typeof TransactionSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // @ts-ignore
  const { error } = await supabase
    .from('transactions' as any)
    .insert({
      amount: formData.amount,
      category_id: formData.category_id,
      description: formData.description,
      date: formData.date,
      type: formData.type,
      credit_card_id: formData.credit_card_id || null,
      user_id: user.id
    } as any);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}

export async function updateTransaction(id: string, formData: z.infer<typeof TransactionSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // @ts-ignore
  const { error } = await supabase
    .from('transactions' as any)
    .update({
      amount: formData.amount,
      category_id: formData.category_id,
      description: formData.description,
      date: formData.date,
      type: formData.type,
      credit_card_id: formData.credit_card_id || null,
    } as any)
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
    .from('transactions' as any)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard', 'layout');
  return { success: true };
}
