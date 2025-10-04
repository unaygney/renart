'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

import { trpc } from '@/utils/trpc'

type ProductWithPrice = Product & { price: number }

export default function Home() {
  const { data: products = [], isLoading } = useQuery(
    trpc.product.getAll.queryOptions()
  )
  const [api, setApi] = useState<CarouselApi>()
  const [scrollProgress, setScrollProgress] = useState(0)

  const onScroll = useCallback((api: CarouselApi) => {
    if (!api) return

    const progress = Math.max(0, Math.min(1, api.scrollProgress()))
    setScrollProgress(progress * 100)
  }, [])

  useEffect(() => {
    if (!api) return

    onScroll(api)
    api.on('scroll', () => onScroll(api))
    api.on('reInit', () => onScroll(api))

    return () => {
      api?.off('scroll', () => onScroll(api))
    }
  }, [api, onScroll])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light text-gray-900 mb-2 font-avenir">
              Product List
            </h1>
            <div className="flex items-center justify-center">
              <div className="h-px bg-gray-300 flex-1 max-w-md"></div>
              <span className="text-sm text-gray-500 mx-4 font-avenir">
                Avenir - Book - 45
              </span>
              <div className="h-px bg-gray-300 flex-1 max-w-md"></div>
            </div>
          </div>

          {/* Skeleton Carousel */}
          <div className="relative">
            <Carousel
              opts={{
                align: 'start',
                loop: false,
                dragFree: true,
                containScroll: 'trimSnaps',
                skipSnaps: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ProductCardSkeleton />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* Custom Scrollbar */}
            <div className="mt-8 px-2 md:px-4">
              <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gray-400 rounded-full transition-all duration-200 ease-out"
                  style={{ width: '25%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No products available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2 font-avenir">
            Product List
          </h1>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: 'start',
              loop: false,
              dragFree: true,
              containScroll: 'trimSnaps',
              skipSnaps: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {products.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard product={product as ProductWithPrice} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-12" />
            <CarouselNext className="hidden sm:flex -right-12" />
          </Carousel>
          {/* Custom Scrollbar */}
          <div className="mt-8 px-2 md:px-4">
            <div className="relative h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-gray-400 rounded-full transition-all duration-200 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
