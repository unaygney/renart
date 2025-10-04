'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { CustomScrollbar } from '@/components/CustomScrollbar'
import LoadingProductsCard from '@/components/LoadingProductsCard'
import { ProductCard } from '@/components/ProductCard'
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

  if (isLoading) {
    return <LoadingProductsCard />
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[45px] font-light text-gray-900 mb-2 font-avenir">
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
              // Mobile-friendly options
              watchDrag: true,
              watchResize: true,
              watchSlides: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-1 sm:pl-2 md:pl-4 basis-[85%] xs:basis-[75%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCard product={product as ProductWithPrice} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Mobile-friendly navigation buttons */}
            <CarouselPrevious className="flex sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200" />
            <CarouselNext className="flex sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200" />
            {/* Desktop navigation buttons */}
            <CarouselPrevious className="hidden sm:flex -left-12" />
            <CarouselNext className="hidden sm:flex -right-12" />
          </Carousel>
          {/* Custom Scrollbar */}
          <CustomScrollbar api={api} />
        </div>
      </div>
    </div>
  )
}
