'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg  p-6 flex flex-col items-start space-y-2.5 w-full max-w-sm mx-auto">
      {/* Product Image Skeleton */}
      <div className="w-48 h-48 bg-gray-200 rounded-lg animate-pulse" />

      {/* Product Title Skeleton */}
      <Skeleton className="h-5 w-32" />

      {/* Price Skeleton */}
      <Skeleton className="h-6 w-24" />

      {/* Color Options Skeleton */}
      <div className="flex flex-col items-start space-y-2">
        <div className="flex space-x-3">
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-7 h-7 rounded-full" />
          <Skeleton className="w-7 h-7 rounded-full" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Rating Skeleton */}
      <div className="flex items-center space-x-2">
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
