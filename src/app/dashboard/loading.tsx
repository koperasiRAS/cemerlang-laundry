import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="h-8 bg-gray-200 rounded-md w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-96"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-40"></div>
      </div>

      {/* Cards Skeleton (6 cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/50 p-5 rounded-2xl shadow-sm border border-gray-100 h-28 flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 mt-3"></div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Skeleton */}
          <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-gray-300 animate-spin" />
          </div>
          {/* Table Skeleton */}
          <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-gray-100 h-[300px]">
             <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
             <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-100 rounded-lg w-full"></div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Queue Status Skeleton */}
          <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-gray-100 h-[320px]">
            <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-8"></div>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full w-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Services Skeleton */}
          <div className="bg-white/50 p-6 rounded-3xl shadow-sm border border-gray-100 h-[280px]">
            <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
            <div className="space-y-4">
               {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-6 bg-gray-200 rounded-md w-16"></div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
