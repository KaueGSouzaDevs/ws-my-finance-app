import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/forms/category-form';
import { deleteCategory } from '@/app/actions/categories';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2, Tags, Plus } from 'lucide-react';

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

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl overflow-hidden border-none p-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
              <TableHead className="pl-8 font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest">Ícone & Nome</TableHead>
              <TableHead className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest hidden sm:table-cell text-center">Cor</TableHead>
              <TableHead className="pr-8 font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((c) => (
              <TableRow key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-100 dark:border-slate-800 transition-colors group">
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: c.color + '15',
                        color: c.color,
                      }}
                    >
                      {c.icon}
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-base">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="font-mono text-xs font-bold text-slate-500 tracking-tighter uppercase">{c.color}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  {!c.is_system ? (
                    <form action={async () => {
                      'use server'
                      await deleteCategory(c.id);
                    }}>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
                        <Trash2 size={18} />
                      </Button>
                    </form>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">Sistema</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
