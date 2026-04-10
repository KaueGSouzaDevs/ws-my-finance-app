-- Engine de Parcelamento e Melhorias em Cartões
-- Execute este script no SQL Editor do Supabase

-- 1. Atualizar transações para suportar parcelamento
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'transactions' AND COLUMN_NAME = 'parent_id') THEN
        ALTER TABLE transactions ADD COLUMN parent_id UUID REFERENCES transactions ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'transactions' AND COLUMN_NAME = 'installment_number') THEN
        ALTER TABLE transactions ADD COLUMN installment_number INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'transactions' AND COLUMN_NAME = 'total_installments') THEN
        ALTER TABLE transactions ADD COLUMN total_installments INTEGER;
    END IF;
END $$;

-- 2. Atualizar restrições de dia de fechamento/vencimento (0 representará o último dia do mês)
ALTER TABLE credit_cards DROP CONSTRAINT IF EXISTS credit_cards_closing_day_check;
ALTER TABLE credit_cards ADD CONSTRAINT credit_cards_closing_day_check CHECK (closing_day >= 0 AND closing_day <= 31);

ALTER TABLE credit_cards DROP CONSTRAINT IF EXISTS credit_cards_due_day_check;
ALTER TABLE credit_cards ADD CONSTRAINT credit_cards_due_day_check CHECK (due_day >= 0 AND due_day <= 31);
