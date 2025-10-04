'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { useEffect, useState } from 'react'

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
  const [canScroll, setCanScroll] = useState(false)

  useEffect(() => {
    if (!api) return

    const checkScrollability = () => {
      // Check if carousel can scroll by checking if scrollProgress can change
      const scrollSnaps = api.scrollSnapList()
      const canScrollForward = api.canScrollNext()
      const canScrollBackward = api.canScrollPrev()

      // If there's only one snap point or carousel can't scroll in any direction, hide scrollbar
      setCanScroll(
        scrollSnaps.length > 1 || canScrollForward || canScrollBackward
      )
    }

    // Initial check with a slight delay to ensure carousel is fully initialized
    const timeoutId = setTimeout(checkScrollability, 100)

    // Listen for various events to update scrollability
    api.on('reInit', checkScrollability)
    api.on('resize', checkScrollability)
    api.on('select', checkScrollability)

    return () => {
      clearTimeout(timeoutId)
      api.off('reInit', checkScrollability)
      api.off('resize', checkScrollability)
      api.off('select', checkScrollability)
    }
  }, [api])

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
        {/* Mobile-friendly navigation buttons - only show when carousel can scroll */}
        {canScroll && (
          <>
            <CarouselPrevious className="flex sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200" />
            <CarouselNext className="flex sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200" />
          </>
        )}
        {/* Desktop navigation buttons - only show when carousel can scroll */}
        {canScroll && (
          <>
            <CarouselPrevious className="hidden sm:flex -left-12" />
            <CarouselNext className="hidden sm:flex -right-12" />
          </>
        )}
      </Carousel>
      {/* Custom Scrollbar - only show when carousel can scroll */}
      {canScroll && <CustomScrollbar api={api} />}
    </div>
  )
}
