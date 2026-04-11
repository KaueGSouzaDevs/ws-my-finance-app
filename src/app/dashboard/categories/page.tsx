import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/forms/category-form';
import { CategoryList } from '@/components/dashboard/category-list';
import { Tags, Plus } from 'lucide-react';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-[1.25rem] flex items-center justify-center text-indigo-600">
            <Tags size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Categorias</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Organize suas transações por tipo</p>
          </div>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border-none">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Plus size={18} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-black tracking-tight">Nova Categoria</h2>
        </div>
        <CategoryForm />
      </div>

      <CategoryList categories={categories || []} />
    </div>
  );
}
