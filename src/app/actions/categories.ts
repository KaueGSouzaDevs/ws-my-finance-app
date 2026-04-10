'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CategorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  icon: z.string().min(1, "O ícone é obrigatório"),
  color: z.string().min(1, "A cor é obrigatória"),
});

export async function createCategory(formData: z.infer<typeof CategorySchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");

  const { error } = await supabase.from('categories').insert({
    ...formData,
    user_id: user.id,
    is_system: false
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/transactions');
}

export async function updateCategory(id: string, formData: z.infer<typeof CategorySchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");

  const { error } = await supabase
    .from('categories')
    .update(formData)
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/transactions');
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autorizado");

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/transactions');
}
