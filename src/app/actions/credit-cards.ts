'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreditCardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  limit_amount: z.coerce.number().positive("Limite deve ser positivo"),
  closing_day: z.coerce.number().min(1).max(31, "Dia inválido"),
  due_day: z.coerce.number().min(1).max(31, "Dia inválido"),
});

export async function createCreditCard(formData: z.infer<typeof CreditCardSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");

  // @ts-ignore
  const { error } = await supabase.from('credit_cards' as any).insert({
    ...formData,
    user_id: user.id,
  } as any);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/credit-cards');
}

export async function deleteCreditCard(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");

  const { error } = await supabase
    .from('credit_cards' as any)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw new Error(error.message);

  revalidatePath('/dashboard/credit-cards');
}
