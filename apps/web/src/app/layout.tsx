import '../index.css'
import type { Metadata } from 'next'

import { avenir, montserrat } from '@/lib/font'

import Providers from '@/components/providers'

export const metadata: Metadata = {
  title: 'Renart',
  description: 'Renart',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${avenir.variable} ${montserrat.variable} antialiased`}>
        <Providers>
          <div className=" h-svh">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
