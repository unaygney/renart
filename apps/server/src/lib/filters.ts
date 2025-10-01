import type { Context } from './context'

export interface ProductWithPrice {
  id: number
  name: string
  weight: number
  popularityScore: number
  price: number
}

export interface FilterOptions {
  priceMin?: number
  priceMax?: number
  popularityMin?: number
  popularityMax?: number
}

/**
 * Extracts filter options from query parameters
 */
export function extractFilterOptions(
  queryParams: Record<string, string>
): FilterOptions {
  return {
    priceMin: queryParams.priceMin ? Number(queryParams.priceMin) : undefined,
    priceMax: queryParams.priceMax ? Number(queryParams.priceMax) : undefined,
    popularityMin: queryParams.popularityMin
      ? Number(queryParams.popularityMin)
      : undefined,
    popularityMax: queryParams.popularityMax
      ? Number(queryParams.popularityMax)
      : undefined,
  }
}

/**
 * Filters products based on the provided filter options
 */
export function filterProducts(
  products: ProductWithPrice[],
  filters: FilterOptions
): ProductWithPrice[] {
  return products.filter((product) => {
    // Filter by price range
    if (filters.priceMin !== undefined && product.price < filters.priceMin) {
      return false
    }
    if (filters.priceMax !== undefined && product.price > filters.priceMax) {
      return false
    }

    // Filter by popularity range
    if (
      filters.popularityMin !== undefined &&
      product.popularityScore < filters.popularityMin
    ) {
      return false
    }
    if (
      filters.popularityMax !== undefined &&
      product.popularityScore > filters.popularityMax
    ) {
      return false
    }

    return true
  })
}

/**
 * Convenience function that combines extraction and filtering
 */
export function applyFilters(
  products: ProductWithPrice[],
  ctx: Context
): ProductWithPrice[] {
  const filters = extractFilterOptions(ctx.queryParams)
  return filterProducts(products, filters)
}
