'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { useState } from 'react'

import { CustomScrollbar } from '@/components/CustomScrollbar'
import { ProductCard } from '@/components/ProductCard'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type ProductWithPrice = Product & { price: number }

interface ProductCarouselProps {
  products: ProductWithPrice[]
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: false,
          dragFree: true,
          containScroll: 'trimSnaps',
          skipSnaps: false,
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
              <ProductCard product={product} />
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
  )
}
