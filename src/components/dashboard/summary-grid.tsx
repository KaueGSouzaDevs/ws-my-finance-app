import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface SummaryGridProps {
  income: number;
  expense: number;
}

export function SummaryGrid({ income, expense }: SummaryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Receitas</CardTitle>
          <ArrowUpCircle className="text-green-500" size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-green-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <ArrowDownCircle className="text-red-500" size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-red-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expense)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
