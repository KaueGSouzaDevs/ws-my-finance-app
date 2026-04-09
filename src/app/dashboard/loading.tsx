export default function Loading() {
  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto animate-pulse">
      <div className="h-8 bg-accent rounded w-1/4" />
      <div className="h-32 bg-accent rounded w-full" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-accent rounded" />
        <div className="h-24 bg-accent rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-10 bg-accent rounded w-full" />
        <div className="h-10 bg-accent rounded w-full" />
        <div className="h-10 bg-accent rounded w-full" />
      </div>
    </div>
  );
}
