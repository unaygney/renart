'use client'

import { Filter, X } from 'lucide-react'
import { parseAsFloat, useQueryStates } from 'nuqs'
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'

interface FilterPopupProps {
  minPrice?: number
  maxPrice?: number
}

const POPULARITY_MIN = 0
const POPULARITY_MAX = 5

export function FilterPopup({
  minPrice = 0,
  maxPrice = 1000,
}: FilterPopupProps) {
  const [open, setOpen] = useState(false)

  const [filters, setFilters] = useQueryStates(
    {
      priceMin: parseAsFloat,
      priceMax: parseAsFloat,
      popularityMin: parseAsFloat,
      popularityMax: parseAsFloat,
    },
    {
      history: 'push',
      shallow: false,
    }
  )

  const convertScoreToRating = (score: number) => score * 2

  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.priceMin ?? minPrice,
    filters.priceMax ?? maxPrice,
  ])

  const [popularityRange, setPopularityRange] = useState<[number, number]>([
    filters.popularityMin !== null
      ? convertScoreToRating(filters.popularityMin)
      : POPULARITY_MIN,
    filters.popularityMax !== null
      ? convertScoreToRating(filters.popularityMax)
      : POPULARITY_MAX,
  ])

  const prevFiltersRef = useRef(filters)
  const prevMinPriceRef = useRef(minPrice)
  const prevMaxPriceRef = useRef(maxPrice)

  useEffect(() => {
    const hasChanged =
      prevFiltersRef.current.priceMin !== filters.priceMin ||
      prevFiltersRef.current.priceMax !== filters.priceMax ||
      prevFiltersRef.current.popularityMin !== filters.popularityMin ||
      prevFiltersRef.current.popularityMax !== filters.popularityMax

    if (hasChanged) {
      setPriceRange([
        filters.priceMin ?? minPrice,
        filters.priceMax ?? maxPrice,
      ])
      setPopularityRange([
        filters.popularityMin !== null
          ? convertScoreToRating(filters.popularityMin)
          : POPULARITY_MIN,
        filters.popularityMax !== null
          ? convertScoreToRating(filters.popularityMax)
          : POPULARITY_MAX,
      ])
      prevFiltersRef.current = filters
    }
  }, [filters, minPrice, maxPrice])

  useEffect(() => {
    if (
      prevMinPriceRef.current !== minPrice ||
      prevMaxPriceRef.current !== maxPrice
    ) {
      if (filters.priceMin === null && filters.priceMax === null) {
        setPriceRange([minPrice, maxPrice])
      }
      prevMinPriceRef.current = minPrice
      prevMaxPriceRef.current = maxPrice
    }
  }, [minPrice, maxPrice, filters.priceMin, filters.priceMax])

  const handleApplyFilters = () => {
    const convertRatingToScore = (rating: number) => rating / 2

    setFilters({
      priceMin: priceRange[0] !== minPrice ? priceRange[0] : null,
      priceMax: priceRange[1] !== maxPrice ? priceRange[1] : null,
      popularityMin:
        popularityRange[0] !== POPULARITY_MIN
          ? convertRatingToScore(popularityRange[0])
          : null,
      popularityMax:
        popularityRange[1] !== POPULARITY_MAX
          ? convertRatingToScore(popularityRange[1])
          : null,
    })
    setOpen(false)
  }

  const handleResetFilters = () => {
    setPriceRange([minPrice, maxPrice])
    setPopularityRange([POPULARITY_MIN, POPULARITY_MAX])
    setFilters({
      priceMin: null,
      priceMax: null,
      popularityMin: null,
      popularityMax: null,
    })
    setOpen(false)
  }

  const hasActiveFilters =
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.popularityMin !== null ||
    filters.popularityMax !== null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative font-avenir">
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="font-avenir text-2xl">Filters</DialogTitle>
          <DialogDescription className="font-avenir">
            Adjust price and popularity ranges to filter products
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 px-6 py-2 space-y-8 overflow-y-auto">
          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium font-avenir">
                Price Range
              </label>
              <span className="text-sm text-muted-foreground font-avenir">
                ${priceRange[0].toLocaleString()} - $
                {priceRange[1].toLocaleString()}
              </span>
            </div>
            <Slider
              min={minPrice}
              max={maxPrice}
              step={100}
              value={priceRange}
              onValueChange={(value) =>
                setPriceRange(value as [number, number])
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-avenir">
              <span>${minPrice.toLocaleString()}</span>
              <span>${maxPrice.toLocaleString()}</span>
            </div>
          </div>

          {/* Popularity Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium font-avenir">
                Popularity Range
              </label>
              <span className="text-sm text-muted-foreground font-avenir">
                {popularityRange[0]} - {popularityRange[1]}
              </span>
            </div>
            <Slider
              min={POPULARITY_MIN}
              max={POPULARITY_MAX}
              step={0.1}
              value={popularityRange}
              onValueChange={(value) =>
                setPopularityRange(value as [number, number])
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-avenir">
              <span>{POPULARITY_MIN}</span>
              <span>{POPULARITY_MAX}</span>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-3 font-avenir">
                Active Filters
              </h4>
              <div className="space-y-2">
                {filters.priceMin !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-avenir">
                      Min Price:
                    </span>
                    <span className="font-medium font-avenir">
                      ${filters.priceMin.toLocaleString()}
                    </span>
                  </div>
                )}
                {filters.priceMax !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-avenir">
                      Max Price:
                    </span>
                    <span className="font-medium font-avenir">
                      ${filters.priceMax.toLocaleString()}
                    </span>
                  </div>
                )}
                {filters.popularityMin !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-avenir">
                      Min Popularity:
                    </span>
                    <span className="font-medium font-avenir">
                      {filters.popularityMin}
                    </span>
                  </div>
                )}
                {filters.popularityMax !== null && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-avenir">
                      Max Popularity:
                    </span>
                    <span className="font-medium font-avenir">
                      {filters.popularityMax}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t space-y-2">
          <Button onClick={handleApplyFilters} className="w-full font-avenir">
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="w-full font-avenir"
          >
            <X className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>
          <DialogClose asChild>
            <Button variant="ghost" className="w-full font-avenir">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
