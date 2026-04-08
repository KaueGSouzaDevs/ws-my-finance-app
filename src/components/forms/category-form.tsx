'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCategory } from '@/app/actions/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

const CategorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  icon: z.string().min(1, "O ícone é obrigatório"),
  color: z.string().min(1, "A cor é obrigatória").regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;

export function CategoryForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: { name: '', icon: '💰', color: '#007AFF' },
  });

  const selectedColor = watch('color');

  async function onSubmit(values: CategoryFormValues) {
    setLoading(true);
    setMessage(null);
    try {
      await createCategory(values);
      reset();
      setMessage({ type: 'success', text: "Categoria criada com sucesso!" });
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || "Algo deu errado" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome</label>
          <Input {...register('name')} placeholder="Ex: Mercado, Lazer..." />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Ícone (Emoji)</label>
          <Input {...register('icon')} placeholder="🍔" />
          {errors.icon && <p className="text-xs text-red-500">{errors.icon.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cor (Hex)</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setValue('color', e.target.value)}
              className="w-12 h-10 p-1 rounded-md border cursor-pointer"
            />
            <Input
              {...register('color')}
              placeholder="#007AFF"
              className="font-mono"
            />
          </div>
          {errors.color && <p className="text-xs text-red-500">{errors.color.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Salvando..." : "Criar Categoria"}
      </Button>
    </form>
  );
}
