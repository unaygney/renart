'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { trpc } from '@/utils/trpc'

export default function Home() {
  type ColorOption = keyof Product['images']
  const [selectedColor, setSelectedColor] = useState<ColorOption>('yellow')
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data: products = [], isLoading } = useQuery(
    trpc.product.getAll.queryOptions()
  )

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
  }

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
  }

  const getRating = (popularityScore: number) => {
    // Convert popularity score to 1-5 rating
    return Math.min(5, Math.max(1, Math.round(popularityScore * 2)))
  }

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getColorName = (color: ColorOption) => {
    switch (color) {
      case 'yellow':
        return 'Yellow Gold'
      case 'rose':
        return 'Rose Gold'
      case 'white':
        return 'White Gold'
    }
  }

  const getColorHex = (color: ColorOption) => {
    switch (color) {
      case 'yellow':
        return '#E6CA97'
      case 'rose':
        return '#E1A4A9'
      case 'white':
        return '#D9D9D9'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
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

  const currentProduct = products[currentIndex] as Product
  const rating = getRating(currentProduct.popularityScore)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            {/* Navigation Arrows */}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
              onClick={prevProduct}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg"
              onClick={nextProduct}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Product Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 mx-16">
              <div className="flex flex-col items-center space-y-6">
                {/* Product Image */}
                <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={currentProduct.images[selectedColor]}
                    alt={currentProduct.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-ring.jpg'
                    }}
                  />
                </div>

                {/* Product Title */}
                <h2 className="text-xl font-medium text-gray-900">
                  {currentProduct.name}
                </h2>

                {/* Price */}
                <p className="text-lg font-medium text-gray-900">
                  ${currentProduct.price.toFixed(2)} USD
                </p>

                {/* Color Options */}
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex space-x-3">
                    {(['yellow', 'rose', 'white'] as ColorOption[]).map(
                      (color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border-2 ${
                            selectedColor === color
                              ? 'border-gray-800'
                              : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: getColorHex(color) }}
                        />
                      )
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {getColorName(selectedColor)}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                  <div className="flex">{getRatingStars(rating)}</div>
                  <span className="text-sm text-gray-600">{rating}/5</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-md h-1 bg-gray-200 rounded-full">
                <div
                  className="h-1 bg-gray-400 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / products.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Product Counter */}
            <div className="mt-4 text-center text-sm text-gray-500">
              {currentIndex + 1} of {products.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
