'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState('');

    React.useEffect(() => {
      if (value === 0 && !displayValue) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrency(value));
      }
    }, [value]);

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(val);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, '');
      const numericValue = Number(rawValue) / 100;
      onChange(numericValue);
      setDisplayValue(formatCurrency(numericValue));
    };

    return (
      <div className="relative">
        <input
          type="text"
          className={cn(
            "flex h-11 w-full rounded-2xl border border-input bg-background/50 px-4 py-2 text-base shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-slate-900/50 font-bold",
            className
          )}
          value={displayValue}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"
