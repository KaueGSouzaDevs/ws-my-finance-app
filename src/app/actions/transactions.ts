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
  installments: z.coerce.number().min(1).max(72).default(1),
  is_installment: z.boolean().default(false),
});

export async function createTransaction(formData: z.infer<typeof TransactionSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const transactionsToInsert = [];
  const parentId = crypto.randomUUID();

  if (formData.type === 'expense' && formData.is_installment && formData.installments > 1) {
    const installmentAmount = formData.amount / formData.installments;
    const baseDate = new Date(formData.date + 'T00:00:00');

    for (let i = 0; i < formData.installments; i++) {
      const installmentDate = new Date(baseDate);
      installmentDate.setMonth(installmentDate.getMonth() + i);

      transactionsToInsert.push({
        id: i === 0 ? parentId : crypto.randomUUID(),
        amount: installmentAmount,
        category_id: formData.category_id,
        description: `${formData.description} (${i + 1}/${formData.installments})`,
        date: installmentDate.toISOString().split('T')[0],
        type: formData.type,
        credit_card_id: formData.credit_card_id || null,
        user_id: user.id,
        parent_id: i === 0 ? null : parentId,
        installment_number: i + 1,
        total_installments: formData.installments
      });
    }
  } else {
    transactionsToInsert.push({
      amount: formData.amount,
      category_id: formData.category_id,
      description: formData.description,
      date: formData.date,
      type: formData.type,
      credit_card_id: formData.credit_card_id || null,
      user_id: user.id
    });
  }

  // @ts-ignore
  const { error } = await supabase
    .from('transactions' as any)
    .insert(transactionsToInsert as any);

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
