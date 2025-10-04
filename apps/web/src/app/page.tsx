'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { Header } from '@/components/Header'
import LoadingProductsCard from '@/components/LoadingProductsCard'
import { ProductCarousel } from '@/components/ProductCarousel'

import { trpc } from '@/utils/trpc'

type ProductWithPrice = Product & { price: number }

function HomeContent() {
  const searchParams = useSearchParams()

  const searchParamsKey = searchParams.toString()

  const queryOptions = trpc.product.getAll.queryOptions()
  const { data: products = [], isLoading } = useQuery({
    ...queryOptions,
    queryKey: [...queryOptions.queryKey, searchParamsKey] as any,
  })

  if (isLoading) {
    return <LoadingProductsCard />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <Header />
        <ProductCarousel products={products as ProductWithPrice[]} />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingProductsCard />}>
      <HomeContent />
    </Suspense>
  )
}
