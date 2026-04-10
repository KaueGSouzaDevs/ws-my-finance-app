'use client'

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Pencil,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CategoryForm } from '@/components/forms/category-form';
import { deleteCategory } from '@/app/actions/categories';

interface CategoryListProps {
  categories: any[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategory(id);
    }
  };

  return (
    <>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                          <MoreHorizontal size={20} className="text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 dark:border-slate-800 shadow-2xl">
                        <DropdownMenuItem
                          className="rounded-xl flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 focus:bg-primary/10 focus:text-primary cursor-pointer py-2.5"
                          onClick={() => setEditingCategory(c)}
                        >
                          <Pencil size={16} />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="rounded-xl flex items-center gap-2 font-bold text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950/30 focus:text-rose-600 cursor-pointer py-2.5"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 size={16} />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">Sistema</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[95vw] sm:max-w-lg">
          <div className="bg-primary h-2 w-full" />
          <div className="p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black tracking-tight">Editar Categoria</DialogTitle>
            </DialogHeader>
            <CategoryForm
              initialData={editingCategory ? {
                id: editingCategory.id,
                name: editingCategory.name,
                icon: editingCategory.icon,
                color: editingCategory.color
              } : undefined}
              onSuccess={() => setEditingCategory(null)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
