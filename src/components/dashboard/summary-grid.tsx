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
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <ArrowUpCircle className="text-green-500" size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-green-600">+{income.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <ArrowDownCircle className="text-red-500" size={16} />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold text-red-600">-{expense.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
