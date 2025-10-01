import type { NextRequest } from 'next/server'

export async function createContext(req: NextRequest) {
  const url = new URL(req.url)
  const queryParams = Object.fromEntries(url.searchParams.entries())

  return {
    queryParams,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
