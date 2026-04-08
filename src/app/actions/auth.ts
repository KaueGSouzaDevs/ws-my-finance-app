'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: z.infer<typeof AuthSchema>) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: z.infer<typeof AuthSchema> & { full_name: string }) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Profiles are usually created via a Supabase trigger,
  // but we can ensure it here if the trigger isn't set up.
  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: formData.full_name,
      currency: 'USD'
    });
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}
