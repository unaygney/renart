import { db } from '../../../db'
import { product } from '../../../db/schema/product'
import { fetchGoldPrice } from '../../../lib/gold'
import { calculateProductPrice } from '../../../lib/pricing'
import { NextResponse } from 'next/server'

export async function GET() {
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

    // Return in tRPC format
    return NextResponse.json({
      result: {
        data: productsWithPrices,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        error: {
          message: 'Failed to fetch products',
        },
      },
      { status: 500 }
    )
  }
}
