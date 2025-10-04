import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

import { FilterPopup } from './FilterPopup'
import { trpc } from '@/utils/trpc'

export function Header() {
  const searchParams = useSearchParams()
  const searchParamsKey = searchParams.toString()

  const queryOptions = trpc.product.getPriceRange.queryOptions()
  const { data: priceRange = { min: 0, max: 1000 } } = useQuery({
    ...queryOptions,
    queryKey: [...queryOptions.queryKey, searchParamsKey] as any,
    staleTime: 5000,
  })
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-2">
        <h1 className="text-[45px] font-light text-gray-900 font-avenir">
          Product List
        </h1>
      </div>
      <div className="flex justify-end mt-4">
        <FilterPopup minPrice={priceRange.min} maxPrice={priceRange.max} />
      </div>
    </div>
  )
}
