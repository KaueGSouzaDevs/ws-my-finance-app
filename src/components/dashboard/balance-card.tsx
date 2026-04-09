import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative group">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none group-hover:bg-white/20 transition-all duration-700" />
      <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

      <CardContent className="pt-10 pb-12 px-10 relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
            <Wallet size={24} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase">Saldo Total</div>
        </div>

        <div className="space-y-1">
          <div className="text-sm font-semibold text-white/60 ml-1">Balanço Geral</div>
          <div className="text-5xl font-black text-white tracking-tight drop-shadow-md">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
