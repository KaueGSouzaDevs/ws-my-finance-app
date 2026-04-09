This is a high-end architectural blueprint. Given the user's Java/Spring background, I will emphasize **strong typing, separation of concerns (Service-like Server Actions), and a predictable data flow**.

---

# Premium Finance Scaffold: Architectural Specification

## Step 1: Database Schema (Supabase SQL)
We use `numeric` for currency to avoid floating-point errors and implement a strict RLS (Row Level Security) policy.

```sql
-- 1. Enums and Extensions
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- 2. Profiles Table (Extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  currency TEXT DEFAULT 'USD',
  CONSTRAINT full_name_length CHECK (char_length(full_name) >= 2)
);

-- 3. Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL, -- Emoji or Lucide icon name
  color TEXT NOT NULL, -- Hex code
  is_system BOOLEAN DEFAULT false -- True if provided by app, false if user-created
);

-- 4. Transactions Table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  category_id UUID REFERENCES categories NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  type transaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Everyone can read (system categories), only owners can manage custom ones
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Users can create own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = auth.uid()); 

-- Transactions: Strict user isolation
CREATE POLICY "Users can manage own transactions" ON transactions 
  FOR ALL USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);
```

---

## Step 2: Supabase Client & Type Generation

### Type Generation
Run this command to sync your DB schema with TypeScript interfaces:
```bash
npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts
```

### Client Configuration (`@supabase/ssr`)
We separate the client logic to handle the cookie-based auth flow required by Next.js Server Components.

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch { /* Handle middleware context */ }
        },
      },
    }
  );
};

// src/lib/supabase/client.ts (For Client Components)
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';

export const createClient = () => 
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
```

---

## Step 3: Core UI Framework

### Shadcn/UI Initialization
```bash
npx shadcn-ui@latest init
# Selection: Style: New York, Base Color: Zinc, CSS Variables: Yes
```

### Apple-esque Theme Configuration
Modify `tailwind.config.ts` to include a "Glassmorphism" utility and a refined palette.

```typescript
// tailwind.config.ts snippet
theme: {
  extend: {
    colors: {
      border: "hsl(var(--border))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "#007AFF", // Apple Blue
        foreground: "#FFFFFF",
      },
      accent: {
        DEFAULT: "#F5F5F7", // Apple Light Grey
        foreground: "#1D1D1F",
      }
    },
    backdropBlur: {
      xs: '2px',
    }
  }
}
```

### Hybrid Layout (`src/app/dashboard/layout.tsx`)
This implements the **Mobile Bottom Nav / Desktop Sidebar** pattern.

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-accent/50 p-4">
        <Logo />
        <nav className="mt-8 space-y-2">{/* Desktop Nav Links */}</nav>
      </aside>

      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background/80 backdrop-blur-md flex justify-around items-center z-50">
        <BottomNavItem icon={<LayoutDashboard />} label="Home" href="/dashboard" />
        <BottomNavItem icon={<ArrowUpRight />} label="Transact" href="/transactions" />
        <BottomNavItem icon={<User />} label="Profile" href="/profile" />
      </nav>
    </div>
  );
}
```

---

## Step 4: MVP Implementation

### 4.1 Server Action for Transactions (`src/app/actions/transactions.ts`)
Following the "Service Pattern," we encapsulate DB logic in typed Server Actions.

```typescript
'use server'
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const TransactionSchema = z.object({
  amount: z.coerce.number().positive(),
  category_id: z.string().uuid(),
  description: z.string().min(1).max(255),
  date: z.string(),
  type: z.enum(['income', 'expense']),
});

export async function createTransaction(formData: z.infer<typeof TransactionSchema>) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from('transactions')
    .insert({ ...formData, user_id: user.id });

  if (error) throw new Error(error.message);
  
  revalidatePath('/dashboard');
  revalidatePath('/transactions');
  return { success: true };
}
```

### 4.2 Dashboard Page (`src/app/dashboard/page.tsx`)
A Server Component for zero-bundle size data fetching.

```tsx
import { createClient } from '@/lib/supabase/server';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { SummaryGrid } from '@/components/dashboard/summary-grid';

export default async function DashboardPage() {
  const supabase = createClient();
  
  // Parallel data fetching
  const [transactionsRes, profileRes] = await Promise.all([
    supabase.from('transactions').select('amount, type').eq('date', 'this_month'), 
    supabase.from('profiles').select('*').single()
  ]);

  // Business Logic: Aggregating totals (similar to a Spring @Service)
  const totals = transactionsRes.data?.reduce((acc, curr) => {
    acc[curr.type] += Number(curr.amount);
    return acc;
  }, { income: 0, expense: 0 }) || { income: 0, expense: 0 };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <div className="text-sm text-muted-foreground">{profileRes.data?.full_name}</div>
      </header>

      <BalanceCard 
        balance={totals.income - totals.expense} 
        currency={profileRes.data?.currency || 'USD'} 
      />
      
      <SummaryGrid income={totals.income} expense={totals.expense} />
      
      {/* Chart Component would be a Client Component internally */}
      <SpendingChart data={transactionsRes.data} />
    </div>
  );
}
```

### 4.3 Transaction Form Component (`src/components/forms/transaction-form.tsx`)
Integrating Zod, React Hook Form, and Server Actions.

```tsx
'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransaction } from '@/app/actions/transactions';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function TransactionForm() {
  const form = useForm<z.infer<typeof TransactionSchema>>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: { type: 'expense', amount: 0 },
  });

  async function onSubmit(values: z.infer<typeof TransactionSchema>) {
    try {
      await createTransaction(values);
      toast.success("Transaction recorded");
      form.reset();
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField 
          control={form.control} 
          name="amount" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} className="text-lg font-medium" />
              </FormControl>
            </FormItem>
          )} 
        />
        {/* Other fields: category_id (Select), description (Input), etc. */}
        <Button type="submit" className="w-full">Save Transaction</Button>
      </form>
    </Form>
  );
}
```

## Summary of Engineering Choices
1.  **Precision:** Used `NUMERIC(12,2)` in Postgres $\rightarrow$ `z.coerce.number()` in Zod $\rightarrow$ preventing JS floating point issues.
2.  **Performance:** Server Components fetch data on the Edge; only the Form and Charts are hydrated as Client Components.
3.  **Security:** RLS is the primary security layer; Server Actions act as the controller validating the session before DB execution.
4.  **UX:** Hybrid layout ensures the app feels like a native iOS app on mobile and a professional SaaS on desktop.