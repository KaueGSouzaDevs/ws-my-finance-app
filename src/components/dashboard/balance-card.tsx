import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
  currency: string;
}

export function BalanceCard({ balance, currency }: BalanceCardProps) {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader>
        <CardTitle className="text-sm font-medium opacity-80">Total Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(balance)}
        </div>
      </CardContent>
    </Card>
  );
}
