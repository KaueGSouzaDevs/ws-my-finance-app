import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl">
          Finance <span className="text-primary">Evolved.</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-[600px] mx-auto">
          Take control of your money with our premium, Apple-inspired finance tracker.
          Simple, secure, and blazingly fast.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" size="lg" className="rounded-full px-8">
          Learn More
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-4xl">
        <FeatureCard title="Secure" description="Your data is protected by Supabase's strict Row Level Security." />
        <FeatureCard title="Intuitive" description="A clean, minimalist interface that puts your finances first." />
        <FeatureCard title="Real-time" description="Instant updates and powerful insights at your fingertips." />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border bg-accent/30 text-left space-y-2">
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
