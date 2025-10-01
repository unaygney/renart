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
