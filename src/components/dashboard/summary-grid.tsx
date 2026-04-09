import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SummaryGridProps {
  income: number;
  expense: number;
}

export function SummaryGrid({ income, expense }: SummaryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden relative group hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Receitas</p>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-slate-900 overflow-hidden relative group hover:-translate-y-1 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-rose-500/10 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <TrendingDown size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Despesas</p>
              <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
