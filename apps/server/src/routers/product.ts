import { db } from '../db'
import { product } from '../db/schema/product'
import { applyFilters } from '../lib/filters'
import { fetchGoldPrice } from '../lib/gold'
import { calculateProductPrice } from '../lib/pricing'
import { publicProcedure, router } from '../lib/trpc'
import { eq } from 'drizzle-orm'
import z from 'zod'

export const productRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    try {
      const products = await db.select().from(product)

      const goldPrice = await fetchGoldPrice()

      const productsWithPrices = products.map((productItem) => ({
        ...productItem,
        price: calculateProductPrice(
          productItem.popularityScore,
          productItem.weight,
          goldPrice
        ),
      }))

      const filteredProducts = applyFilters(productsWithPrices, ctx)

      return filteredProducts
    } catch (error) {
      console.error('Error fetching products:', error)
      throw new Error('Failed to fetch products')
    }
  }),

  getPriceRange: publicProcedure.query(async () => {
    try {
      const products = await db.select().from(product)

      const goldPrice = await fetchGoldPrice()

      const prices = products.map((productItem) =>
        calculateProductPrice(
          productItem.popularityScore,
          productItem.weight,
          goldPrice
        )
      )

      if (prices.length === 0) {
        return { min: 0, max: 1000 }
      }

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      return {
        min: Math.floor(minPrice / 100) * 100,
        max: Math.ceil(maxPrice / 100) * 100,
      }
    } catch (error) {
      console.error('Error fetching price range:', error)
      throw new Error('Failed to fetch price range')
    }
  }),

  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const productItem = await db
          .select()
          .from(product)
          .where(eq(product.id, input.id))
          .limit(1)

        if (!productItem.length) {
          throw new Error('Product not found')
        }

        const goldPricePerGram = await fetchGoldPrice()

        const productWithPrice = {
          ...productItem[0],
          price: calculateProductPrice(
            productItem[0].popularityScore,
            productItem[0].weight,
            goldPricePerGram
          ),
        }

        return productWithPrice
      } catch (error) {
        console.error('Error fetching product:', error)
        throw new Error('Failed to fetch product')
      }
    }),
})
