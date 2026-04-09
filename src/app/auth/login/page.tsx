'use client'

import { useState } from 'react';
import { login } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await login({ email, password });
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 backdrop-blur-xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <CardHeader className="space-y-4 pt-10 pb-6 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-2">
            <Wallet size={32} strokeWidth={2.5} />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Bem-vindo</CardTitle>
            <CardDescription className="text-base font-medium text-slate-500 dark:text-slate-400">
              Acesse sua conta para gerenciar suas finanças
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 text-sm font-bold border border-rose-500/20 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

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
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400" htmlFor="password">Senha</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">Esqueceu?</Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="font-medium"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-6 pt-6 pb-10 px-8">
            <Button className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center text-sm text-slate-500 dark:text-slate-400 font-bold">
              Não tem uma conta?{" "}
              <Link href="/auth/register" className="text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline">
                Crie agora
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
