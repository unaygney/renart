'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 flex flex-col items-center space-y-3 sm:space-y-4 w-full max-w-sm mx-auto">
      {/* Product Image Skeleton */}
      <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-200 rounded-lg animate-pulse" />

      {/* Product Title Skeleton */}
      <Skeleton className="h-5 w-32" />

      {/* Price Skeleton */}
      <Skeleton className="h-6 w-24" />

      {/* Color Options Skeleton */}
      <div className="flex flex-col items-center space-y-2 sm:space-y-3">
        <div className="flex space-x-2 sm:space-x-3">
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Rating Skeleton */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="flex space-x-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-4 h-4 rounded" />
          ))}
        </div>
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  )
}
