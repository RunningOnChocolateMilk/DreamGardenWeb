import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { StoreProvider } from '@/lib/store'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DreamGarden - Your AI-Powered Garden Companion',
  description: 'Manage your garden with AI assistance, weather tracking, and smart recommendations',
  keywords: ['garden', 'ai', 'weather', 'plants', 'gardening', 'assistant'],
  authors: [{ name: 'DreamGarden Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Navigation />
          <main className="lg:ml-64">
            {children}
          </main>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  )
}
