'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCategory, updateCategory } from '@/app/actions/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const CategorySchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  icon: z.string().min(1, "O ícone é obrigatório"),
  color: z.string().min(1, "A cor é obrigatória").regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
});

type CategoryFormValues = z.infer<typeof CategorySchema>;

interface CategoryFormProps {
  initialData?: CategoryFormValues & { id: string };
  onSuccess?: () => void;
}

export function CategoryForm({ initialData, onSuccess }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<CategoryFormValues>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || { name: '', icon: '💰', color: '#007AFF' },
  });

  const selectedColor = watch('color');

  async function onSubmit(values: CategoryFormValues) {
    setLoading(true);
    setMessage(null);
    try {
      if (initialData?.id) {
        await updateCategory(initialData.id, values);
        setMessage({ type: 'success', text: "Categoria atualizada com sucesso!" });
      } else {
        await createCategory(values);
        reset();
        setMessage({ type: 'success', text: "Categoria criada com sucesso!" });
      }
      if (onSuccess) onSuccess();
    } catch (e: any) {
      setMessage({ type: 'error', text: e.message || "Algo deu errado" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {message && (
        <div className={cn(
          "p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2",
          message.type === 'success' ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
        )}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nome da Categoria</label>
          <Input {...register('name')} placeholder="Ex: Mercado, Lazer..." className="font-medium" />
          {errors.name && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ícone (Emoji)</label>
          <Input {...register('icon')} placeholder="🍔" className="text-center text-xl" />
          {errors.icon && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.icon.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Cor de Identificação</label>
          <div className="flex gap-3">
            <div className="relative group">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setValue('color', e.target.value)}
                className="w-11 h-11 p-0 rounded-2xl border-none cursor-pointer bg-transparent overflow-hidden"
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-white/20 shadow-inner"
                style={{ backgroundColor: selectedColor }}
              />
            </div>
            <Input
              {...register('color')}
              placeholder="#007AFF"
              className="font-mono text-center uppercase tracking-tighter"
            />
          </div>
          {errors.color && <p className="text-[10px] font-bold text-rose-500 px-1">{errors.color.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full h-12 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5" disabled={loading}>
        {loading ? "Processando..." : initialData?.id ? "Salvar Alterações" : "Registrar Categoria"}
      </Button>
    </form>
  );
}
