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
  const { error } = await supabase.from('categories').insert(formData);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/transactions');
}

export async function deleteCategory(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/transactions');
}
