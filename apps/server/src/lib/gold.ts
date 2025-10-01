/**
 * Fetches the current gold price from the external API and converts it to price per gram
 * @returns Promise<number> - The current gold price per gram in USD
 */
export async function fetchGoldPrice(): Promise<number> {
  try {
    const response = await fetch(process.env.GOLD_API_URL!, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error(
        `Gold API request failed: ${response.status} ${response.statusText}`
      )
    }

    // API returns price per ounce, convert to price per gram
    // 1 ounce = 31.1035 grams
    const data = await response.json()
    const pricePerOunce = data.price

    const pricePerGram = convertOunceToGram(pricePerOunce)

    return pricePerGram
  } catch (error) {
    console.error('Error fetching gold price:', error)
    throw new Error('Failed to fetch current gold price')
  }
}

/**
 * Converts ounces to grams
 * @param ounce - The number of ounces to convert
 * @returns The number of grams
 */
function convertOunceToGram(ounce: number): number {
  return ounce / 31.1035
}
