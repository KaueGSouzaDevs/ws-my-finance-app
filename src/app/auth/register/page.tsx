'use client'

import { useState } from 'react';
import { signup } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const full_name = formData.get('full_name') as string;

    const result = await signup({ email, password, full_name });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-blue-600" />

        <CardHeader className="space-y-4 pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
            <UserPlus size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Criar Conta</CardTitle>
            <CardDescription className="text-base font-medium text-slate-500 dark:text-slate-400">
              Junte-se a nós e comece a controlar sua vida financeira
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 px-8">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 text-sm font-bold border border-rose-500/20 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1" htmlFor="full_name">Nome Completo</label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Ex: João Silva"
                required
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1" htmlFor="email">E-mail</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="exemplo@email.com"
                required
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1" htmlFor="password">Senha</label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                className="font-medium"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pt-6 pb-10 px-8">
            <Button className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5 bg-indigo-600 hover:bg-indigo-700 border-none" type="submit" disabled={loading}>
              {loading ? "Processando..." : "Criar conta"}
            </Button>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400 font-bold">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500 transition-colors underline-offset-4 hover:underline">
                Entrar agora
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
