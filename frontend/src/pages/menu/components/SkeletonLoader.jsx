export default function SkeletonLoader({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <div className="h-48 skeleton" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 skeleton rounded" />
            <div className="h-4 w-full skeleton rounded" />
            <div className="h-4 w-1/2 skeleton rounded" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-20 skeleton rounded" />
              <div className="h-9 w-24 skeleton rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
