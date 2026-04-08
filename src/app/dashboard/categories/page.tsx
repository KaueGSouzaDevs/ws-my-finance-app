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
import { Trash2 } from 'lucide-react';

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Categorias</h1>
      </header>

      <div className="bg-accent/30 p-6 rounded-2xl border">
        <h2 className="text-lg font-semibold mb-4">Adicionar Nova Categoria</h2>
        <CategoryForm />
      </div>

      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ícone</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Cor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="text-2xl">{c.icon}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: c.color }}
                    />
                    {c.color}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {!c.is_system && (
                    <form action={async () => {
                      'use server'
                      await deleteCategory(c.id);
                    }}>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                        <Trash2 size={18} />
                      </Button>
                    </form>
                  )}
                  {c.is_system && (
                    <span className="text-xs text-muted-foreground italic px-2">Sistema</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {(!categories || categories.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhuma categoria encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
