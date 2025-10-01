import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts popularity score to 1-5 rating
 * @param popularityScore
 * @returns
 */
export const getRating = (popularityScore: number) => {
  return Math.min(5, Math.max(1, Math.round(popularityScore * 2)))
}
