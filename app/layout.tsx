import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'Acme',
  description: 'Your workspace, your way.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body>
          <Navbar />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  )
}