import type { AppRouter } from '../../../server/src/routers'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { toast } from 'sonner'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: 'retry',
          onClick: () => {
            queryClient.invalidateQueries()
          },
        },
      })
    },
  }),
})

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/trpc`,
      fetch(url, options) {
        // Append current URL search params to the tRPC request
        if (typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search)
          if (searchParams.toString()) {
            const urlString = typeof url === 'string' ? url : url.toString()
            const urlObj = new URL(urlString)
            searchParams.forEach((value, key) => {
              urlObj.searchParams.set(key, value)
            })
            return fetch(urlObj.toString(), options)
          }
        }
        return fetch(url, options)
      },
    }),
  ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})
