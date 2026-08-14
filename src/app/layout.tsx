import { type Metadata } from 'next'
import { Space_Grotesk, Playfair_Display, JetBrains_Mono } from 'next/font/google'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/layout/Layout'
import { AIChatWidget } from '@/components/overlays/AIChatWidget'
import { MagneticCursor } from '@/components/ui/MagneticCursor'

import '@/styles/tailwind.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Roqeeb Ismail',
    default: 'Roqeeb Ismail — Software Engineer, Visual Designer & Microsoldering Specialist',
  },
  description:
    'Software engineer, visual designer, and professional microsoldering specialist. Building high-performance interfaces and repairing devices at the circuit level.',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${spaceGrotesk.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex h-full bg-[#0a0a0a] text-[#f0f0f0]">
        <Providers>
          <MagneticCursor />
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
          <AIChatWidget />
        </Providers>
      </body>
    </html>
  )
}
