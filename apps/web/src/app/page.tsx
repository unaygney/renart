'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { useQuery } from '@tanstack/react-query'

import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import {
  Carousel,
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
              <div className="mt-8"></div>
            </Carousel>
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
        </div>
      </div>
    </div>
  )
}
