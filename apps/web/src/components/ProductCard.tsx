'use client'

import { type Product } from '../../../server/src/db/schema/product'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { avenir, montserrat } from '@/lib/font'
import { getRating } from '@/lib/utils'

type ProductWithPrice = Product & { price: number }
type ColorOption = keyof Product['images']

interface ProductCardProps {
  product: ProductWithPrice
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<ColorOption>('yellow')
  const rating = getRating(product.popularityScore)

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

  return (
    <div className="bg-white rounded-lg  p-6 flex flex-col items-start space-y-2.5 w-full max-w-sm mx-auto">
      {/* Product Image */}
      <div className="w-48 h-48 relative bg-gray-100 rounded-lg flex items-center justify-center">
        <Image
          src={product.images[selectedColor]}
          alt={product.name}
          fill
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Title */}
      <h3
        className={`text-[15px] font-medium text-gray-900 text-center ${montserrat.className}`}
      >
        {product.name}
      </h3>

      {/* Price */}
      <p
        className={`text-[15px] font-normal text-gray-900 ${montserrat.className}`}
      >
        ${product.price.toFixed(2)} USD
      </p>

      {/* Color Options */}
      <div className="flex flex-col items-start space-y-2">
        <div className="flex space-x-3">
          {(['yellow', 'rose', 'white'] as ColorOption[]).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              aria-pressed={selectedColor === color}
              className={`w-7 h-7 rounded-full flex items-center justify-center bg-white transition-all duration-200 ${
                selectedColor === color ? 'border border-black' : ''
              }`}
            >
              <span
                className="block rounded-full w-5 h-5"
                style={{ backgroundColor: getColorHex(color) }}
              />
            </button>
          ))}
        </div>
        <p
          className={`text-[12px] font-medium text-gray-800 ${avenir.className}`}
        >
          {getColorName(selectedColor)}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2">
        <div className="flex">{getRatingStars(rating)}</div>
        <span className={`text-[14px] text-gray-600 ${avenir.className}`}>
          {rating}/5
        </span>
      </div>
    </div>
  )
}
