export default function Loading() {
  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto animate-pulse">
      <div className="h-8 bg-accent rounded w-1/3" />
      <div className="h-64 bg-accent/30 rounded-2xl border" />
      <div className="border rounded-xl h-96 bg-accent/10" />
    </div>
  );
}
