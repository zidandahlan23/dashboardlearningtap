export function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl shadow-[0px_4px_24px_rgba(60,107,86,0.06)] overflow-hidden">
      {/* Header skeleton */}
      <div className="px-5 py-4 border-b border-[#E0E8E3]">
        <div className="h-9 w-[300px] bg-[#F0F4F1] rounded-lg animate-pulse" />
      </div>
      {/* Rows skeleton */}
      <div className="divide-y divide-[#E0E8E3]/50">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="px-5 py-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#F0F4F1] animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-[180px] bg-[#F0F4F1] rounded animate-pulse" />
              <div className="h-2.5 w-[120px] bg-[#F0F4F1] rounded animate-pulse" />
            </div>
            <div className="h-3.5 w-[100px] bg-[#F0F4F1] rounded animate-pulse" />
            <div className="h-3.5 w-[60px] bg-[#F0F4F1] rounded animate-pulse" />
            <div className="h-3.5 w-[80px] bg-[#F0F4F1] rounded animate-pulse" />
            <div className="h-6 w-[80px] bg-[#F0F4F1] rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonKPI() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 shadow-[0px_4px_24px_rgba(60,107,86,0.06)]">
          <div className="h-3 w-[80px] bg-[#F0F4F1] rounded animate-pulse mb-3" />
          <div className="h-7 w-[60px] bg-[#F0F4F1] rounded animate-pulse mb-2" />
          <div className="h-2.5 w-[100px] bg-[#F0F4F1] rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
