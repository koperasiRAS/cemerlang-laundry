import { Loader2 } from "lucide-react"

export default function ReportsLoading() {
  return (
    <div className="max-w-5xl mx-auto p-8 animate-pulse">
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded-md w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-md w-96"></div>
      </div>

      {/* Filter Skeleton */}
      <div className="bg-white p-4 rounded-xl shadow-sm border mb-8 flex gap-4">
         <div className="h-10 bg-gray-200 rounded-md w-40"></div>
         <div className="h-10 bg-gray-200 rounded-md w-40"></div>
         <div className="h-10 bg-gray-200 rounded-md w-24"></div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>

      {/* Breakdown Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border h-[300px]">
             <div className="h-6 bg-gray-200 rounded w-48 mb-6 border-b pb-2"></div>
             <div className="space-y-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center border-b pb-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
