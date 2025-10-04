import { CustomScrollbar } from '@/components/CustomScrollbar'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'

const LoadingProductsCard = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2 font-avenir">
            Product List
          </h1>
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
              // Mobile-friendly options
              watchDrag: true,
              watchResize: true,
              watchSlides: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 sm:pl-2 md:pl-4 basis-[85%] xs:basis-[75%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <ProductCardSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {/* Custom Scrollbar */}
          <CustomScrollbar api={undefined} />
        </div>
      </div>
    </div>
  )
}

export default LoadingProductsCard
