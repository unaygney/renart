/**

/**
 * Calculates the price of a product based on popularity score, weight, and gold price
 * Formula: Price = (popularityScore + 1) * weight * goldPrice
 * 
 * @param popularityScore - The popularity score of the product
 * @param weight - The weight of the product in grams
 * @param goldPrice - The current gold price per gram
 * @returns The calculated price of the product
 */
export function calculateProductPrice(
  popularityScore: number,
  weight: number,
  goldPrice: number
): number {
  return (popularityScore + 1) * weight * goldPrice
}
