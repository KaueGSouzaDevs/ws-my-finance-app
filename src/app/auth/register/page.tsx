'use client'

import { useState } from 'react';
import { signup } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Link from 'next/link';

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
    <div className="min-h-screen flex items-center justify-center bg-accent/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
          <CardDescription>
            Insira seus dados abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-100 text-red-800 text-sm font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="full_name">Nome Completo</label>
              <Input id="full_name" name="full_name" placeholder="João Silva" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">E-mail</label>
              <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Senha</label>
              <Input id="password" name="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
